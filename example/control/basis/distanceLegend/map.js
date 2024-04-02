// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.control = {
    distanceLegend: false //The currently demonstrated sample control-scale control
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

  // Method 2: After creating the earth, call addControl as needed to add (directly new the control corresponding to the type type). It cannot be added multiple times.
  const distanceLegend = new mars3d.control.DistanceLegend({ left: "100px", bottom: "2px" })
  map.addControl(distanceLegend)

  distanceLegend.on(mars3d.EventType.change, function (event) {
    console.log("Scale bar changes", event)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
