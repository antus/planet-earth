// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lng: 102.5, lat: 35.13135, alt: 14307887.9, heading: 0, pitch: -90 }
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

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Big Wild Goose Pagoda",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { alt: -27 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  //Create a viewpoint, the duration parameter adjusts the duration of each step
  const viewPoints = [
    { lng: 108.961601, lat: 34.217109, alt: 509.2, heading: 314.5, pitch: -22.5, duration: 6, stop: 0 },
    { lng: 108.96164, lat: 34.222159, alt: 510.3, heading: 211.2, pitch: -22.5, duration: 8, stop: 0 },
    { lng: 108.957259, lat: 34.221967, alt: 494.3, heading: 127.5, pitch: -17.2, duration: 8, stop: 0 },
    { lng: 108.957319, lat: 34.217225, alt: 515.5, heading: 25.4, pitch: -25.3, duration: 8 }
  ]

  // Perspective switching (step-by-step execution)
  map.setCameraViewList(viewPoints)

  // showCameraRoute(viewPoints) // Display the location, direction and route of camera points for easy comparison and viewing
}

function pauseCameraViewList() {
  map.pauseCameraViewList()
}

function proceedCameraViewList() {
  map.proceedCameraViewList()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Display the position, direction and route of the camera point for easy comparison and viewing
function showCameraRoute(viewPoints) {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const points = []
  for (let i = 0; i < viewPoints.length; i++) {
    const item = viewPoints[i]
    const position = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, item.alt)
    points.push(position)

    // text
    const graphic = new mars3d.graphic.LabelPrimitive({
      position,
      style: {
        text: i,
        font_size: 14
      }
    })
    graphicLayer.addGraphic(graphic)

    // Camera angle indication
    const camera = new Cesium.Camera(map.scene)
    camera.position = position
    camera.frustum.aspectRatio = 1
    camera.frustum.fov = Cesium.Math.toRadians(45)
    camera.frustum.near = 0.01
    camera.frustum.far = 1
    camera.setView({
      destination: position,
      orientation: { heading: Cesium.Math.toRadians(item.heading), pitch: Cesium.Math.toRadians(item.pitch) }
    })

    const frustumPrimitive = new mars3d.graphic.FrustumPrimitive({
      position,
      camera,
      style: {
        angle: 45,
        distance: 2,
        fill: false,
        outline: true,
        outlineColor: "#ffffff",
        outlineOpacity: 1.0
      }
    })
    graphicLayer.addGraphic(frustumPrimitive)
  }

  // Wire
  const graphicLine = new mars3d.graphic.PolylinePrimitive({
    positions: points,
    style: {
      width: 1,
      color: "rgba(200,200,200,0.3)"
    }
  })
  graphicLayer.addGraphic(graphicLine)
}
