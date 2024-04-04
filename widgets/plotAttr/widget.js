"use script" //It is recommended to turn on strict mode in the development environment
;(function (window, mars3d) {
  //Create a widget class, which needs to inherit BaseWidget
  class MyWidget extends es5widget.BaseWidget {
    //Pop-up window configuration
    get view() {
      return {
        type: "window",
        url: "view.html",
        style: "dark",
        windowOptions: {
          skin: "layer-mars-dialog animation-scale-up",
          width: 315,
          position: {
            top: 10,
            left: 5,
            bottom: 30
          }
        }
      }
    }

    //Initialization [executed only once]
    create() {}

    //Called after each window is created
    winCreateOK(opt, result) {
      this.viewWindow = result
    }
    //Activate plugin
    activate() {}
    //Release the plug-in
    disable() {
      let graphic = this.config.graphic
      if (graphic && graphic._minPointNum) {
        graphic.stopEditing()

        if (this.config.sendSaveEntity) {
          this.config.sendSaveEntity()
        }
      }
    }
    getMinPointNum() {
      let graphic = this.config.graphic
      if (graphic && graphic._minPointNum) {
        return graphic._minPointNum
      }
      return 3
    }
    getMaxPointNum() {
      let graphic = this.config.graphic
      if (graphic && graphic._maxPointNum) {
        return graphic._maxPointNum
      }
      return 999
    }
    get defaultAttrList() {
      return [
        { name: "id", label: "primary key", type: "label", defval: "" },
        { name: "name", label: "name", type: "text", defval: "" },
        { name: "remark", label: "notes", type: "textarea", defval: "" }
      ]
    }
    getAttrList() {
      return this.config.attrList || this.defaultAttrList
    }
    getLayerName() {
      let graphic = this.config.graphic
      return graphic?._layer?.name || ""
    }
    getAvailability() {
      let graphic = this.config.graphic

      return mars3d.Util.getAvailabilityJson(graphic.availability)
    }

    startEditing(graphic, lonlats) {
      if (graphic) {
        this.config.graphic = graphic
      }
      if (lonlats) {
        this.config.lonlats = lonlats
      }

      if (this.viewWindow == null) {
        return
      }

      graphic = this.config.graphic
      lonlats = this.config.lonlats

      let config = { ...graphic.options, type: graphic.type, style: graphic.style }
      console.log("Start editing properties", config)

      this.viewWindow.plotEdit.startEditing(config, lonlats)
    }

    //update style
    updateStyle2map(style) {
      console.log("Update style style", style)
      let graphic = this.config.graphic
      graphic.style = style
    }
    //update coordinates
    updatePoints2map(points) {
      console.log("Update coordinates", points)

      let graphic = this.config.graphic
      graphic.positions = points
    }
    //Update properties
    updateAttr2map(attr) {
      let graphic = this.config.graphic
      graphic.attr = attr
    }
    centerCurrentEntity() {
      let graphic = this.config.graphic
      graphic.flyTo()
    }
    getAndSetMapTime(date) {
      if (!date) {
        const start = map.clock.currentTime.clone()
        const stop = Cesium.JulianDate.addSeconds(start, 10, new Cesium.JulianDate())
        return { start: this.formatDate(Cesium.JulianDate.toDate(start)), stop: this.formatDate(Cesium.JulianDate.toDate(stop)) }
      } else {
        const toJulian = Cesium.JulianDate.fromDate(new Date(date))
        const stop = Cesium.JulianDate.addSeconds(toJulian, 5, new Cesium.JulianDate())
        return this.formatDate(Cesium.JulianDate.toDate(stop))
      }
    }

    formatDate(time) {
      return mars3d.Util.formatDate(time, "yyyy-MM-dd HH:mm:ss")
    }

    deleteEntity() {
      let graphic = this.config.graphic
      if (graphic.stopEditing) {
        graphic.stopEditing()
      }
      graphic.remove()

      this.disableBase()
    }

    //File processing
    getGeoJson() {
      let graphic = this.config.graphic
      let geojson = graphic.toGeoJSON()
      geojson.properties._layer = graphic._layer.name //Record grouping information

      return geojson
    }
    //timing
    availabilityChange(availability) {
      // console.log("availability", availability)
      let graphic = this.config.graphic

      if (availability && availability.length) {
        graphic.availability = availability
      } else {
        graphic.availability = null
      }
    }
  }

  //Register to the widget manager.
  es5widget.bindClass(MyWidget)

  //Each widet is directly introduced into index.html, and there will be naming conflicts with each other, so the closure is used.
})(window, mars3d)
