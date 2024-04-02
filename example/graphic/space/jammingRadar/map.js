// import * as mars3d from "mars3d"
// // import { FeRadarJamming } from "./FeRadarJamming"

var map // mars3d.Map three-dimensional map object

var graphicLayer
var radarJamming // radar primitive

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.27994, lng: 117.241137, alt: 92227, heading: 0, pitch: -53 }
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
  radarJamming = new mars3d.graphic.JammingRadar({
    position: [117.271756, 31.863786, 16.6],
    vertexs: getVertexs(),
    style: {
      // color: new mars3d.Cesium.Color(1, 0, 0, 1.0), // Set the radar color, the default is the transition color
      outline: true // Whether to display the wireframe
      // outlineColor: new mars3d.Cesium.Color(1, 1, 0, 1.0), // Set the wireframe color, the default is the transition color
    }
  })
  graphicLayer.addGraphic(radarJamming)
}

function getVertexs() {
  const vertexs = [] // Two-dimensional array, the first layer is a circle in the plane, and the second layer is each circle in the vertical direction
  for (let pitch = 0; pitch <= 90; pitch += 10) {
    const arrHeadingPt = []
    let radius = 0
    if (pitch === 0) {
      radius = 0
    } else if (pitch === 10) {
      radius = 1562
    } else if (pitch === 20) {
      radius = 5989
    } else if (pitch === 30) {
      radius = 12541
    } else if (pitch === 40) {
      radius = 20100
    } else if (pitch === 50) {
      radius = 27323
    } else if (pitch === 60) {
      radius = 32796
    } else if (pitch === 70) {
      radius = 35115
    } else if (pitch === 80) {
      radius = 32556
    } else if (pitch === 90) {
      radius = 0
    }
    for (let horizontal = 0; horizontal <= 360; horizontal += 10) {
      arrHeadingPt.push({
        heading: horizontal, // Direction on the plane, angle value
        pitch: pitch, // vertical direction, angle value
        radius: radius // radius
      })
    }
    vertexs.push(arrHeadingPt)
  }
  return vertexs
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

    const graphic = new mars3d.graphic.JammingRadar({
      position: position,
      vertexs: getVertexs(),
      style: {
        scale: 0.4,
        color: "#ff0000",
        opacity: 0.3,
        outline: true,
        outlineColor: "#ffffff"
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "jammingRadar",
    vertexs: getVertexs(),
    style: {
      outline: true
    }
  })
}
