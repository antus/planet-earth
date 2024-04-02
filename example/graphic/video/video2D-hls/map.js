// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

let selectedView
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
    selectedView = event.graphic
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

// let hlsUrl = "http://ivi.bupt.edu.cn/hls/cctv13.m3u8";
// const hlsUrl = "http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8"
const hlsUrl = "http://1252093142.vod2.myqcloud.com/4704461fvodcq1252093142/f865d8a05285890787810776469/playlist.f3.m3u8"
function createVideoDom(callback) {
  videoElement = mars3d.DomUtil.create("video", "", document.body)
  videoElement.setAttribute("muted", "muted")
  videoElement.setAttribute("autoplay", "autoplay")
  videoElement.setAttribute("loop", "loop")
  videoElement.setAttribute("crossorigin", "")
  videoElement.setAttribute("controls", "")
  videoElement.style.display = "none"

  if (window.Hls.isSupported()) {
    const hls = new window.Hls()
    hls.loadSource(hlsUrl)
    hls.attachMedia(videoElement)
    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
      videoElement.play()
      if (callback) {
        callback()
      }
    })
  } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.src = hlsUrl
    videoElement.addEventListener("loadedmetadata", function () {
      videoElement.play()
      if (callback) {
        callback()
      }
    })
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
  const video2D = new mars3d.graphic.Video2D({
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
  // Get the center point of the screen
  const targetPosition = map.getCenter({ format: false })
  if (!targetPosition) {
    return
  }

  const cameraPosition = Cesium.clone(map.camera.position)

  // Construct the projector
  const video2D = new mars3d.graphic.Video2D({
    position: cameraPosition,
    targetPosition,
    style: {
      container: videoElement,
      angle: 46.3,
      angle2: 15.5,
      opacity: 1,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)
  return video2D
}

function playOrpause() {
  selectedView.play = !selectedView.play
}

//Modify horizontal angle
function onChangeAngle(value) {
  if (selectedView) {
    selectedView.angle = value
  }
}

//Modify vertical angle
function onChangeAngle2(value) {
  if (selectedView) {
    selectedView.angle2 = value
  }
}

// Modify the projection distance
function onChangeDistance(value) {
  if (selectedView) {
    selectedView.distance = value
  }
}

//Modify the surrounding distance value to the modified value
function onChangeHeading(value) {
  if (selectedView) {
    selectedView.heading = value
  }
}

// Modify the pitch angle value value modified value
function onChangePitch(value) {
  if (selectedView) {
    selectedView.pitch = value
  }
}

// Whether the wireframe displays the modified value of isCheckde
function showFrustum(isCheckde) {
  if (selectedView) {
    selectedView.showFrustum = isCheckde
  }
}

// Modify the transparency of the video opacity transparency value
function onChangeOpacity(opacity) {
  if (selectedView) {
    selectedView.setOpacity(opacity)
  }
}

/**
 * Video angle
 *
 * @param {number} num 0-360°
 * @returns {void}
 */
function rotateDeg(num) {
  if (selectedView) {
    selectedView.setStyle({ stRotationDegree: num })
  }
}

//View positioning
function locate() {
  if (selectedView) {
    selectedView.setView()
  }
}

//Print parameters
function printParameters() {
  if (selectedView) {
    const params = selectedView.toJSON()
    console.log(JSON.stringify(params))
  }
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

//Select points from surrounding perspectives
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
