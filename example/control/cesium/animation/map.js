// import * as mars3d from "mars3d"


var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.control = {
    timeline: false,
    animation: false // The sample control currently demonstrated - clock instrument control control (Cesium native)
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

  //Modify the scope of the native control
  // This method needs to be executed before creating map(new mars3d.Map(options))
  // Cesium.AnimationViewModel.defaultTicks = [0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 30.0, 60.0, 120.0, 300.0, 600.0, 900.0, 1800.0, 3600.0]

  // Method 2: After creating the earth, call addControl on demand (directly new the control corresponding to the type type)
  const animation = new mars3d.control.Animation({
    ticks: [0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0] // Adjustment range
  })
  map.addControl(animation)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
