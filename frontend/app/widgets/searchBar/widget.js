"use script"; 

(function (window, mars3d) {

  //BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //Resources
    get resources() {
      return ["view.css"];
    }

    //View
    get view() {
      return {
        type: "append",
        url: "view.html",
        parent: "#search-space"
      };
    }

    //Initialize [execute 1 time only]
    create() {
      this.storageName = "mars3d_queryGaodePOI";
      this.pageSize = 6;
      this.allpage = 0;
      this.thispage = 0;

      // search options
      this.searchOptions = this.config.data;
      this.wfsRequests = [];
      this.results = [];
      this.totalWfsRequests = 0;

      //Create a vector data layer
      this.graphicLayer = new mars3d.layer.GraphicLayer({
        name: this.config.name,
        pid: 99, //Used in layer management, parent node id
        popup: "all",
        symbol: {
            styleOptions: {
                fill: true,
                color: "#39E09B",
                opacity: 0.3,
                outline: true,
                outlineColor: "#39E0ff",
                outlineWidth: 2,
                outlineOpacity: 1,
                clampToGround: true,
            },
        }
      });

    }
    //Called after each window is created
    winCreateOK(opt, result) {
      if (opt.type != "append") {
        return;
      }
      let that = this;
      let img = $("#map-querybar img");
      img.each((index, item) => {
        $(item).attr("src", this.path + $(item).attr("src"));
      });

      if (this.config.position) {
        $("#map-querybar").css(this.config.position);
      }
      if (this.config.style) {
        $("#map-querybar").css(this.config.style);
      }

      // search bar
      $("#txt_querypoi").click(function () {
        // textbox content is empty
        if ($.trim($(this).val()).length === 0) {
          that.hideAllQueryBarView(); 
          that.showHistoryList(); // show history
        } else {
          $("#querybar_resultlist_view").show();
        }
      });

      let timetik = 0;

      // The search box binding text box value changes, hides the default search information bar, and displays a list of matching results
      $("#txt_querypoi").bind("input propertychange", () => {
        clearTimeout(timetik);
        timetik = setTimeout(() => {
          this.hideAllQueryBarView();
          this.clearLayers();

          let queryVal = $.trim($("#txt_querypoi").val());
          if (queryVal.length == 0) {
            // The content of the text box is empty, showing the history
            this.showHistoryList();
          } else {
            this.autoTipList(queryVal, true);
          }
        }, 500);
      });

      // Click the search query button
      $("#btn_querypoi").click(() => {
        clearTimeout(timetik);
        this.hideAllQueryBarView();

        let queryVal = $.trim($("#txt_querypoi").val());
        this.strartQueryPOI(queryVal, true);
      });
      //bind enter key
      $("#txt_querypoi").bind("keydown", (event) => {
        if (event.keyCode == "13") {
          $("#btn_querypoi").click();
        }
      });
      
      $("#txt_querypoi").bind("keyup", (event) => {
          if ($.trim($("#txt_querypoi").val()).length === 0) {
            $("#querybar_delete").css("display", "none");
          } else {
            $("#querybar_delete").css("display", "block");
          }
      });
      
      $("#querybar_delete").click(() => {
        this.autoSearch("");
        $("#querybar_delete").css("display", "none");
        $("#querybar_progress").css("display", "none");
      });

      // Return to the query result panel interface
      $("#querybar_detail_back").click(() => {
        this.hideAllQueryBarView();
        $("#querybar_resultlist_view").show();
      });

      // TDB inserted a new table by F.Pucci
    }
    //打开激活
    activate() {
      this.map.addLayer(this.graphicLayer);

      //单击地图事件
      this.map.on(mars3d.EventType.clickMap, this.onMapClick, this);
      this.map.on(mars3d.EventType.cameraChanged, this.onMapCameraChanged, this);
      this.onMapCameraChanged(); 
    }
    //关闭释放
    disable() {
      this.map.removeLayer(this.graphicLayer);

      //释放单击地图事件
      this.map.off(mars3d.EventType.clickMap, this.onMapClick, this);
      this.map.off(mars3d.EventType.cameraChanged, this.onMapCameraChanged, this);

      this.hideAllQueryBarView();
      this.clearLayers();
    }
    onMapClick(event) {
      // 点击地图区域,隐藏所有弹出框
      //if ($.trim($("#txt_querypoi").val()).length == 0) {
        this.hideAllQueryBarView();
        $("#txt_querypoi").blur();
      //}
    }
    onMapCameraChanged(event) {
      let radius = this.map.camera.positionCartographic.height; //单位：米
      if (radius > 100000) {
        this.address = null;
        return;
      }
    }

    hideAllQueryBarView() {
      $("#querybar_histroy_view").hide();
      $("#querybar_autotip_view").hide();
      $("#querybar_resultlist_view").hide();
    }

    // 点击面板条目,自动填充搜索框,并展示搜索结果面板
    autoSearch(name) {
      $("#txt_querypoi").val(name);
      $("#btn_querypoi").trigger("click");
      $("#querybar_delete").css("display", "block");
    }

    //===================与后台交互========================

    //显示智能提示搜索结果
    autoTipList(text, queryEx) {
      //输入经纬度数字时
      if (this.isLonLat(text)) {
        return;
      }

      //查询外部widget
      if (this.hasExWidget() && queryEx) {
        this.autoExTipList(text);
        return;
      }
    }

    // 根据输入框内容，查询显示列表
    strartQueryPOI(text, queryEx) {
      this.hideAllQueryBarView();
      this.graphicLayer.clear();

      // stop all wfsRequest pending
      for (var i = 0; i < this.wfsRequests.length; i++) {
        this.wfsRequests[i].abort();
      }
      this.wfsRequests = [];
      this.results = [];
      this.totalWfsRequests = 0;

      if (text.length < 2) {
        //toastr.warning("Inserisci le parole chiave di ricerca！");
        return;
      }

      // TODO:根据文本框输入内容,从数据库模糊查询到所有匹配结果（分页显示）
      this.addHistory(text);

      

      //When entering latitude and longitude numbers
      if (this.isLonLat(text)) {
        this.centerAtLonLat(text);
        return;
      }

      //查询外部widget
      if (this.hasExWidget() && queryEx) {
        let qylist = this.queryExPOI(text);
        return;
      }
      //查询外部widget

      this.thispage = 1;
      this.queryText = text;

      this.queryTextByServer();
    }
    queryTextByServer() {
      //Nominatim
      this.totalWfsRequests +=1;
      var xhr = $.ajax({
        type: "GET",
        url: "https://nominatim.openstreetmap.org/?q=" +  this.queryText.trim() +
             "&format=json&bounded=0&polygon_geojson=1&priority=5&returnFullData=false",
        success: function(data) {
          var result = "";
          if (data && data.length > 0) {
            for (let i = 0;i < data.length;i++) {
              var f = data[i]; 
              var feature = {
                name: f.display_name,
                layerName:"Nominatim",
                id: f.place_id,
                type: "Feature",
          			geometry: f.geojson,
                properties: {
                  lat: f.lat,
                  lon: f.lon,
                  classe: f.class,
                  tipo: f.type
                },
                bbox: [
                  f.boundingbox[2],
                  f.boundingbox[0],
                  f.boundingbox[3],
                  f.boundingbox[1]
                ]
              }
              queryGaodePOIWidget.results.push(feature);
            }  
            queryGaodePOIWidget.showPOIPage(queryGaodePOIWidget.results, queryGaodePOIWidget.results.length);
          }
          queryGaodePOIWidget.totalWfsRequests -=1;
          if (queryGaodePOIWidget.totalWfsRequests==0)
            $("#querybar_progress").css("display", "none");
        }
      });
      this.wfsRequests.push(xhr);

      
      //WFS
      var queryString = this.queryText.trim().replaceAll(' ', '%');
      if (this.searchOptions.length>0)
        $("#querybar_progress").css("display", "block");
      for (var index = 0; index < this.searchOptions.length; index++) {
        var item = this.searchOptions[index];
        var array_cqL_filter = [];
        for (var j = 0; j < item.attributes.length; j++) {
            var attribute = item.attributes[j];
            array_cqL_filter.push(attribute + " ilike '%" + queryString + "%'");
        }
        var cqL_filter= array_cqL_filter.join(' OR ');
        var maxFeatures = item.maxFeatures || 5;
        this.totalWfsRequests +=1;
        var xhr = $.ajax({
          type: "GET",
          url: item.url + "?service=WFS&request=GetFeature&version=1.1.0" + 
               "&typeName=" + item.layer +
               "&outputFormat=application/json" +
               "&srsName=EPSG:4326" +
               "&maxFeatures=" + maxFeatures,
          data: {
            CQL_FILTER:  cqL_filter
          },
          success: function(data) {
            var result = "";
            var layerName = "";
            if (data && data.features.length > 0) {
              var feature = data.features[0]; 
              var idParts = feature.id.split(".");
              layerName = idParts[0];
              for (var k = 0; k < queryGaodePOIWidget.searchOptions.length; k++) {
                if (queryGaodePOIWidget.searchOptions[k].name == layerName) {
                  result = queryGaodePOIWidget.searchOptions[k].result;
                }
              }
              for (let i = 0;i < data.features.length;i++) {
                var feature = data.features[i]; 
                feature.name = result.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
                    if (m == "{{") { return "{"; }
                    if (m == "}}") { return "}"; }
                    var attrValue = feature.properties[n];
                    return attrValue; 
                });
                feature.layerName = layerName;
              }  
              for (var r = 0; r < data.features.length; r++) {
                queryGaodePOIWidget.results.push(data.features[r]);
              }
              queryGaodePOIWidget.showPOIPage(queryGaodePOIWidget.results, queryGaodePOIWidget.results.length);
            }
            queryGaodePOIWidget.totalWfsRequests -=1;
            if (queryGaodePOIWidget.totalWfsRequests==0)
              $("#querybar_progress").css("display", "none");
          }
        });
        this.wfsRequests.push(xhr);
      } 
    }

    //===================显示查询结果处理========================
    showPOIPage(data, counts) {
      if (counts < data.length) {
        counts = data.length;
      }
      this.allpage = Math.ceil(counts / this.pageSize);

      let inhtml = "";
      if (counts == 0) {
        inhtml += '<div class="querybar-page"><div class="querybar-fl">Non trovato per "<strong>' + this.queryText + '</strong>"alcun risultato</div></div>';
      } else {
        this.objResultData = this.objResultData || {};
        inhtml += '<div class="querybar-results">';
        for (let index = 0; index < data.length; index++) {
          let item = data[index];
          let startIdx = (this.thispage - 1) * this.pageSize;
          item.index = startIdx + (index + 1);

          let _id = index;

          inhtml += `<div class="querybar-site" onclick="queryGaodePOIWidget.showDetail('${_id}')">
            <div class="querybar-sitejj">
              <h3>${item.name}</h3>
              <p> ${item.layerName || ""}</p>
            </div>
          </div> `;

          this.objResultData[_id] = item;
        }

        //分页信息
        let _fyhtml;
        if (this.allpage > 1) {
          _fyhtml =
            '<div class="querybar-ye querybar-fr">' +
            this.thispage +
            "/" +
            this.allpage +
            'Pagina  <a href="javascript:queryGaodePOIWidget.showFirstPage()">&lt;&lt;</a> <a href="javascript:queryGaodePOIWidget.showPretPage()">&lt;</a>  <a href="javascript:queryGaodePOIWidget.showNextPage()">&gt;</a> </div>';
        } else {
          _fyhtml = "";
        }

        inhtml += '</div>';

        //底部信息
        var found = "risultato";
        if (counts==0 || counts >1)
          found = "risultati";

        inhtml += '<div class="querybar-page"><div class="querybar-fl"><strong>' + counts + "</strong> " + found + "</div></div>";
        
      }
      $("#querybar_resultlist_view").html(inhtml);
      $("#querybar_resultlist_view").show();
    }

    showFirstPage() {
      this.thispage = 1;
      this.queryTextByServer();
    }
    showNextPage() {
      this.thispage = this.thispage + 1;
      if (this.thispage > this.allpage) {
        this.thispage = this.allpage;
        toastr.warning("Questa è l'ultima pagina");
        return;
      }
      this.queryTextByServer();
    }

    showPretPage() {
      this.thispage = this.thispage - 1;
      if (this.thispage < 1) {
        this.thispage = 1;
        toastr.warning("Questa è la prima pagina");
        return;
      }
      this.queryTextByServer();
    }
    //点击单个结果,显示详细
    showDetail(id) {
      let item = this.objResultData[id];
      this.flyTo(item);
    }
    clearLayers() {
      this.graphicLayer.closePopup();
      this.graphicLayer.clear();
    }
    
    flyTo(item) {
      this.graphicLayer.clear();
      item._graphic = mars3d.Util.featureToGraphic(item);
      for (let index = 0; index < item._graphic.length; index++) {
        item._graphic[index].style = {
            color: "#3388ff",
            pixelSize: 2,
            opacity: 0.5,
            clampToGround: true,
            width: 2
        };
        if (item._graphic[index].type=="pointP" || item._graphic[index].type=="polygonP") {
          item._graphic[index].style.outline = true;
          item._graphic[index].style.outlineColor = "#0000ff";
          item._graphic[index].style.outlineWidth = 2;
        }
      }
      this.graphicLayer.addGraphic(item._graphic);
      if (item._graphic == null) {
        window.toastr.warning(item.name + " Nessuna informazione sulle coordinate di latitudine e longitudine! ");
        return;
      }
      this.graphicLayer.flyTo({ duration: 1, scale: 3 });
    }

    //===================坐标定位处理========================
    isLonLat(text) {
      let reg = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]*)?)|180(([.][0]*)?)),-?((0|[1-8]?[0-9]?)(([.][0-9]*)?)|90(([.][0]*)?))$/; /*定义验证表达式*/
      return reg.test(text); /*进行验证*/
    }
    centerAtLonLat(text) {
      let arr = text.split(",");
      if (arr.length != 2) {
        return;
      }

      let jd = Number(arr[0]);
      let wd = Number(arr[1]);
      if (isNaN(jd) || isNaN(wd)) {
        return;
      }

      //添加实体
      let graphic = new mars3d.graphic.PointEntity({
        position: Cesium.Cartesian3.fromDegrees(jd, wd),
        style: {
          color: "#3388ff",
          pixelSize: 10,
          outline: true,
          outlineColor: "#ffffff",
          outlineWidth: 2,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
          clampToGround: true, //贴地
          visibleDepth: false, //是否被遮挡
        },
      });
      this.graphicLayer.addGraphic(graphic);

      graphic.bindPopup(`<div class="mars-popup-titile">Posizionamento alle coordinate specificate</div>
              <div class="mars-popup-content" >
                <div><label>Longitudine:</label>${jd}</div>
                <div><label>Latitudine:</label>${wd}</div>
              </div>`);

      graphic.openHighlight();

      graphic.flyTo({
        radius: 1000, //点数据：radius控制视距距离
        scale: 1.5, //线面数据：scale控制边界的放大比例
        complete: () => {
          graphic.openPopup();
        },
      });
    }

    //===================历史记录相关========================
    showHistoryList() {
      $("#querybar_histroy_view").hide();

      localforage.getItem(this.storageName).then((laststorage) => {
        if (laststorage == null) {
          return;
        }

        this.arrHistory = eval(laststorage);
        if (this.arrHistory == null || this.arrHistory.length == 0) {
          return;
        }

        let inhtml = "";
        for (let index = this.arrHistory.length - 1; index >= 0; index--) {
          let item = this.arrHistory[index];
          inhtml += "<li><span class='fa fa-history'/><a href=\"javascript:queryGaodePOIWidget.autoSearch('" + item + "');\">  " + item + "</a></li>";
        }
        $("#querybar_ul_history").html(inhtml);
        $("#querybar_histroy_view").show();
      });
    }

    clearHistory() {
      this.arrHistory = [];
      localforage.removeItem(this.storageName);

      $("#querybar_ul_history").html("");
      $("#querybar_histroy_view").hide();
    }

    //记录历史值
    addHistory(data) {
      this.arrHistory = [];
      localforage.getItem(this.storageName).then((laststorage) => {
        if (laststorage != null) {
          this.arrHistory = eval(laststorage);
        }
        //先删除之前相同记录
        haoutil.array.remove(this.arrHistory, data);

        this.arrHistory.push(data);

        if (this.arrHistory.length > 10) {
          this.arrHistory.splice(0, 1);
        }
        localforage.setItem(this.storageName, this.arrHistory);
      });
    }

    //======================查询非百度poi，联合查询处理=================
    //外部widget是否存在或启用
    hasExWidget() {
      if (window["queryBarWidget"] == null) {
        return false;
      } else {
        this.exWidget = window.queryBarWidget;
        return true;
      }
    }
    autoExTipList(text) {
      this.exWidget.autoTipList(text, () => {
        this.autoTipList(text, false);
      });
    }
    //调用外部widget进行查询
    queryExPOI(text) {
      let layer = this.graphicLayer;

      this.exWidget.strartQueryPOI(text, layer, () => {
        this.strartQueryPOI(text, false);
      });
    }
  }

  //注册到widget管理器中。
  window.queryGaodePOIWidget = mars3d.widget.bindClass(MyWidget);

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d);
