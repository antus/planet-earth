// import * as mars3d from "mars3d"
// import { PoiQueryButton } from "./PoiQueryButton"

var map // mars3d.Map three-dimensional map object

var mapOptions = {
  scene: {
    center: { lat: 31.805875, lng: 117.237115, alt: 11874, heading: 1, pitch: -69 }
  },
  control: {
    geocoder: false
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

  const poiQueryButton = new PoiQueryButton({
    insertIndex: 0 // Insert position order
  })
  map.addControl(poiQueryButton)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
