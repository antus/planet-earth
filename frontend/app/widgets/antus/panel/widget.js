"use script" 
;(function (window, mars3d) {



  class MyWidget extends es5widget.BaseWidget {

    get resources() {
      return ["lib/sortable.js","view.css", "view.js"]
    }

    get view() {
      return {
        type: "append",
        url: "view.html",
        parent: "#mars3dContainer"
      }
    }

    create() {
      // catalogs
      this.catalogs = this.config.data;
    }

    winCreateOK(opt, result) {
      this.viewWindow = result
    }

    activate() {
      // initialize nested list
      initPanel(this);
      
      //toastr.info("Panel widget activated");
      
      $("#panel-close-button").click(() => {
        this.setViewShow(null, null);
      });

      // Open when activated
      this.setViewShow();

      // listen for events
      es5widget.on("left-panel", (event) => {
        console.log("Panel widget - left-panel event fetched: " + event.panel);
        var panelName = event.panel;
        if (panelName!="panel")
          this.setViewShow(false, null);
      });

      //Listen to events and link the check status
      this.map.on(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
      this.map.on(mars3d.EventType.removeLayer, this._onRemoveLayerHandler, this)
    }

    //Close release
    disable() {
      this.viewWindow = null

      this.map.off(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
      this.map.off(mars3d.EventType.removeLayer, this._onRemoveLayerHandler, this)
    }

    _onAddLayerHandler(e) {
      console.log("Panel Layer added", e)
      if (!this.isActivate || !this.viewWindow) {
        return
      }
      updateNode(e.layer)
    }
    _onRemoveLayerHandler(e) {
      console.log("Panel Layer removed", e)
      if (!this.isActivate || !this.viewWindow) {
        return
      }
      removeNode(e.layer)
    }

    setViewShow(show, index) {
      this.eachView(function (viewopt) {
        if (show==null){
          if (!jQuery(viewopt._dom).hasClass("panel-show"))
            es5widget.fire("left-panel", {"panel":"panel"});
          else {
            es5widget.fire("left-panel-close", {"panel":"panel"});
          }
          jQuery(viewopt._dom).toggleClass("panel-show");

        } else {
          if (show)
            jQuery(viewopt._dom).addClass("panel-show");
          else {
            jQuery(viewopt._dom).removeClass("panel-show");
          }
        }
      }, index)
    }

    //Update layer: show hidden state (checked layer and its sub-layers, multiple)
    updateLayerShow(layer, show) {
      layer.show = show

      if (show) {
        if (!layer.isAdded) {
          //this.map.off(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
          this.map.addLayer(layer)
          //this.map.on(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
        }
      } else {
        // if (layer.isAdded) {
        //   this.map.removeLayer(layer)
        // }
      }
    }

  }

  //Register to the widget manager.
  es5widget.bindClass(MyWidget)

  //Each widet is directly introduced into index.html, and there will be naming conflicts with each other, so the closure is used.
})(window, mars3d)
