"use script" //It is recommended to turn on strict mode in the development environment
;(function (window, mars3d) {
  //Create a widget class, which needs to inherit BaseWidget
  class MyWidget extends es5widget.BaseWidget {
  
    get resources() {
      return ["view.css", "view.js"]
    }
  
    get view() {
      return {
        type: "append",
        url: "empty.html"
      }
    }
  
    create() {
      this.instances={};
    }
  
    winCreateOK(opt, result) {
    }
  
    activate() {
      if (this.config.properties) {
        if (!Array.isArray(this.config.properties)) {
          this.config.properties = [this.config.properties];
        }
        for (var i=0; i< this.config.properties.length; i++) {
          // get properties 
          const properties = this.config.properties[i]; 
          // Get component Id
          const id = properties.id;
          // Create component obj
          const comp = new Chart(this, properties);
          // Save the instance 
          this.instances[id] = comp;
          // listen for map widget resize event
          es5widget.on("map-widget-resize", (event) => {
            if (event.id==id && this.instances[id].resize)
                this.instances[id].resize();
          });
        }
      } else {
        // Create component
        const id =  mars3d.Util.createGuid();
        var itemConfig = {
          id: id,
          title: "Chart",
          type: 'component',
          componentName: "map-widget",
          componentState: { 
              uri: this.path + "widget.js",
              properties: {
                id: id,
                server: "http://localhost:8080/geoserver/wps",
                layer: "monitoraggio-ambientale:Comuni",
                type:"bar",
                xAttribute: "regione",
                yAttribute: "comune",
                function: "Count"
              }
          }
        };
        // Create component  
        window.layout.root.contentItems[0].addChild( itemConfig, 0);
        // Set size (20%)
        window.layout.root.contentItems[0].getItemsById( id )[0].container.setSize(window.innerWidth*20/100);
        // Create component obj
        const comp = new Chart(this, itemConfig.componentState.properties);
        // Save the instance 
        this.instances[id] = comp;
        // listen for map widget resize event
        es5widget.on("map-widget-resize", (event) => {
          if (event.id==id && this.instances[id].resize)
              this.instances[id].resize();
        });
      }
      // Reset widget properties
      this.config.properties = null;
      
    }
  
    disable() {
      for (const [key, value] of Object.entries(this.instances)) {
        var id = key;
        const element = layout.root.getItemsByType("component").filter(function(item) { 
          if (item.config.id==id)
            return true;
          else return false;
        });
        if (element && element.length>0)
          element[0].remove();	
      }
      this.instances= {};
      this.config.properties = null;
    }
   
  }
  //Register to the widget manager.
  es5widget.bindClass(MyWidget)

  //Each widet is directly introduced into index.html, and there will be naming conflicts with each other, so the closure is used.
})(window, mars3d)