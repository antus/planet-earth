// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.840726, lng: 117.25174, alt: 206, heading: 357, pitch: -25 },
    cameraController: {
      enableCollisionDetection: false
    }
  },
  control: {
    infoBox: false
  },
  layers: [
    {
      id: 1987,
      name: "Teaching Building",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
      maximumScreenSpaceError: 16,
      disableCollision: true,
      show: true
    }
  ]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Enable keyboard roaming
  map.keyboardRoam.enabled = true

  map.keyboardRoam.minHeight = 80

  map.keyboardRoam.setOptions({
    moveStep: 10, // Translation step size (meters).
    dirStep: 25, // The step size for camera rotation in place. The larger the value, the smaller the step size.
    rotateStep: 1.0, // Camera rotation rate around the target point, 0.3-2.0
    minPitch: -89, // minimum elevation angle
    maxPitch: 0 // Maximum elevation angle
  })

  // Automatically move forward without pressing the button, call stopMoveForward to stop.
  // map.keyboardRoam.startMoveForward()

  //The camera keeps rotating to the left
  // setInterval(function () {
  //   map.keyboardRoam.rotateCamera(mars3d.MoveType.LEFT_ROTATE)
  // }, 100)

  // // Simulate keyboard key operations and press events
  // map.keyboardRoam._onKeyDown({ keyCode: 38 })

  // // Simulate keyboard key operations and release events
  // map.keyboardRoam._onKeyUp({ keyCode: 38 })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Modify step size
function changeSlider(val) {
  if (val) {
    map.keyboardRoam.moveStep = val
  }
}

// indoor
function centerAtDX1() {
  map.keyboardRoam.moveStep = 0.1 // Translation step size (meters).
  map.keyboardRoam.dirStep = 50 // The camera rotates in place step. The larger the value, the smaller the step.
  map.keyboardRoam.rotateStep = 0.3 // Camera rotation rate around the target point, 0.3-2.0

  map.setCameraView({ lat: 31.843804, lng: 117.250994, alt: 33, heading: 307, pitch: 1 })
}

// outdoor
function centerAtDX2() {
  map.keyboardRoam.moveStep = 10 // Translation step size (meters).
  map.keyboardRoam.dirStep = 25 // The camera rotates in place step. The larger the value, the smaller the step.
  map.keyboardRoam.rotateStep = 1.0 // Camera rotation rate around the target point, 0.3-2.0

  map.setCameraView({ lat: 31.829732, lng: 117.246797, alt: 773, heading: 357, pitch: -25 })
}
