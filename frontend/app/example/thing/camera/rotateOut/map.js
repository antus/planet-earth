// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let rotateOut

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.850468, lng: 116.354027, alt: 722, heading: 87, pitch: -6 }
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

  rotateOut = new mars3d.thing.RotateOut({
    direction: false, // Direction true is counterclockwise, false is clockwise
    time: 60 // Given the time required for one flight (in seconds), control the speed
  })
  map.addThing(rotateOut)

  // enable rotation
  rotateOut.start()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function startRotate() {
  rotateOut.start()
}

function stopRotate() {
  rotateOut.stop()
}
