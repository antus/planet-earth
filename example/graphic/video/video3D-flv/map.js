// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

let selectedView
let videoElement

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.843062, lng: 117.205439, alt: 150, heading: 178, pitch: -75 },
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

  globalNotify("Known Problem Tips", `If the video does not play or the service URL access times out, it may be that the online demo URL link has expired. You can replace the URL in the code with a local service and use it.`)

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei National University Science and Technology Park",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: 43.7 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  createVideoDom()

  //Add some demo data
  addDemoGraphic1()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const flvUrl = "https://sample-videos.com/video123/flv/720/big_buck_bunny_720p_1mb.flv"
function createVideoDom() {
  videoElement = mars3d.DomUtil.create("video", "", document.body)
  videoElement.setAttribute("muted", "muted")
  videoElement.setAttribute("autoplay", "autoplay")
  videoElement.setAttribute("loop", "loop")
  videoElement.setAttribute("crossorigin", "")
  videoElement.setAttribute("controls", "")
  videoElement.style.display = "none"

  //Add FLV demo data
  if (window.flvjs.isSupported()) {
    const flvPlayer = window.flvjs.createPlayer({
      type: "flv",
      url: flvUrl
    })
    flvPlayer.attachMediaElement(videoElement)
    flvPlayer.load()
    flvPlayer.play()
  } else {
    globalMsg("flv format video is not supported")
  }

  setTimeout(() => {
    try {
      if (videoElement.paused) {
        globalMsg("The current browser has restricted automatic playback, please click the play button")
        videoElement.play()
      }
    } catch (e) {
      //Avoid browser permission exceptions
      globalMsg("The current browser has restricted automatic playback, please click the play button")
    }
  }, 3000)
}

//Load the configured video (this parameter is obtained from the "Print Parameters" button on the interface)
function addDemoGraphic1() {
  const video3D = new mars3d.graphic.Video3D({
    position: [117.205457, 31.842984, 63.9],
    style: {
      container: videoElement,
      maskImage: "img/textures/video-mask.png", // Feather the surroundings of the video to make the integration more beautiful
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: -49.5,
      showFrustum: true
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(video3D)
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
        container: videoElement,
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

//Add cast video
function startDrawGraphic() {
  // Start drawing
  graphicLayer.startDraw({
    type: "video3D",
    style: {
      container: videoElement,
      maskImage: "img/textures/video-mask.png", // Feather the surroundings of the video to make the integration more beautiful
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: -49.5,
      showFrustum: true
    }
  })
}

// Project video according to current angle
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
      container: videoElement,
      maskImage: "img/textures/video-mask.png", // Feather the surroundings of the video to make the integration more beautiful
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: -49.5,
      showFrustum: true,
      opacity: 1
    }
  })
  graphicLayer.addGraphic(video3D)
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
