// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

let video2D
let videoElement

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.844188, lng: 117.205321, alt: 143, heading: 175, pitch: -26 }
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

  // 2. Bind the listening event on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    video2D = event.graphic
    console.log("Monitoring layer, clicked vector object", event)
  })

  // Popup can be bound to the layer, and it will take effect on all vector data added to this layer.
  graphicLayer.bindPopup("I am the Popup bound on the layer")

  // The right-click menu can be bound to the layer, which will take effect for all vector data added to this layer.
  graphicLayer.bindContextMenu([
    {
      text: "Delete object",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphicLayer.removeGraphic(graphic)
        }
      }
    }
  ])

  createVideoDom()
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

function getGraphic(graphicId) {
  video2D = graphicLayer.getGraphicById(graphicId)
  return video2D
}

function setViedoGraphic(graphic) {
  video2D = graphic
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

    const graphic = new mars3d.graphic.Video2D({
      position,
      style: {
        container: videoElement,
        angle: 46.3,
        angle2: 15.5,
        heading: 88.5,
        pitch: 8.2,
        distance: 1178,
        showFrustum: true
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

//Load the configured video (this parameter is obtained from the "Print Parameters" button on the interface)
function addDemoGraphic1() {
  video2D = new mars3d.graphic.Video2D({
    position: [117.205459, 31.842988, 64.3],
    style: {
      container: videoElement,
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)
}

// cast video
function startDrawGraphic() {
  graphicLayer.clear()
  // Start drawing
  graphicLayer.startDraw({
    type: "video2D",
    style: {
      container: videoElement,
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
}

// Cast video according to current camera
function startDrawGraphic2() {
  graphicLayer.clear()
  // Get the center point of the screen
  const targetPosition = map.getCenter({ format: false })
  if (!targetPosition) {
    return
  }

  const cameraPosition = Cesium.clone(map.camera.position)

  // Construct the projector
  video2D = new mars3d.graphic.Video2D({
    position: cameraPosition,
    targetPosition,
    style: {
      container: videoElement,
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)
}

function playOrpause() {
  video2D.play = !video2D.play
}

// change horizontal angle
function onChangeAngle(value) {
  if (video2D) {
    video2D.angle = value
  }
}

// change vertical angle
function onChangeAngle2(value) {
  if (video2D) {
    video2D.angle2 = value
  }
}

//Change the throw distance
function onChangeDistance(value) {
  if (video2D) {
    video2D.distance = value
  }
}

//Change the surrounding distance
function onChangeHeading(value) {
  if (video2D) {
    video2D.heading = value
  }
}

//Change the pitch angle
function onChangePitch(value) {
  if (video2D) {
    video2D.pitch = value
  }
}

/**
 *
 * @export
 * @param {boolean} isCheckde whether the wireframe is displayed
 * @returns {void}
 */
function showFrustum(isCheckde) {
  if (video2D) {
    video2D.showFrustum = isCheckde
  }
}

//Change video transparency
function onChangeOpacity(opacity) {
  if (video2D) {
    video2D.setOpacity(opacity)
  }
}

/**
 * Video angle
 *
 * @param {number} num 0-360°
 * @returns {void}
 */
function rotateDeg(num) {
  if (video2D) {
    video2D.setStyle({ stRotationDegree: num })
  }
}

// Locate to the video location
function locate() {
  if (video2D) {
    video2D.setView()
  }
}
//Print parameters
function printParameters() {
  if (video2D) {
    const params = video2D.toJSON()
    console.log("Video2D construction parameters are", JSON.stringify(params))
  }
}
//Video position
function selCamera() {
  if (video2D == null) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // Delete the drawn point

      video2D.position = point
    }
  })
}

//Select points from surrounding perspectives
function onClickSelView() {
  if (!video2D) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // Delete the drawn point

      video2D.targetPosition = point
    }
  })
}
