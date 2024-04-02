//Using the algorithm of Amap positioning
// Refer to the help documentation: https://lbs.amap.com/api/javascript-api/guide/services/geolocation

class Geolocation extends mars3d.control.ToolButton {
  /**
   * Method to create _container control container object,
   * Will only be called once
   * @return {Promise<object>} None
   * @private
   */
  _mountedHook() {
    // zoom out
    this._container = mars3d.DomUtil.create("div", "cesium-button cesium-toolbar-button tracking-deactivated")
    this._container.setAttribute("title", "View GPS location")

    this._container.addEventListener("click", (e) => {
      // one time tracking
      this.startTracking()
    })
  }

  stopTracking() {
    mars3d.DomUtil.removeClass(this._container, "tracking-activated")
    mars3d.DomUtil.addClass(this._container, "tracking-deactivated")

    this.clearLocationPoint()
  }

  startTracking() {
    AMap.plugin("AMap.Geolocation", () => {
      mars3d.DomUtil.removeClass(this._container, "tracking-deactivated")
      mars3d.DomUtil.addClass(this._container, "tracking-activated")

      if (!this.geolocation) {
        this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // Whether to use high-accuracy positioning, default: true
          timeout: 10000, // Set positioning timeout, default: infinity
          convert: true // Automatically offset coordinates. The offset coordinates are Gaode coordinates. Default: true
        })
      }

      this.geolocation.getCurrentPosition()
      AMap.event.addListener(this.geolocation, "complete", (data) => {
        //data is specific positioning information
        const wgsPoint = mars3d.PointTrans.gcj2wgs([data.position.lng, data.position.lat])
        this.flyToLocation({ lng: wgsPoint[0], lat: wgsPoint[1] })
      })
      AMap.event.addListener(this.geolocation, "error", (data) => {
        // Positioning error, reference: https://lbs.amap.com/faq/js-api/map-js-api/position-related
        globalMsg("Location failed")
      })
    })
  }

  flyToLocation(position) {
    mars3d.DomUtil.removeClass(this._container, "tracking-activated")
    mars3d.DomUtil.addClass(this._container, "tracking-deactivated")

    this.clearLocationPoint()
    const graphic = new mars3d.graphic.DivLightPoint({
      position,
      style: {
        color: "#ffff00",
        clampToGround: true
      },
      tooltip: "My position:" + position.lng + "," + position.lat
    })
    this._map.graphicLayer.addGraphic(graphic)

    graphic.flyTo({
      radius: 2000,
      complete: function () {
        console.log("Flight operation completed")
      }
    })

    this.graphic = graphic
  }

  clearLocationPoint() {
    if (!this.graphic) {
      return
    }
    this.graphic.destroy()
    this.graphic = null
  }
}
