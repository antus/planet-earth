"use script" 
;(function (window, mars3d) {
  
  class MyWidget extends es5widget.BaseWidget {
  
    get resources() {
      return ["view.css", "view.js"]
    }
  
    get view() {
      return {
        type: "append",
        url: "view.html",
        parent: "#mars3dContainer"
      }
    }
    
    create() {}
    
    winCreateOK(opt, result) {
      
    }
    
    activate() {
      // initialize nested list
      initTableDataPanel(this);

      // Layer Data layer
      this.geoJsonLayer = new mars3d.layer.GeoJsonLayer({
        symbol: function( attr, style, feature){
            console.log(feature);
            // Point style            
            var obj = {
                image: "/img/marker/mark-blue.png",
                scale: 1,
                highlight: { type: "click", image: "/img/marker/mark-red.png" },
                clampToGround: true
            }
            if (feature.geometry.type.toLowerCase().includes("polyline") || 
                feature.geometry.type.toLowerCase().includes("polygon")) {
              obj = {
                type: "polyline",
                clampToGround: true,
                color: "rgba(0,0,255,0.8)",
                width: 5  
                
              }
            }
          return obj;
        }
      })
      this.geoJsonLayer.bindPopup(function (event) {
        const attr = event.graphic.attr || {}
        console.log("Call bindPopup");
        return "<iframe id='layer-data-iframe' src='/widgets/antus/layer-table/pie-rose.html' style='border: 0; margin-top: 5px;'></iframe>"
      })

      this.geoJsonLayer.on(mars3d.EventType.popupOpen, function (event) {
        let attr = event.graphic?.attr;
        var iframe = $("#layer-data-iframe");
        var childWindow = iframe[0].contentWindow;
        console.log("Call postMessage(attr)");
        iframe[0].addEventListener("load", () => {
          childWindow.postMessage(attr);
        });
      });

      this.map.addLayer(this.geoJsonLayer)

      $("#layer-table-panel-close-button").click(() => {
        this.setViewShow(null, null);
      });

      // listen for event layer-data
      es5widget.on("layer-data", (event) => {
        console.log("Layer table widget - layer fetched: " + event.layer);
        loadLayerData(event.layer);
      });

      // listen for event "left panel close"
      es5widget.on("left-panel-close", (event) => {
        if ($(".panel-table").is(":visible"))
          $(".panel-table").css("left", 10);
      });

      // listen for event "left panel open"
      es5widget.on("left-panel", (event) => {
        if ($(".panel-table").is(":visible"))
          $(".panel-table").css("left", $(".panel").width() + 20);
      });
      
    }

    setViewShow(show, index) {
      this.eachView(function (viewopt) {
        if (show==null){
          jQuery(viewopt._dom).toggleClass("panel-table-show");
        } else {
          if (show) {
            $(".panel-table").css("left", $(".panel").width() + 20);
            jQuery(viewopt._dom).addClass("panel-table-show");
          }
          else
          jQuery(viewopt._dom).removeClass("panel-table-show");
        }
      }, index)
    }

    
    disable() {
      this.map.removeLayer(this.geoJsonLayer);
    }
  }

  
  es5widget.bindClass(MyWidget)

  
})(window, mars3d)
