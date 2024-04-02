// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  startAnimation()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function startAnimation() {
  map.flyHome({ duration: 0 })

  // opening animation
  map.openFlyAnimation({
    // duration1:4,
    // easingFunction1: Cesium.EasingFunction.QUINTIC_IN_OUT,
    callback: function () {
      // Callback after animation playback is completed
    }
  })
}

function stopAnimation() {
  map.camera.cancelFlight()
}
