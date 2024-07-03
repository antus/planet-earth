// import kgUtil from "kml-geojson"

/**
 * Load kml and kmz files by converting to geojson.
 * Use of kgUtil requires the introduction of the ../lib/geojson/kml-geojson.js file
 */
class Kml2JsonLayer extends mars3d.layer.GeoJsonLayer {
  /**
   * Load new data or refresh data
   *
   * @param {Object} [newOptions] The newly set parameters will be merged with the construction parameters of the class.
   * @param {String} [newOptions.url] geojson file or service url address
   * @param {Object} [newOptions.data] geojson format specification data object, choose one from url.
   * @param {Object} [newOptions.Class parameters] contains all parameters supported by the current class
   * @param {BaseGraphicLayer.ConstructorOptions} [newOptions.General parameters] contains all parameters supported by the parent class
   * @return {this} the current object itself, which can be called in a chain
   */
  load(newOptions) {
    if (newOptions) {
      if (Cesium.defaultValue(newOptions.clear, true)) {
        delete this.options.url
        delete this.options.data
      }
      this.clear()

      this.options = {
        ...this.options,
        ...newOptions
      }
    }

    if (this.options.url) {
      kgUtil
        .toGeoJSON(this.options.url)
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
      kgUtil
        .toGeoJSON(this.options.data)
        .then((data) => {
          if (this._state === mars3d.State.REMOVED) {
            return
          }
          this._load_data(data)
        })
        .catch(function (error) {
          console.error("Service error", error)
        })
    } else {
      if (newOptions) {
        console.warn("Kml2JsonLayer: No url or data parameters were passed in, please confirm whether there is an error.")
      }
    }
  }
}

mars3d.layer.Kml2JsonLayer = Kml2JsonLayer

//Register
mars3d.LayerUtil.register("kml2json", Kml2JsonLayer)
