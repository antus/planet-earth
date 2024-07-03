// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let rotatePoint

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.851782, lng: 116.350493, alt: 7944, heading: 348, pitch: -31 }
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

  rotatePoint = new mars3d.thing.RotatePoint({
    direction: false, // Direction true is counterclockwise, false is clockwise
    time: 50 // Given the time required for one flight (in seconds), control the speed
    // autoStopAngle: 360, // Automatically stop after reaching the specified angle
  })
  map.addThing(rotatePoint)

  // enable rotation
  rotatePoint.start()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function startRotate() {
  // Get the current perspective
  const point = map.getCenter()
  rotatePoint.start(point) //You can pass the specified center point coordinates
}

function stopRotate() {
  rotatePoint.stop()
}
