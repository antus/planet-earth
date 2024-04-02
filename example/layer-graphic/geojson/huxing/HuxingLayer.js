/**
 * House plan layer
 * @class HuxingLayer
 * @extends {mars3d.layer.GraphicLayer}
 */
class HuxingLayer extends mars3d.layer.GraphicLayer {
  /**
   * Hook method to create some objects before adding them to the map,
   * Will only be called once
   * @return {void} None
   */
  _mountedHook() {
    //
  }

  /**
   * Create hook method to add objects to the map,
   * Called every time add
   * @return {void} None
   */
  _addedHook() {
    super._addedHook()
    this.load()

    this.on(mars3d.EventType.click, this._graphic_clickHandler, this)
    this._map.on(mars3d.EventType.clickMap, this._map_clickHandler, this)

    this.on(mars3d.EventType.mouseOver, this._graphic_mouseOverHandler, this)
    this.on(mars3d.EventType.mouseOut, this._graphic_mouseOutHandler, this)
  }

  /**
   * Create hook method for object removal from the map,
   * Called every time remove
   * @return {void} None
   */
  _removedHook() {
    super._removedHook()

    this.off(mars3d.EventType.click, this._graphic_clickHandler, this)
    this._map.off(mars3d.EventType.clickMap, this._map_clickHandler, this)

    this.off(mars3d.EventType.mouseOver, this._graphic_mouseOverHandler, this)
    this.off(mars3d.EventType.mouseOut, this._graphic_mouseOutHandler, this)
  }

  // Download Data
  load(newOptions = {}) {
    this.options = {
      ...this.options,
      ...newOptions
    }

    if (this.options.url) {
      mars3d.Util.fetchJson(this.options)
        .then((data) => {
          if (this._state === mars3d.State.REMOVED) {
            return
          }
          this._load_data(data)
        })
        .catch(function (error) {
          console.error("Service error", error)
        })
    } else if (this.options.data) {
      this._load_data(this.options.data)
    } else {
      console.warn("HuxinLayer: No url or data parameters were passed in, please confirm whether there are errors.")
    }
  }

  _load_data(geojson) {
    this.clear()

    this._cache_huxin = {}

    const arr = mars3d.Util.geoJsonToGraphics(geojson) // Parse geojson
    for (let i = 0; i < arr.length; i++) {
      this.addHuxing(arr[i].positions, arr[i].attr)
    }

    if (this.options.flyTo) {
      this.flyTo({ scale: 2 })
    }

    this.fire(mars3d.EventType.load)
  }

  addHuxing(positions, attr) {
    if (!positions || positions.length === 0) {
      return
    }

    const flrH = attr.floorh || 0 // Floor height
    const lyrH = attr.layerh || 0 // Floor height

    const primitiveBian = new mars3d.graphic.CorridorPrimitive({
      positions,
      style: {
        height: flrH,
        diffHeight: lyrH,
        width: 0.2,
        cornerType: Cesium.CornerType.MITERED,
        color: "rgb(245,255,250)"
      },
      attr
    })
    this.addGraphic(primitiveBian)

    const primitiveDi = new mars3d.graphic.PolygonEntity({
      positions,
      style: {
        height: flrH,
        diffHeight: 0.1,
        color: "rgb(211,211,211)",
        outline: true,
        outlineWidth: 1,
        outlineColor: "#778899"
      },
      attr
    })
    this.addGraphic(primitiveDi)

    //Record to cache
    const loudongHao = attr.LDH // Building number
    const cengHao = attr.CH //Layer number

    this._cache_huxin[loudongHao] = this._cache_huxin[loudongHao] || {}
    this._cache_huxin[loudongHao][cengHao] = this._cache_huxin[loudongHao][cengHao] || []

    this._cache_huxin[loudongHao][cengHao].push(primitiveBian)
    this._cache_huxin[loudongHao][cengHao].push(primitiveDi)
  }

  _graphic_clickHandler(event) {
    //Restore the last hidden layer
    this._map_clickHandler()

    const attr = event.graphic.attr

    const loudongHao = attr.LDH // Building number
    const cengHao = attr.CH //Layer number

    const loudongGraphics = this._cache_huxin[loudongHao]
    Object.keys(loudongGraphics).forEach((ceng) => {
      const showHu = Number(ceng) <= cengHao // Hides larger than this layer will not be displayed.

      const cengGraphics = loudongGraphics[ceng]
      cengGraphics.forEach((huGraphic) => {
        huGraphic.show = showHu
        if (!showHu) {
          this._lastHideGraphics.push(huGraphic)
        }
      })
    })
  }

  _map_clickHandler(event) {
    //Restore the last hidden layer
    if (this._lastHideGraphics) {
      this._lastHideGraphics.forEach((huGraphic) => {
        huGraphic.show = true
      })
    }
    this._lastHideGraphics = []
  }

  _graphic_mouseOverHandler(event) {
    const graphic = event.graphic
    this.openSmallTooltip(event.windowPosition, graphic.attr.WZ)
  }

  _graphic_mouseOutHandler(event) {
    this.closeSmallTooltip()
  }
}
