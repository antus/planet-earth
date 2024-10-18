"use script" //It is recommended to turn on strict mode in the development environment
;(function (window, mars3d) {
  //Create a widget class, which needs to inherit BaseWidget
  class MyWidget extends es5widget.BaseWidget {
  
    get resources() {
      return ["lib/sortable.js","view.css", "view.js"]
    }
  
    get view() {
      return {
        type: "append",
        url: "empty.html"
      }
    }
  
    create() {
      this.catalogs = this.config.properties.catalogs;
    }
  
    winCreateOK(opt, result) {
    }
  
    activate() {
      try {
        var id;
        if (this.config.properties) {
          // get properties 
          const properties = this.config.properties; 
          // Get component Id
          id = properties.id;
          // Create component obj
          this.comp = new LayerManager(this, properties);
        } else {
          // Create component
          id =  mars3d.Util.createGuid();
          var itemConfig = {
            id: id,
            title: "Layer Manager",
            type: 'component',
            componentName: "map-widget",
            componentState: { 
                uri: this.path + "widget.js",
                properties: {
                  id: id
                }
            }
          };
          // Create component  
          window.layout.root.contentItems[0].addChild( itemConfig, 0);
          // Set size (20%)
          window.layout.root.contentItems[0].getItemsById( id )[0].container.setSize(window.innerWidth*20/100);
          // Create component obj
          this.comp = new LayerManager(this, itemConfig.componentState.properties);
        }
        // listen for map widget resize event
        es5widget.on("map-widget-resize", (event) => {
          if (event.id==id && this.comp.resize)
              this.comp.resize();
          });
        // Listen to events and link the check status
        this.map.on(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
        this.map.on(mars3d.EventType.removeLayer, this._onRemoveLayerHandler, this)
      } catch (error) {
        console.error(error);
        // Expected output: ReferenceError: nonExistentFunction is not defined
        // (Note: the exact output may be browser-dependent)
        toastr.error("Layer Manager init error");
      }
    }
  
    disable() {
      var id = this.config.properties.id;
      const element = layout.root.getItemsByType("component").filter(function(item) { 
        if (item.config.id==id)
          return true;
        else return false;
      });
      if (element && element.length>0)
        element[0].remove();	
      this.config.properties = null;
      // Remove listeners to events and link the check status
      this.map.off(mars3d.EventType.addLayer, this._onAddLayerHandler, this)
      this.map.off(mars3d.EventType.removeLayer, this._onRemoveLayerHandler, this)
    }

    _onAddLayerHandler(e) {
      if (!this.isActivate) {
        return
      }
      console.log("Layer added fetched", e)
      this.comp.updateNode(e.layer)
    }
    
    _onRemoveLayerHandler(e) {
      if (!this.isActivate) {
        return
      }
      console.log("Layer removed fetched", e)
      this.comp.removeNode(e.layer)
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
