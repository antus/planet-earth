"use script"; //开发环境建议开启严格模式

(function (window, mars3d) {

  var selectedItem = null; 
  //Widget
  class MyWidget extends mars3d.widget.BaseWidget {
    
    // View
    get view() {
      return {
        type: "window",
        url: "view.html",
        windowOptions: {
          "maxmin": false,
          "resize": false
        },

      };
    }
    // Creation
    create() {
      
    }
    // After view creation
    winCreateOK(opt, result) {
      this.viewWindow = result;



      
      // Illegal building layer
      this.graphicLayer = new mars3d.layer.GraphicLayer({
          hasEdit: true,
          isAutoEditing: true, 
          name: "Illegal Building area",
          pid: 100,
          id: 10030
      });

      this.graphicLayer.bindPopup(
        function (event) {
          let attr = event.graphic?.attr;
          let labelColor = "background-color: #f0ad4ea5;"
          switch (attr.status) {
            case("RUNNING"):
              labelColor = "background-color: #f0ad4ea5;"
              break;
            case("ERROR"):
              labelColor = "background-color: #d9534fa5;"
              break;
            case("COMPLETED"):
              labelColor = "background-color: #6fc774a5;"
              break;
          }

          var results = "";
          if (attr.status!="RUNNING") {
            results = 
              // Processing time
              "<tr>" +
                "<td>" +
                  "<span style='float:left'>Processing time:</span>" +
                "</td>" +
                "<td>" +
                "<span style='float:left'>" + attr.elapsed + "</span>" +
                "</td>" +
              "</tr>" +
              // Totals
              "<tr>" +
                "<td>" +
                  "<span style='float:left'>Totals:</span>" +
                "</td>" +
                "<td>" +
                "<span style='float:left'>" + attr.totals + " buildings" + "</span>" +
                "</td>" +
              "</tr>" +
              // Results
              "<tr>" +
                "<td colspan='2'>" +
                  "<table style='width:100%; margin: 10px 0px'> " +
                    "<tr style='margin: 0px 2px 7px 2px'>" +
                      "<td>" +
                        "<i title='Matched buildings' class='fa fa-cubes' style='color: green;background-color: #ffffffa1; padding: 5px; border-radius: 50%;'></i> " + attr.matched + "<br/>" + 
                      "</td>" +
                      "<td>" +
                        "<i title='Partially matched buildings' class='fa fa-cubes' style='color: blue;background-color: #ffffffa1; padding: 5px; border-radius: 50%;'></i> " + attr.partiallyMatched + "<br/>" + 
                      "</td>" +
                      "<td>" +
                        "<i title='Unmatched buildings' class='fa fa-cubes' style='color: red;background-color: #ffffffa1; padding: 5px; border-radius: 50%;'></i> " + attr.unmatched + "<br/>" + 
                      "</td>" +
                      "<td>" +
                        "<i title='No cadastral data' class='fa fa-cubes' style='color: grey;background-color: #ffffffa1; padding: 5px; border-radius: 50%;'></i> " + attr.noCadastralData + "<br/>" + 
                      "</td>" +
                    "</tr>" +  
                  "</table> " +
                "</td>" +
              "</tr>" + 
              "<tr>" +
                "<td colspan='2'>" +
                  "<div class='chartTwo' id='chartTwo' style='width:100%; height:200px;'>" +
                    "<div id='ul_ZJLY' class='chartTwo_ulzjly' style='width:100%; height:100%;'></div>" + 
                  "</div>"; 
                "</td>" +  
              "</tr>";
          }

          return "<table> " +
                    "<tr style='margin: 0px 2px 7px 2px; border-bottom:1px solid white'>" +
                      "<td colspan'2'>" +
                        "<i class='fa fa-cubes'></i> Illegal Building area<br/>" + 
                      "</td>" +
                    "</tr>" +  
                    "<tr>" +
                      "<td>" +
                        "<span style='float:left'>Id:</span>" +
                      "</td>" +
                      "<td>" +
                        "<span style='float:left'>" + attr.id + "</span>" +
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td>" +
                        "<span style='float:left'>Project name:</span>" +
                      "</td>" +
                      "<td>" +
                        "<span style='float:left'>" + attr.projectName + "</span>" +
                      "</td>" +
                    "</tr>" +
                    "<!--tr>" +
                      "<td>" +
                        "<span style='float:left'>Author:</span>" +
                      "</td>" +
                      "<td>" +
                        "<span style='float:left'>" + attr.author + "</span>" +
                      "</td>" +
                    "</tr-->" +
                    "<tr>" +
                      "<td>" +
                        "<span style='float:left'>Creation date:</span>" +
                      "</td>" +
                      "<td>" +
                        "<span style='float:left'>" + attr.creation + "</span>" +
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td>" +
                        "<span style='float:left' title='Estimated Processing Time'>EPT:</span>" +
                      "</td>" +
                      "<td>" +
                        "<span style='float:left'>" + attr.estimatedProcessingTime + " sec.</span>" +
                      "</td>" +
                    "</tr>" +
                    "<tr>" +
                      "<td>" +
                        "<span style='float:left'>Status:</span>" +
                      "</td>" +
                      "<td>" +
                        "<span class='btn btn-sm' style='float:left; color: white; padding: 1px 5px !important; " + labelColor + "'>" + attr.status + "</span>" +
                      "</td>" +
                    "</tr>" +
                    results +
                  "</table>";
                  
        },
        {
          template: `<div class="marsBlackPanel">
                      <div class="marsBlackPanel-text">{content}</div>
                    </div>`,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
        }
      );

      var data = [];
      let gdpCharts = null;
      this.graphicLayer.on(mars3d.EventType.popupOpen, function (event) {
        let container = event.container; //popup
        let attr = event.graphic?.attr;
        console.log("open popup", container);
        if (attr.status!="RUNNING") {
          data = [
            { value: attr.matched, name: 'Matched', itemStyle: {color: 'rgba(0,255,0,0.5)'} },
            { value: attr.partiallyMatched, name: 'Partially matched', itemStyle: {color: 'rgba(0,0,255,0.5)'} },
            { value: attr.unmatched, name: 'Unmatched', itemStyle: {color: 'rgba(255,0,0,0.5)'} },
            { value: attr.noCadastralData, name: 'No cadastral data', itemStyle: {color: 'rgba(128,128,128,0.5)'} }
          ]
          gdpCharts = initChart(data);
        }
        
      });
      this.graphicLayer.on(mars3d.EventType.popupClose, function (event) {
        let container = event.container; //popup
        console.log("close popup", container);
        if (gdpCharts) {
          gdpCharts.dispose();
          gdpCharts = null;
        }
      });
      

    }


    activate() {
      this.map.addLayer(this.graphicLayer);
      /*
      var layers = this.map.getLayers({ basemaps: false, layers: true });
      for (var i = layers.length - 1; i >= 0; i--) {
        if (layers[i].name=='Cadaster') {
          layers[i].flyTo();
          break;
        }
      }
      */
    }
    // de-activation
    disable() {
        this.viewWindow.clearAll();
        this.map.removeLayer(this.graphicLayer);
        $("#view_illegalbuilding").toggleClass('fa-eye-slash');
        $("#view_illegalbuilding").toggleClass('fa-eye');
    }

    // Add a polygon to the graphicLayer
    addPolygon(item) {
      console.log(item.geom.coordinates);
      const style = this.getStyle(item.status);
      const graphic = new mars3d.graphic.PolylinePrimitive({
        positions: item.geom.coordinates[0],
        name: "updated",
        attr: item,
        style: style
      });

      graphic.on(mars3d.EventType.popupOpen, function (event) {
        setSelectedItem(graphic);
      });
      graphic.on(mars3d.EventType.popupClose, function (event) {
        setSelectedItem(null);
      });

      this.graphicLayer.addGraphic(graphic);
    }

    refreshBuildingsLayer() {
      var layers = this.map.getLayers({ basemaps: false, layers: true });
      for (var i = layers.length - 1; i >= 0; i--) {
        if (layers[i].name=='Buildings from Google' || layers[i].name=='Buildings from ortofoto') {
          layers[i].reload();
        }
      }
    }

    getSelectedGraphic() {
        return getSelectedItem();
    }

    setSelectedGraphic(item) {
      setSelectedItem(item);
    }

    getStyle(status) {
      if (status=="RUNNING") {
        return {
          width: 4,
          material: mars3d.MaterialUtil.createMaterial(
            mars3d.MaterialType.LineTrail, 
            {
            color: Cesium.Color.CHARTREUSE,
            speed: 5,
            }
          ),
          clampToGround: true,
        }
      } else {
        return {
          material: mars3d.MaterialUtil.createMaterial(
            mars3d.MaterialType.Color, 
            {
            color: Cesium.Color.WHITE,
            }
          ),
          width: 2,
          color: "#ffffff",
          clampToGround: true,
        }
      }
    }

  }

  function setSelectedItem(graphic) {
    selectedItem = graphic;
  }

  function getSelectedItem() {
    return selectedItem;
  }

  
  function initChart(data) {
  
    setTimeout(function () {
      window.onresize = function () {
        myChart.resize();
      };
    }, 200);
  
    var myChart = echarts.init(document.getElementById("ul_ZJLY"));
    var option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Building result',
          type: 'pie',
          radius: ['30%', '50%'],
          itemStyle: {
            borderRadius: 5,
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 2
          },
          label: {
            formatter: function (params) {
              let value = '';
              if(params.data === undefined || params.data === null) {
                value = 'N/A';
              } else {
                value = params.percent.toFixed(2);
              }
              return value + "%";
            },
            color: 'white',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: data
        }
      ]
    };
    myChart.setOption(option);
    setTimeout(function () {
      myChart.resize();
    }, 200);
    return myChart;
  }
  

  // widget binding
  mars3d.widget.bindClass(MyWidget);



  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d);