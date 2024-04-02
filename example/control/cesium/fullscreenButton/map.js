// import * as mars3d from "mars3d"


var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.control = {
    fullscreenButton: false // Currently demonstrated sample control - full screen button control (Cesium native)
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

  globalNotify(
    "Known Issue Tips",
    `(1) Due to cesium’s own mechanism, the div inside cannot be fully screened after being embedded in an iframe;
     (2) Due to the example frame, use iframe to embed, and no other panels will be displayed after full screen;
    `
  )

  // Method 2: After creating the earth, call addControl on demand (directly new the control corresponding to the type type)
  const fullscreenButton = new mars3d.control.FullscreenButton({
    // fullscreenElement: document.body, // Full screen the entire page
    fullscreenElement: map.container, // only full screen canvas
    icon: "img/svg/fullscreen.svg"
  })
  map.addControl(fullscreenButton)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
