// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.control = {
    compass: { top: "10px", right: "5px" } // The control displayed in the current example - navigation ball
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
  // let compass = new mars3d.control.Compass({ top: "10px", right: "5px" })
  // map.addControl(compass)

  map.controls.compass.on(mars3d.EventType.click, function (event) {
    globalMsg("The compass control was clicked")
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
