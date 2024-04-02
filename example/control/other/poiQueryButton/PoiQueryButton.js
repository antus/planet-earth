// poi query button control
class PoiQueryButton extends mars3d.control.BaseControl {
  get parentContainer() {
    return this._map.toolbar
  }

  /**
   * Method to create _container control container object,
   * Will only be called once
   * @return {Promise<object>} None
   * @private
   */
  _mountedHook() {
    //Initialize page
    this._initQueryUI()

    //Query controller
    this._gaodePOI = new mars3d.query.GaodePOI()

    //Create vector data layer
    this.graphicLayer = new mars3d.layer.GraphicLayer()
    this._map.addLayer(this.graphicLayer)

    // Information panel pop-up window after mouse click
    this.graphicLayer.bindPopup(function (event) {
      const item = event.graphic.attr
      if (!item) {
        return
      }
      let inHtml = `<div class="mars3d-template-titile"><a href="https://www.amap.com/detail/${item.id}"  target="_black" style="color: #ffffff; ">${item.name}</a></div><div class="mars3d-template-content" >`

      const phone = String(item.tel).trim()
      if (phone) {
        inHtml += "<div><label>Phone</label>" + phone + "</div>"
      }

      const dz = String(item.address).trim()
      if (item.address) {
        inHtml += "<div><label>Address</label>" + dz + "</div>"
      }

      const fl = String(item.type).trim()
      if (item.type) {
        if (fl !== "") {
          inHtml += "<div><label>Category</label>" + fl + "</div>"
        }
      }
      inHtml += "</div>"

      return inHtml
    })
  }

  clear() {
    const ulList = this._queryResultContainer.querySelector(".searchResults")
    const gaodesousuo = this._queryResultContainer.querySelector(".gaodesousuo")
    if (ulList) {
      ulList.remove()
    }
    if (this.resultNextPages) {
      this.resultNextPages.remove()
    }
    if (gaodesousuo) {
      gaodesousuo.remove()
    }
    if (this.graphicLayer) {
      this.graphicLayer.clear()
    }
  }

