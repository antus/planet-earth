// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.784488, lng: 117.16699, alt: 9030, heading: 1, pitch: -57 },
    cameraController: {
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    }
  },
  control: {
    sceneModePicker: false
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

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addDemoGraphic1()
  addDemoGraphic2()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const radarParsms = {
    outerRadius: 2000,
    innerRadius: 500,
    headingValue: 0,
    pitchValue: 0,
    rollValue: 0,
    startFovH: 180,
    endFovH: -180,
    startFovV: 0,
    endFovV: 90,
    areaColor: "rgba(255,0,0,0.5)"
  }

  const camberRadar = new mars3d.graphic.CamberRadar({
    position: [117.170264, 31.840312, 363],
    name: "Radar model",
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffffff",
      segmentH: 50,
      radius: radarParsms.outerRadius,
      startRadius: radarParsms.innerRadius,
      heading: radarParsms.headingValue,
      pitch: radarParsms.pitchValue,
      roll: radarParsms.rollValue,
      startFovH: radarParsms.startFovH,
      endFovH: radarParsms.endFovH,
      startFovV: radarParsms.startFovV,
      endFovV: radarParsms.endFovV,
      flat: true
    }
  })
  graphicLayer.addGraphic(camberRadar)
}

function addDemoGraphic2() {
  //Add a model
  const graphic = new mars3d.graphic.ModelEntity({
    name: "Ground station model",
    position: [117.170264, 31.840312, 258],
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 1,
      minimumPixelSize: 40,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic)
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

    const graphic = new mars3d.graphic.CamberRadar({
      position,
      style: {
        color: "#ff0000",
        opacity: 0.5,
        outline: true,
        outlineColor: "#ffffff",
        segmentH: 50,
        radius: result.radius,
        startRadius: result.radius * 0.3,
        startFovH: 180,
        endFovH: -180,
        startFovV: 0,
        endFovV: 90
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing phased array radar
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "camberRadar",
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffffff",
      segmentH: 50,
      radius: 2000,
      startRadius: 800,
      startFovH: 180,
      endFovH: -180,
      startFovV: 0,
      endFovV: 90
    }
  })
}

// Get the last data of the layer for testing parameter adjustment
function getLastGraphic() {
  const arr = graphicLayer.getGraphics()
  if (arr.length === 0) {
    return null
  } else {
    return arr[arr.length - 1]
  }
}

function headingChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.heading = value
  }
}

function pitchChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.pitch = value
  }
}

function rollChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.roll = value
  }
}

function outerRadiusChange(val) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.radius = val
  }
}

function innerRadiusChange(val) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.startRadius = val
  }
}

function startFovHChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.startFovH = value
  }
}

function endFovHChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.endFovH = value
  }
}

function startFovVChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.startFovV = value
  }
}

function endFovVChange(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.endFovV = value
  }
}

function updateColor(value) {
  const camberRadar = getLastGraphic()
  if (camberRadar) {
    camberRadar.color = value
  }
}
