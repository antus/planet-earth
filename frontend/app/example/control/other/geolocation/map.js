// import * as mars3d from "mars3d"
// import { Geolocation } from "./Geolocation.js"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  delete option.control
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

  const geolocation = new Geolocation({
    insertIndex: 1 // The position order of insertion, 1 is behind the home button
  })
  map.addControl(geolocation)

  // Manually call to start positioning
  geolocation.startTracking()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
