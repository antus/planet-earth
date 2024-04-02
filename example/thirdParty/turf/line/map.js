// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer object

let lineLayer

var mapOptions = {
  scene: {
    center: { lat: 31.855058, lng: 117.312337, alt: 79936, heading: 0, pitch: -90 }
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

  //Basic line vector data
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function drawLine() {
  clearLayer()

  lineLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: false
    }
  })
}

// Calculate curve
function calculationCurve() {
  graphicLayer.clear()

  let line = lineLayer.getGraphics()
  if (line.length === 0) {
    globalMsg("Please draw a line!")
    return
  }
  line = line[0].toGeoJSON()

  const curved = turf.bezierSpline(line)
  const positions = curved.geometry.coordinates

  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      width: 4,
      color: "#00ffff"
    }
  })
  graphicLayer.addGraphic(graphic)
}

// Calculate parallel lines
function parallelLines(distance) {
  let line = lineLayer.getGraphics()
  if (line.length === 0) {
    globalMsg("Please draw a line!")
    return
  }
  line = line[0].toGeoJSON()

  graphicLayer.clear()

  const offsetLine = turf.lineOffset(line, distance, { units: "miles" })

  const positions = offsetLine.geometry.coordinates

  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      width: 4,
      color: "#ff0000"
    }
  })
  graphicLayer.addGraphic(graphic)
}

function clearLayer() {
  graphicLayer.clear()
  lineLayer.clear()
}