  //Initialize all related UI
  _initQueryUI() {
    // Get height value
    this._container = mars3d.DomUtil.create("div", "cesium-button cesium-toolbar-button")
    this._container.style.display = "inline-block"
    this._container.setAttribute("title", this.options.title || "POI Query")

    mars3d.DomUtil.createSvg(
      33,
      33,
      "M29.772,26.433l-7.126-7.126c0.96-1.583,1.523-3.435,1.524-5.421C24.169,8.093,19.478,3.401,13.688,3.399C7.897,3.401,3.204,8.093,3.204,13.885c0,5.789,4.693,10.481,10.484,10.481c1.987,0,3.839-0.563,5.422-1.523l7.128,7.127L29.772,26.433zM7.203,13.885c0.006-3.582,2.903-6.478,6.484-6.486c3.579,0.008,6.478,2.904,6.484,6.486c-0.007,3.58-2.905,6.476-6.484,6.484C10.106,20.361,7.209,17.465,7.203,13.885z",
      this._container
    )

    //mouse move in and out
    let numTime = null
    let cacheTarget
    //Move the search box
    this._container.addEventListener("mouseover", (e) => {
      if (numTime) {
        clearTimeout(numTime)
        numTime = null
      }
      if (this._queryInputContainer.style.display !== "block") {
        this._queryInputContainer.style.top = this._container.offsetTop + "px"
        this._queryResultContainer.style.height = this.parentContainer.offsetHeight - this._container.offsetTop - 31 + "px"

        this.toolActive()
      }
    })
    //Move the search box out
    this._container.addEventListener("mouseout", (e) => {
      numTime = setTimeout(() => {
        console.log("Mouseout triggered? _container")
        cacheTarget = null

        const queryVal = this._queryInputContainer.querySelector(".searchInput").value
        if (queryVal.length === 0) {
          this.clear()
          this.toolSearchNoShow("none")
        }
      }, 500)
    })

    // input panel, below queryPoiButton
    this._queryInputContainer = mars3d.DomUtil.create("div", "toolSearch")
    this.parentContainer.appendChild(this._queryInputContainer)

    //Search box removed
    this._queryInputContainer.addEventListener("mouseover", (e) => {
      if (numTime) {
        clearTimeout(numTime)
        numTime = null
      }
    })

    this._queryInputContainer.addEventListener("input", (e) => {
      if (numTime) {
        clearTimeout(numTime)
        numTime = null
      }
      //Cache to improve efficiency
      if (cacheTarget === this.id) {
        return
      }
      cacheTarget = this.id
      this.toolSearchNoShow("block")
    })
    this._queryInputContainer.addEventListener("mouseout", (e) => {
      numTime = setTimeout(() => {
        cacheTarget = null

        const queryVal = this._queryInputContainer.querySelector(".searchInput").value
        if (queryVal.length === 0) {
          this.clear()
          this.toolSearchNoShow("none")
        }
      }, 500)
    })

    // Search results, under the mars3dContainer panel
    this._queryResultContainer = mars3d.DomUtil.create("div", "poiButtonResult")
    this.parentContainer.appendChild(this._queryResultContainer)
    this.toolSearchNoShow("none")

    //Create input input box
    const textInput = mars3d.DomUtil.create("input", "searchInput")
    textInput.type = "search"
    textInput.setAttribute("placeholder", "Please enter the address...")
    this._queryInputContainer.appendChild(textInput)

    //Input click event
    const deleteInput = mars3d.DomUtil.create("div", "deleteInput", this._queryInputContainer)

    this._addPElement(deleteInput, "×", () => {
      this._queryInputContainer.querySelector(".searchInput").value = ""
      this.clear()
      this.toolSearchNoShow("none")
      // mars3d.DomUtil.removeClass(this._container, "queryPoiButton")
      this._container.style.height = ""
      cacheTarget = null
    })

    //Bind change event
    let timetik
    textInput.addEventListener("input", () => {
      this.clear()
      clearTimeout(timetik)
      timetik = setTimeout(() => {
        const queryVal = this._queryInputContainer.querySelector(".searchInput").value
        if (queryVal.length !== 0) {
          deleteInput.style.display = "block"
          this.autoTip(queryVal)
        }
      }, 250)
    })

    // Bind the Enter key
    textInput.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        clearTimeout(timetik)
        // After the change event is completed, perform the following operations
        timetik = setTimeout(() => {
          this.clear()
          this.showPages = 1
          this.strartQueryPOI()
        }, 250)
      }
    })
  }

  toolActive() {
    this._queryInputContainer.style.display = "block"
    const searchInput = this._queryInputContainer.querySelector(".searchInput")
    searchInput.focus()
    if (document.activeElement.tagName === "INPUT" && searchInput.value === "") {
      return
    }
    this.clear()
    this.showPages = 1
    this.strartQueryPOI()
  }

  // Query the display list based on the content of the input box
  strartQueryPOI() {
    const text = this._queryInputContainer.querySelector(".searchInput").value
    if (text.trim().length === 0) {
      globalMsg("Please enter the search keyword!")
      return
    }
    //When entering latitude and longitude numbers
    if (this.isLonLat(text)) {
      this.centerAtLonLat(text)
      return
    }
    this.queryTextByServer(text)
  }

  queryTextByServer(text) {
    this._gaodePOI.queryText({
      text,
      count: 10,
      page: this.showPages - 1,
      success: (result) => {
        const pois = result.list
        if (pois.length > 0) {
          result.list.forEach((item, index) => {
            let point = null
            if (item.lng && item.lat) {
              point = [item.lng, item.lat]
            }
            if (item.x && item.y) {
              point = [item.x, item.y]
            }
            if (!point) {
              return
            }
            // Display the search results as vector data on the map
            const graphic = new mars3d.graphic.PointEntity({
              id: item.id,
              position: point,
              style: {
                name: item.name,
                pixelSize: 10,
                color: "#3388ff",
                outline: true,
                outlineColor: "#ffffff",
                outlineWidth: 2,
                scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
                clampToGround: true, // close to the ground
                visibleDepth: false, // Whether it is blocked

                highlight: {
                  type: mars3d.EventType.click,
                  color: "#ff0000"
                },

                label: {
                  text: item.name,
                  font_size: 20,
                  color: "rgb(240,255,255)",
                  outline: true,
                  outlineWidth: 2,
                  outlineColor: Cesium.Color.BLACK,
                  horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  pixelOffsetY: -10, // offset
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000),
                  clampToGround: true, // close to the ground
                  visibleDepth: false // Whether it is blocked
                }
              },
              attr: item
            })
            this.graphicLayer.addGraphic(graphic)
          })
          this.graphicLayer.flyTo({
            radius: 2000
          })
          this.showDifferentPagesResult(result)
        }
      }
    })
  }

  flyTo(item) {
    const graphic = this.graphicLayer.getGraphicById(item.id)
    if (graphic === null) {
      globalMsg(item.name + "No latitude and longitude coordinate information!")
      return
    }

    graphic.openHighlight()

    graphic.flyTo({
      radius: 2000,
      complete: () => {
        graphic.openPopup()
      }
    })
  }

  //Construct the panel Html of the query results
  showDifferentPagesResult(result) {
    this._queryResultContainer.innerHTML = ""

    // Display the result li list on the page
    const resultDiv = document.createElement("div")
    resultDiv.className = "searchResults"

    const suggestionsList = document.createElement("ul")
    resultDiv.appendChild(suggestionsList)

    this._queryResultContainer.appendChild(resultDiv)

    result.list.forEach((item, index) => {
      const name = item.name

      let point = null
      if (item.lng && item.lat) {
        point = [item.lng, item.lat]
      }
      if (item.x && item.y) {
        point = [item.x, item.y]
      }
      if (!point) {
        return
      }

      let number
      if (this.showPages > 1) {
        number = (this.showPages - 1) * 10 + index + 1
      } else {
        number = index + 1
      }
      const suggestions = document.createElement("li")
      const resultList = document.createTextNode(number + ". " + name)

      suggestionsList.appendChild(suggestions)
      suggestions.appendChild(resultList)
      suggestions.addEventListener("click", () => {
        this.flyTo(item)
      })
    })
    const allPages = Math.ceil(result.allcount / 10) //The total number of pages 10 = result.count
    this.resultNextPages = document.createElement("div")
    this.resultNextPages.className = "resultNextPages"
    this._queryResultContainer.appendChild(this.resultNextPages)

    //Total number of items loaded
    this._addPElement(this.resultNextPages, "Total loaded" + result.allcount + "bar", null)

    //Number of pages displayed
    this._addPElement(this.resultNextPages, this.showPages + "/" + allPages + "pages", null)

    // front page
    this._addPElement(this.resultNextPages, "Homepage", () => {
      this.showPages = 1
      this.pagesClickToPages()
    })

    // Previous page
    this._addPElement(this.resultNextPages, "<", () => {
      if (this.showPages === 1) {
        globalMsg("This is the first page!")
        return
      }
      this.showPages--
      this.pagesClickToPages()
    })

    // next page
    this._addPElement(this.resultNextPages, ">", () => {
      if (this.showPages >= allPages) {
        globalMsg("This is the last page!")
        return
      }
      this.showPages++
      this.pagesClickToPages() // Query results
    })
  }

  //Add p element
  _addPElement(parentElement, chilidWord, callback) {
    const allResult = document.createElement("p")
    const allResultWord = document.createTextNode(chilidWord)
    parentElement.appendChild(allResult) //Add p element

    allResult.appendChild(allResultWord) // Add content to the p element

    allResult.addEventListener("click", callback)
  }

  // Click on the previous or next page to clear the current page
  pagesClickToPages() {
    if (this.graphicLayer) {
      this.graphicLayer.clear()
    }
    this.strartQueryPOI()
  }

  autoTip(text) {
    this._gaodePOI.autoTip({
      text,
      success: (result) => {
        const pois = result.list
        const gaodesousuo = this._queryResultContainer.querySelector(".gaodesousuo")
        if (gaodesousuo) {
          gaodesousuo.remove()
        }
        const resultDiv = document.createElement("div")
        resultDiv.className = "searchResults gaodesousuo"

        const suggestionsList = document.createElement("ul")
        resultDiv.appendChild(suggestionsList)

        this._queryResultContainer.appendChild(resultDiv)

        if (pois.length > 0) {
          result.list.forEach((item) => {
            const name = item.name

            const suggestions = document.createElement("li")
            const resultList = document.createTextNode(name)
            const fa_search = document.createElement("img")
            fa_search.src = "img/icon/search.svg"
            suggestions.appendChild(fa_search)

            suggestionsList.appendChild(suggestions)
            suggestions.appendChild(resultList)
            suggestions.addEventListener("click", () => {
              this._queryInputContainer.querySelector(".searchInput").value = name

              this.showPages = 1
              this.queryTextByServer(name)
            })
          })
        } else {
          resultDiv.style.display = "none"
        }
      }
    })
  }

  toolSearchNoShow(val) {
    this._queryInputContainer.style.display = val
    this._queryResultContainer.style.display = val
  }

  //= =========================== Coordinate positioning processing ================= ===================
  isLonLat(text) {
    const reg = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]*)?)|180(([.][0] *)?)),-?((0|[1-8]?[0-9]?)(([.][0-9]*)?)|90(([.][0]* )?))$/ /* Define validation expression*/
    return reg.test(text) /* Verify */
  }

  centerAtLonLat(text) {
    const arr = text.split(",")
    if (arr.length !== 2) {
      return
    }

    this._queryResultContainer.style.display = "none"
    const jd = Number(arr[0])
    const wd = Number(arr[1])
    if (isNaN(jd) || isNaN(wd)) {
      return
    }

    this._map.setCameraView({ lng: jd, lat: wd, minz: 2500 })

    //Add entity
    const graphic = new mars3d.graphic.PointEntity({
      position: Cesium.Cartesian3.fromDegrees(jd, wd),
      style: {
        color: "#3388ff",
        pixelSize: 10,
        outline: true,
        outlineColor: "#ffffff",
        outlineWidth: 2,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
        clampToGround: true, // close to the ground
        visibleDepth: false // Whether it is blocked
      }
    })
    this.graphicLayer.addGraphic(graphic)

    graphic.bindPopup(`<div class="mars3d-template-titile">Coordinate positioning</div>
              <div class="mars3d-template-content" >
                <div><label>Longitude</label> ${jd}</div>
                <div><label>Latitude</label>${wd}</div>
              </div>`)

    setTimeout(() => {
      graphic.openPopup()
    }, 3000)
  }
}
mars3d.ControlUtil.register("poiQueryButton", PoiQueryButton)
