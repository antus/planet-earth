"use script" //It is recommended to turn on strict mode in the development environment
;(function (window, mars3d) {
  //Create a widget class, which needs to inherit BaseWidget
  class MyWidget extends es5widget.BaseWidget {
    //External resource configuration
    get resources() {
      return ["view.css"]
    }

    //Pop-up window configuration
    get view() {
      return {
        type: "append",
        url: "view.html",
        parent: "body"
      }
    }

    //Initialization [executed only once]
    create() {
      this.storageName = "mars3d_queryGaodePOI"
      this.pageSize = 6
      this.allpage = 0
      this.thispage = 0

      //Create vector data layer
      this.graphicLayer = new mars3d.layer.GraphicLayer({
        name: this.config.name,
        pid: 99 //Used in layer management, parent node id
      })
      //Information panel pop-up window after mouse click
      this.graphicLayer.bindPopup(
        function (event) {
          let item = event.graphic?.attr
          if (!item) {
            return
          }

          let inHtml = `<div class="mars-popup-titile"><a href="https://www.amap.com/detail/${item.id}"  target="_black" style="color: #ffffff; ">${item.name}</a></div><div class="mars-popup-content" >`

          let phone = $.trim(item.tel)
          if (phone != "") {
            inHtml += "<div><label>Phone</label>" + phone + "</div>"
          }

          let dz = $.trim(item.address)
          if (dz != "") {
            inHtml += "<div><label>Address</label>" + dz + "</div>"
          }

          if (item.type) {
            let fl = $.trim(item.type)
            if (fl != "") {
              inHtml += "<div><label>Category</label>" + fl + "</div>"
            }
          }
          inHtml += "</div>"

          return inHtml
        },
        { has3dtiles: false }
      )

      //Query controller
      this._queryPoi = new mars3d.query.GaodePOI({
        // city: 'Hefei City',
      })
    }
    //Called after each window is created
    winCreateOK(opt, result) {
      if (opt.type != "append") {
        return
      }
      let that = this
      let img = $("#map-querybar img")
      img.each((index, item) => {
        $(item).attr("src", this.path + $(item).attr("src"))
      })

      if (this.config.position) {
        $("#map-querybar").css(this.config.position)
      }
      if (this.config.style) {
        $("#map-querybar").css(this.config.style)
      }

      // search bar
      $("#txt_querypoi").click(function () {
        //The content of the text box is empty
        if ($.trim($(this).val()).length === 0) {
          that.hideAllQueryBarView()
          that.showHistoryList() // Show history records
        }
      })

      let timetik = 0

      //The value of the text box bound to the search box changes, hides the default search information bar, and displays the matching result list
      $("#txt_querypoi").bind("input propertychange", () => {
        clearTimeout(timetik)
        timetik = setTimeout(() => {
          this.hideAllQueryBarView()
          this.clearLayers()

          let queryVal = $.trim($("#txt_querypoi").val())
          if (queryVal.length == 0) {
            //The content of the text box is empty and the history record is displayed.
            this.showHistoryList()
          } else {
            this.autoTipList(queryVal, true)
          }
        }, 500)
      })

      // Click the search query button
      $("#btn_querypoi").click(() => {
        clearTimeout(timetik)
        this.hideAllQueryBarView()

        let queryVal = $.trim($("#txt_querypoi").val())
        this.strartQueryPOI(queryVal, true)

        // //Demo: throw event
        // let layer = this.map.getLayer(203012, "id"); //Confucian Temple layer
        // layer.show = true; // Check for demonstration
        // this.map.addLayer(layer);

        // es5widget.fire("checkLayer", { layer });
      })
      //Bind the enter key
      $("#txt_querypoi").bind("keydown", (event) => {
        if (event.keyCode == "13") {
          $("#btn_querypoi").click()
        }
      })

      // Return to the query results panel interface
      $("#querybar_detail_back").click(() => {
        this.hideAllQueryBarView()
        $("#querybar_resultlist_view").show()
      })
    }
    //Open activation
    activate() {
      this.map.addLayer(this.graphicLayer)

      // Lower status bar prompt
      const locationBar = this.map.controls.locationBar?.container
      if (locationBar) {
        this.queryAddressDOM = mars3d.DomUtil.create(
          "div",
          "mars3d-locationbar-content mars3d-locationbar-autohide",
          this.map.controls.locationBar.container
        )
        this.queryAddressDOM.style.marginRight = "50px"
      }

      //Click map event
      this.map.on(mars3d.EventType.clickMap, this.onMapClick, this)
      this.map.on(mars3d.EventType.cameraChanged, this.onMapCameraChanged, this)
      this.onMapCameraChanged()
    }
    //Close release
    disable() {
      this.map.removeLayer(this.graphicLayer)

      //Release click map event
      this.map.off(mars3d.EventType.clickMap, this.onMapClick, this)
      this.map.off(mars3d.EventType.cameraChanged, this.onMapCameraChanged, this)

      if (this.queryAddressDOM) {
        mars3d.DomUtil.remove(this.queryAddressDOM)
        delete this.queryAddressDOM
      }

      this.hideAllQueryBarView()
      this.clearLayers()
    }
    onMapClick(event) {
      // Click on the map area to hide all pop-up boxes
      if ($.trim($("#txt_querypoi").val()).length == 0) {
        this.hideAllQueryBarView()
        $("#txt_querypoi").blur()
      }
    }
    onMapCameraChanged(event) {
      let radius = this.map.camera.positionCartographic.height //Unit: meters
      if (radius > 100000) {
        this.address = null
        this.queryAddressDOM.innerHTML = ""
        return
      }

      this._queryPoi.getAddress({
        location: this.map.getCenter(),
        success: (result) => {
          // console.log("address", result);
          this.address = result
          this.queryAddressDOM.innerHTML = "Address:" + result.address
        }
      })
    }
    hideAllQueryBarView() {
      $("#querybar_histroy_view").hide()
      $("#querybar_autotip_view").hide()
      $("#querybar_resultlist_view").hide()
    }

    // Click on the panel entry to automatically fill in the search box and display the search results panel
    autoSearch(name) {
      $("#txt_querypoi").val(name)
      $("#btn_querypoi").trigger("click")
    }

    //====================Interacting with the background========================

    //Display smart prompt search results
    autoTipList(text, queryEx) {
      //When entering longitude and latitude numbers
      if (this.isLonLat(text)) {
        return
      }

      //Query external widget
      if (this.hasExWidget() && queryEx) {
        this.autoExTipList(text)
        return
      }
      //Query external widget

      //Search tips
      this._queryPoi.autoTip({
        text: text,
        city: this.address?.city,
        location: this.map.getCenter(),
        success: (result) => {
          let inhtml = ""
          let pois = result.list
          for (let index = 0; index < pois.length; index++) {
            let name = pois[index].name
            // var num = pois[index].num;
            // if (num > 0) continue;

            inhtml += "<li><i class='fa fa-search'></i><a href=\"javascript:queryGaodePOIWidget.autoSearch('" + name + "');\">" + name + "</a></li>"
          }
          if (inhtml.length > 0) {
            $("#querybar_ul_autotip").html(inhtml)
            $("#querybar_autotip_view").show()
          }
        }
      })
    }

    // Query the display list based on the content of the input box
    strartQueryPOI(text, queryEx) {
      if (text.length == 0) {
        toastr.warning("Please enter the search keyword!")
        return
      }

      // TODO: According to the input content in the text box, fuzzy query from the database to all matching results (displayed in pages)
      this.addHistory(text)

      this.hideAllQueryBarView()

      //When entering longitude and latitude numbers
      if (this.isLonLat(text)) {
        this.centerAtLonLat(text)
        return
      }

      //Query external widget
      if (this.hasExWidget() && queryEx) {
        let qylist = this.queryExPOI(text)
        return
      }
      //Query external widget

      this.thispage = 1
      this.queryText = text

      this.query_city = this.address?.city
      // this.query_location = this.map.getCenter()
      // this.query_radius = this.map.camera.positionCartographic.height //Unit: meters

      this.queryTextByServer()
    }
    queryTextByServer() {
      //Query to get data
      this._queryPoi.queryText({
        text: this.queryText,
        count: this.pageSize,
        page: this.thispage - 1,
        city: this.query_city,
        // location: this.query_location,
        // radius: this.query_radius,
        success: (result) => {
          if (!this.isActivate) {
            return
          }
          this.showPOIPage(result.list, result.allcount)
        }
      })
    }

    //====================Display query result processing========================
    showPOIPage(data, counts) {
      // count -- displays the number of search results; data -- attributes of the results, such as address, phone number, etc.

      if (counts < data.length) {
        counts = data.length
      }
      this.allpage = Math.ceil(counts / this.pageSize)

      let inhtml = ""
      if (counts == 0) {
        inhtml += '<div class="querybar-page"><div class="querybar-fl">No results found for "<strong>' + this.queryText + '</strong>"</div></ div>'
      } else {
        this.objResultData = this.objResultData || {}
        for (let index = 0; index < data.length; index++) {
          let item = data[index]
          let startIdx = (this.thispage - 1) * this.pageSize
          item.index = startIdx + (index + 1)

          let _id = index

          inhtml += `<div class="querybar-site" onclick="queryGaodePOIWidget.showDetail('${_id}')">
            <div class="querybar-sitejj">
              <h3>${item.index}、${item.name}
              <a id="btnShowDetail" href="https://www.amap.com/detail/${item.id}" target="_blank" class="querybar-more">More></a> < /h3>
              <p> ${item.address || ""}</p>
            </div>
          </div> `

          this.objResultData[_id] = item
        }

        //Paging information
        let _fyhtml
        if (this.allpage > 1) {
          _fyhtml =
            '<div class="querybar-ye querybar-fr">' +
            this.thispage +
            "/" +
            this.allpage +
            'Page <a href="javascript:queryGaodePOIWidget.showFirstPage()">Home</a> <a href="javascript:queryGaodePOIWidget.showPretPage()"><</a> <a href="javascript:queryGaodePOIWidget.showNextPage ()">></a> </div>'
        } else {
          _fyhtml = ""
        }

        //bottom information
        inhtml += '<div class="querybar-page"><div class="querybar-fl">Found<strong>' + counts + "</strong>results</div>" + _fyhtml + "</ div>"
      }
      $("#querybar_resultlist_view").html(inhtml)
      $("#querybar_resultlist_view").show()

      this.showPOIArr(data)
      if (counts == 1) {
        this.showDetail("0")
      }
    }
    showFirstPage() {
      this.thispage = 1
      this.queryTextByServer()
    }
    showNextPage() {
      this.thispage = this.thispage + 1
      if (this.thispage > this.allpage) {
        this.thispage = this.allpage
        toastr.warning("This is the last page")
        return
      }
      this.queryTextByServer()
    }

    showPretPage() {
      this.thispage = this.thispage - 1
      if (this.thispage < 1) {
        this.thispage = 1
        toastr.warning("This is already the first page")
        return
      }
      this.queryTextByServer()
    }
    //Click on a single result to display details
    showDetail(id) {
      let item = this.objResultData[id]
      this.flyTo(item)
    }
    clearLayers() {
      this.graphicLayer.closePopup()
      this.graphicLayer.clear()
    }
    showPOIArr(arr) {
      this.clearLayers()

      arr.forEach((item) => {
        let jd = Number(item.lng)
        let wd = Number(item.lat)
        if (isNaN(jd) || isNaN(wd)) {
          return
        }

        item.lng = jd
        item.lat = wd

        //Add entity
        let graphic = new mars3d.graphic.PointEntity({
          position: Cesium.Cartesian3.fromDegrees(jd, wd),
          style: {
            pixelSize: 10,
            color: "#3388ff",
            outline: true,
            outlineColor: "#ffffff",
            outlineWidth: 2,
            scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
            clampToGround: true, //close to the ground
            visibleDepth: false, //whether it is blocked
            label: {
              text: item.name,
              font_size: 20,
              color: "rgb(240,255,255)",
              outline: true,
              outlineWidth: 2,
              outlineColor: Cesium.Color.BLACK,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffsetY: -10, //Offset
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000),
              clampToGround: true, //close to the ground
              visibleDepth: false //Whether it is blocked
            }
          },
          attr: item
        })
        this.graphicLayer.addGraphic(graphic)

        item._graphic = graphic
      })

      if (arr.length > 1) {
        this.graphicLayer.flyTo()
      }
    }
    flyTo(item) {
      let graphic = item._graphic
      if (graphic == null) {
        window.toastr.warning(item.name + "No latitude and longitude coordinate information!")
        return
      }

      this.map.flyToGraphic(graphic, { radius: 2000 })

      setTimeout(() => {
        this.graphicLayer.openPopup(graphic)
      }, 3000)
    }

    //====================Coordinate positioning processing========================
    isLonLat(text) {
      let reg = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]*)?)|180(([.][0] *)?)),-?((0|[1-8]?[0-9]?)(([.][0-9]*)?)|90(([.][0]* )?))$/ /*Define verification expression*/
      return reg.test(text) /*Verify*/
    }
    centerAtLonLat(text) {
      let arr = text.split(",")
      if (arr.length != 2) {
        return
      }

      let jd = Number(arr[0])
      let wd = Number(arr[1])
      if (isNaN(jd) || isNaN(wd)) {
        return
      }

      //Add entity
      let graphic = new mars3d.graphic.PointEntity({
        position: Cesium.Cartesian3.fromDegrees(jd, wd),
        style: {
          color: "#3388ff",
          pixelSize: 10,
          outline: true,
          outlineColor: "#ffffff",
          outlineWidth: 2,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
          clampToGround: true, //close to the ground
          visibleDepth: false //Whether it is blocked
        }
      })
      this.graphicLayer.addGraphic(graphic)

      graphic.bindPopup(`<div class="mars-popup-titile">Coordinate positioning</div>
              <div class="mars-popup-content" >
                <div><label>Longitude</label> ${jd}</div>
                <div><label>Latitude</label>${wd}</div>
              </div>`)

      graphic.openHighlight()

      graphic.flyTo({
        radius: 1000, //Point data: radius controls the sight distance
        scale: 1.5, //Line and surface data: scale controls the amplification ratio of the boundary
        complete: () => {
          graphic.openPopup()
        }
      })
    }

    //====================History related========================
    showHistoryList() {
      $("#querybar_histroy_view").hide()

      localforage.getItem(this.storageName).then((laststorage) => {
        if (laststorage == null) {
          return
        }

        this.arrHistory = eval(laststorage)
        if (this.arrHistory == null || this.arrHistory.length == 0) {
          return
        }

        let inhtml = ""
        for (let index = this.arrHistory.length - 1; index >= 0; index--) {
          let item = this.arrHistory[index]
          inhtml += "<li><a href=\"javascript:queryGaodePOIWidget.autoSearch('" + item + "');\">" + item + "</a></li>"
        }
        // <i class='fa fa-history'/>
        $("#querybar_ul_history").html(inhtml)
        $("#querybar_histroy_view").show()
      })
    }

    clearHistory() {
      this.arrHistory = []
      localforage.removeItem(this.storageName)

      $("#querybar_ul_history").html("")
      $("#querybar_histroy_view").hide()
    }

    //Record historical values
    addHistory(data) {
      this.arrHistory = []
      localforage.getItem(this.storageName).then((laststorage) => {
        if (laststorage != null) {
          this.arrHistory = eval(laststorage)
        }
        //Delete the same record first
        haoutil.array.remove(this.arrHistory, data)

        this.arrHistory.push(data)

        if (this.arrHistory.length > 10) {
          this.arrHistory.splice(0, 1)
        }
        localforage.setItem(this.storageName, this.arrHistory)
      })
    }

    //====================== Query non-Baidu poi, joint query processing =================
    //Whether the external widget exists or is enabled
    hasExWidget() {
      if (window["queryBarWidget"] == null) {
        return false
      } else {
        this.exWidget = window.queryBarWidget
        return true
      }
    }
    autoExTipList(text) {
      this.exWidget.autoTipList(text, () => {
        this.autoTipList(text, false)
      })
    }
    //Call external widget to query
    queryExPOI(text) {
      let layer = this.graphicLayer

      this.exWidget.strartQueryPOI(text, layer, () => {
        this.strartQueryPOI(text, false)
      })
    }
  }

  //Register to the widget manager.
  window.queryGaodePOIWidget = es5widget.bindClass(MyWidget)

  //Each widet is directly introduced into index.html, and there will be naming conflicts with each other, so the closure is used.
})(window, mars3d)
