// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.692469, lng: 116.341333, alt: 16567, heading: 0, pitch: -30 },
    sceneMode: Cesium.SceneMode.SCENE3D,
    cameraController: {
      minimumZoomDistance: 1,
      maximumZoomDistance: 300000000
    }
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

  //Add a logo
  const graphic = new mars3d.graphic.PointEntity({
    position: [116.317765, 30.973406, 1508],
    style: {
      color: "#ff0000",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    tooltip: "I am the center point of the perspective"
    // flyTo: true
  })
  map.graphicLayer.addGraphic(graphic)

  // // Event before switching scene
  // let lastCameraView // Record perspective
  // map.on(mars3d.EventType.morphStart, function (event) {
  //   lastCameraView = map.getCameraView()
  // })
  // // Events after switching scenes
  // map.on(mars3d.EventType.morphComplete, function (event) {
  //   map.setCameraView(lastCameraView, { duration: 0 })
  // })

  // Event before switching scene
  let lastCenterPoint // record center point
  map.on(mars3d.EventType.morphStart, function (event) {
    lastCenterPoint = map.getCenter()
    if (lastCenterPoint) {
      graphic.position = lastCenterPoint
    }
  })
  // Event after switching scenes
  map.on(mars3d.EventType.morphComplete, function (event) {
    if (lastCenterPoint) {
      const radius = map.camera.positionCartographic.height
      map.flyToPoint(lastCenterPoint, { radius, duration: 0 })
    }
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Switch to 2D view
function to2d() {
  map.scene.morphTo2D(0)
}

//Switch to 3D view
function to3d() {
  map.scene.morphTo3D(0)
}

//Switch to 2.5D dimensional view
function toGLB() {
  map.scene.morphToColumbusView(0)
}
