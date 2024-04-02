// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.623553, lng: 117.322405, alt: 123536, heading: 359, pitch: -81 }
  },
  control: {
    baseLayerPicker: false
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Get the layer
function getLayers() {
  return map.getLayers({
    basemaps: true, // Whether to take the basempas in config.json
    layers: true // Whether to take the layers in config.json
  })
}

function addLayer(layer) {
  map.addLayer(layer)
}

// Demo for the details button of the Tibet Pass layer in config.json
window.showPopupDetails = (item) => {
  globalAlert(item.NAME)
}
