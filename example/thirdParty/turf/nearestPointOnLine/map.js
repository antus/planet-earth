// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer object
let pointLayer

var mapOptions = {
  scene: {
    center: { lat: 31.871794, lng: 116.800468, alt: 57020, heading: 90, pitch: -51 },
    fxaa: true
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

  //Point vector data layer
  pointLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(pointLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// draw line
function drawLine() {
  if (pointLayer) {
    pointLayer.clear()
  }
  graphicLayer.clear()

  graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: true
    },
    success: function () {
      // Callback after successful drawing
    }
  })
}

// draw points
function drawPoint() {
  pointLayer.clear()
  pointLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 10,
      color: "red"
    },
    success: function () {
      nearPoint()
    }
  })
}

// nearest point calculation
function nearPoint() {
  const lineLayer = graphicLayer.getGraphics()
  const point = pointLayer.getGraphics()

  if (lineLayer.length < 1 || point.length < 1) {
    return
  }

  const line = lineLayer[0].toGeoJSON()
  const pt = point[0].toGeoJSON()

  const snapped = turf.nearestPointOnLine(line, pt, { units: "miles" })
  const position = snapped.geometry.coordinates

  // Nearest point (icon point)
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position,
    style: {
      image: "img/marker/mark-blue.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1),
      clampToGround: true
    },
    popup: "Nearest"
  })
  pointLayer.addGraphic(graphic)
}

// clear data
function clearLayer() {
  graphicLayer.clear()
  pointLayer.clear()
}
