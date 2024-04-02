// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

let selectedView

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.843175, lng: 117.205295, alt: 223, heading: 178, pitch: -75 },
    globe: {
      depthTestAgainstTerrain: true // Cannot be projected onto the terrain without adding
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
  map = mapInstance //Record the first created map

  globalNotify("Operation Tips:", `Please click anywhere on the map. The browser security mechanism requires mouse operation to automatically start playing the video.`)

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei National University Science and Technology Park",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: 43.7 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  const wallGraphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.208707, 31.840096, 42.5],
      [117.203055, 31.839958, 41.6]
    ],
    style: {
      diffHeight: 200,
      color: "#FFFFFF"
    }
  })
  map.graphicLayer.addGraphic(wallGraphic)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add some demo data
  addDemoGraphic1()
  addDemoGraphic2()
  addDemoGraphic3()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function getGraphic(graphicId) {
  selectedView = graphicLayer.getGraphicById(graphicId)
  return selectedView
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.Video3D({
      position,
      style: {
        url: "//data.mars3d.cn/file/video/menqian.mp4",
        maskImage: "img/textures/video-mask.png", // Feather the surroundings of the video to make the integration more beautiful
        angle: 46.3,
        angle2: 15.5,
        heading: 88.5,
        pitch: -49.5,
        showFrustum: true
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

function startDrawGraphic() {
  // Start drawing
  graphicLayer.startDraw({
    type: "video3D",
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      // maskImage: "img/textures/video-mask.png", // Feather the surroundings of the video to make the integration more beautiful
      addHeight: 10,
      showFrustum: true
    }
  })
}

function startDrawGraphic2() {
  // Get the center point of the screen
  const targetPosition = map.getCenter({ format: false })
  if (!targetPosition) {
    return
  }

  const cameraPosition = Cesium.clone(map.camera.position)

  // Construct the projector
  const video3D = new mars3d.graphic.Video3D({
    position: cameraPosition,
    targetPosition,
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      maskImage: "img/textures/video-mask.png", // Feather the surroundings of the video to make the integration more beautiful
      angle: 33.3,
      angle2: 23.4,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video3D)
}

//Load the configured video (this parameter is obtained from the "Print Parameters" button on the interface)
function addDemoGraphic1() {
  const video3D = new mars3d.graphic.Video3D({
    position: [117.204472, 31.842488, 120.9],
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      maskImage: "img/textures/video-mask.png", // Feather the surroundings of the video to make the integration more beautiful
      angle: 33.3,
      angle2: 23.4,
      heading: 50.7,
      pitch: -82.1
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(video3D)
}

function addDemoGraphic2() {
  const video3D = new mars3d.graphic.Video3D({
    position: [117.205457, 31.842984, 63.9],
    style: {
      url: "//data.mars3d.cn/file/video/menqian.mp4",
      maskImage: "img/textures/video-mask.png", // Feather the surroundings of the video to make the integration more beautiful
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: -49.5,
      showFrustum: true
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(video3D)
}

function addDemoGraphic3() {
  const propertyFJ = getSampledPositionProperty([
    [117.210592, 31.842438, 100],
    [117.207898, 31.842374, 100],
    [117.205376, 31.842337, 100],
    [117.204489, 31.842824, 100]
  ])

  const video3D = new mars3d.graphic.Video3D({
    position: propertyFJ,
    style: {
      url: "//data.mars3d.cn/file/video/menqian.mp4",
      // maskImage: "img/textures/video-mask.png", // Feather the surroundings of the video to make the integration more beautiful
      angle: 20,
      angle2: 10,
      heading: 88.5,
      pitch: -90,
      showFrustum: true
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(video3D)

  // map.on(mars3d.EventType.mouseMove, function (event) {
  //   if (event.cartesian && video3D.isAdded) {
  //     video3D.position = mars3d.PointUtil.addPositionsHeight(event.cartesian, 10)
  //   }
  // })
}
// Calculate the SampledPositionProperty trajectory of the demonstration
function getSampledPositionProperty(points) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const start = map.clock.currentTime
  const positions = mars3d.LngLatArray.toCartesians(points)
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, i * 30, new Cesium.JulianDate())
    const position = positions[i]
    property.addSample(time, position)
  }
  return property
}

function onChangeAngle(value) {
  if (selectedView) {
    selectedView.angle = value
  }
}

function onChangeAngle2(value) {
  if (selectedView) {
    selectedView.angle2 = value
  }
}

function onChangeDistance(value) {
  if (selectedView) {
    selectedView.distance = value
  }
}

function onChangeHeading(value) {
  if (selectedView) {
    selectedView.heading = value
  }
}
function onChangeMirror(value) {
  if (selectedView) {
    selectedView.flipx = value
  }
}

function onClickSelView() {
  if (!selectedView) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // Delete the drawn point

      selectedView.targetPosition = point
    }
  })
}

function onChangePitch(value) {
  if (selectedView) {
    selectedView.pitch = value
  }
}

// Whether the wireframe is displayed
function showFrustum(ckd) {
  if (selectedView) {
    selectedView.showFrustum = ckd
  }
}

function onChangeOpacity(value) {
  if (selectedView) {
    selectedView.opacity = value
  }
}

// play / Pause
function playOrpause() {
  if (selectedView) {
    selectedView.play = !selectedView.play
  }
}

// Locate to the video location
function locate() {
  if (selectedView) {
    selectedView.setView()
  }
}

//Print parameters
function printParameters() {
  if (!selectedView) {
    return
  }

  const params = JSON.stringify(selectedView.toJSON())
  console.log("Video3D construction parameters are", params)
}

//Video position
function selCamera() {
  if (!selectedView) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // Delete the drawn point

      selectedView.position = point
    }
  })
}

function draWall() {
  map.graphicLayer.startDraw({
    type: "wall",
    style: {
      color: "#ffffff",
      opacity: 0.8,
      diffHeight: 300,
      hasShadows: true,
      shadows: Cesium.ShadowMode.DISABLED
    }
  })
}
