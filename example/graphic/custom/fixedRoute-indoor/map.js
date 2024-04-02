// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let fixedRoute

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.843773, lng: 117.251509, alt: 34, heading: 270, pitch: -11 }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    infoBox: false
  },
  layers: [
    {
      name: "Teaching Building",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
      maximumScreenSpaceError: 8,
      enableCollision: false,
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

  // keyboard roaming
  map.keyboardRoam.setOptions({
    moveStep: 0.1, // Translation step size (meters).
    dirStep: 50, // The step size of the camera's original rotation. The larger the value, the smaller the step size.
    rotateStep: 0.3, // Camera rotation rate around the target point, 0.3-2.0
    minPitch: 0.1, // Minimum elevation angle 0-1
    maxPitch: 0.95 // Maximum elevation angle 0-1
  })
  map.keyboardRoam.enabled = true // Enable keyboard roaming

  addGraphicLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addGraphicLayer() {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "Indoor Route",
    speed: 5,
    offsetHeight: 1.6,
    positions: [
      [117.25164, 31.843773, 32.0],
      [117.251042, 31.843772, 32.0],
      [117.250613, 31.844058, 32.0],
      [117.250677, 31.844146, 32.0],
      [117.250696, 31.844134, 32.0],
      [117.250657, 31.844098, 36.0],
      [117.250611, 31.84406, 36.0],
      [117.251039, 31.843773, 36.0]
    ],
    camera: {
      type: "dy",
      followedX: 1,
      followedZ: 0.2
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  fixedRoute.start() // Start roaming
}

function startFly() {
  fixedRoute.start() // Start roaming
}

function stopFly() {
  fixedRoute.stop()
  globalMsg("After clicking any area of ​​the map with the mouse, you can then press the A S D W Q E keys on the keyboard to control the front, back, left, and right keys, and the up, down, left, and right keys to control rotation for manual roaming.")
}

function centerAtDX1() {
  stopFly()
  map.setCameraView({ lat: 31.843703, lng: 117.251038, alt: 33, heading: 50, pitch: -6 })
}

function centerAtDX2() {
  stopFly()
  map.setCameraView({ lat: 31.843816, lng: 117.250978, alt: 34, heading: 308, pitch: -8 })
}

function centerAtDX3() {
  stopFly()
  map.setCameraView({ lat: 31.843789, lng: 117.251188, alt: 42, heading: 6, pitch: -31 })
}
