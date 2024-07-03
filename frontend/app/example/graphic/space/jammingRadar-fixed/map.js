// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.586463, lng: 117.640209, alt: 178487.6, heading: 356.2, pitch: -52.2 }
  }
}

var graphicLayer
var radarJamming

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addDemoGraphic1(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  // eslint-disable-next-line no-undef
  radarJamming = new mars3d.graphic.FixedJammingRadar({
    position: [117.271756, 31.863786, 16.6],
    vertexs: [],
    style: {
      // color: new mars3d.Cesium.Color(1, 0, 0, 1.0), // Set the radar color, the default is the transition color
      outline: true // Whether to display the wireframe
      // outlineColor: new mars3d.Cesium.Color(1, 1, 0, 1.0), // Set the wireframe color, the default is the transition color
    },
    jammers: [
      // Built-in default jammer
      {
        id: "Fixed Jammer",
        position: [116.98875, 32.634335, 40000],
        bji: 2000000,
        yji: 0.5,
        pitch: 9.682362975434472
      }
    ]
  })
  graphicLayer.addGraphic(radarJamming)

  // Add jammer after constructing radar
  const jammer = radarJamming.addJammer({
    id: "Dynamic Jammer",
    position: [116.387754, 31.292601, 50000],
    bji: 2000000,
    yji: 0.5,
    pitch: 9.68
  })

  //Test dynamically update location
  const dsq = setInterval(() => {
    jammer.position[0] += 0.05
    if (radarJamming.isDestroy || jammer.position[0] > 119) {
      clearInterval(dsq)
      return
    }
    radarJamming.addJammer(jammer)
  }, 100)

  // Display the jammer position for easy comparison
  map.viewer.entities.add({
    position: new Cesium.CallbackProperty(() => {
      return radarJamming && radarJamming.getJammer("Fixed Jammer")?._position
    }, false),
    point: {
      pixelSize: 10,
      color: mars3d.Cesium.Color.RED,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  })

  // Display the jammer position for easy comparison
  map.viewer.entities.add({
    position: new Cesium.CallbackProperty(() => {
      return radarJamming && radarJamming.getJammer("Dynamic Jammer")?._position
    }, false),
    point: {
      pixelSize: 10,
      color: mars3d.Cesium.Color.BLUE,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  })
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

    const graphic = new mars3d.graphic.FixedJammingRadar({
      position: position,
      style: {
        scale: 0.6,
        color: "#ff0000",
        opacity: 0.3,
        outline: true,
        outlineColor: "#ffffff"
      },
      attr: { index: index },
      jammers: [
        // Built-in default jammer
        {
          id: "Jammer 1",
          position: [116.98875, 32.634335, 40000],
          bji: 2000000,
          yji: 0.5,
          pitch: 9.682362975434472
        },
        {
          id: "Jammer 2",
          position: [117.506527, 31.515046, 50000],
          bji: 2000000,
          yji: 0.5,
          pitch: 9.68
        }
      ]
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "fixedJammingRadar",
    style: {
      outline: true
    },
    jammers: [
      // Built-in default jammer
      {
        id: "Jammer 1",
        position: [116.98875, 32.634335, 40000],
        bji: 2000000,
        yji: 0.5,
        pitch: 9.682362975434472
      },
      {
        id: "Jammer 2",
        position: [117.506527, 31.515046, 50000],
        bji: 2000000,
        yji: 0.5,
        pitch: 9.68
      }
    ]
  })
}
