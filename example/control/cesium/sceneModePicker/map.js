// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.control = {
    sceneMode: false // Method 1: Add controls in options
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
  const sceneModePicker = new mars3d.control.SceneModePicker({
    icon: "img/svg/sceneModePicker.svg"
  })
  map.addControl(sceneModePicker)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
