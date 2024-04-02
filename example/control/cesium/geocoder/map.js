// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.control = {
    // geocoder: true // Use cesium native
    geocoder: "gaode" // Use Gaode POI service
  }
  return option
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Query result callback method
  map.controls.geocoder._czmContrl.viewModel.complete.addEventListener(function () {
    const arrdata = map.controls.geocoder._czmContrl.viewModel.suggestions
    console.log("query results", arrdata)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
