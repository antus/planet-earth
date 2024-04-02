// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

let selectedView

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.844146, lng: 117.20555, alt: 125, heading: 184, pitch: -17 }
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

//Load the configured video (this parameter is obtained from the "Print Parameters" button on the interface)
function addDemoGraphic1() {
  const video2D = new mars3d.graphic.Video2D({
    position: [117.205459, 31.842988, 64.3],
    style: {
      url: "//data.mars3d.cn/file/video/duimian.mp4",
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: 8.2,
      distance: 78,
      // vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
      // textureCoordinates: {
      //   positions: [new Cesium.Cartesian2(0, 1), new Cesium.Cartesian2(1, 1), new Cesium.Cartesian2(1, 0), new Cesium.Cartesian2(0, 0)]
      // },
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)

  // setTimeout(() => {
  //   video2D.setStyle({
  //     url: "//data.mars3d.cn/file/video/lukou.mp4"
  //   })
  // }, 10000)
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
        url: "//data.mars3d.cn/file/video/duimian.mp4",
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

// cast video
function startDrawGraphic() {
  // Start drawing
  graphicLayer.startDraw({
    type: "video2D",
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
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
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)

  selectedView = video2D // record
}

// play / Pause
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

function onChangeMirror(value) {
  if (selectedView) {
    selectedView.flipx = value
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
