// import { toGeoJSON as shpToGeoJSON } from "shp-geojson"

/**
 * Load shp files by converting to geojson.
 * To use shpUtil, you need to import the ../lib/geojson/shp-geojson.js file
 */
class Shp2JsonLayer extends mars3d.layer.GeoJsonLayer {
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

    // url is a zip package that needs to include shp, dbf, prj and other files
    if (this.options.url) {
      shpUtil
        .toGeoJSON(this.options.url, undefined, this.options.encoding ?? "gbk", this.options.crs)
        .then((data) => {
          if (this._state === mars3d.State.REMOVED) {
            return
          }
          console.log("The converted data is", data)
          this._load_data(data)
        })
        .catch(function (error) {
          console.error("Service error", error)
        })
    } else {
      if (newOptions) {
        console.warn("Shp2JsonLayer: No url parameter was passed in, please confirm whether there is an error.")
      }
    }
  }
}

mars3d.layer.Shp2JsonLayer = Shp2JsonLayer

//Register
mars3d.LayerUtil.register("kml2json", Shp2JsonLayer)
