// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.scene.center = { lat: 31.80616, lng: 117.131968, alt: 3066.7, heading: 46.1, pitch: -25.1 }
  option.control = {
    cubeView: { top: "10px", left: "5px" } // The control displayed in the current example - cube view
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

  // Method 2: After creating the earth, call addControl on demand (directly new the control corresponding to the type type)
  // const cubeView = new mars3d.control.CubeView({ top: "10px", right: "5px" })
  // map.addControl(cubeView)

  map.controls.cubeView.on(mars3d.EventType.click, function (event) {
    globalMsg("The cubeView control was clicked")
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
