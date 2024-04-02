// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 32.086616, lng: 118.731447, alt: 97704, heading: 244, pitch: -22 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  map.scene.globe.terrainExaggeration = 10 // Modify terrain exaggeration
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Changes in terrain exaggeration
 * @param {number} val default value 1.0
 * @returns {void}
 */
function changeTerrain(val) {
  map.scene.globe.terrainExaggeration = val
}
