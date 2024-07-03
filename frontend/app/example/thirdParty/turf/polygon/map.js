// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer object
let polygonsLayer

var mapOptions = {
  scene: {
    center: { lat: 31.771917, lng: 117.373238, alt: 34263, heading: 336, pitch: -69 },
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

  polygonsLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(polygonsLayer)

  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [117.271662, 31.870639, 21.49],
      [117.290605, 31.871517, 19.47],
      [117.302056, 31.858145, 16.27],
      [117.299439, 31.847545, 14.77],
      [117.267705, 31.8491, 22.11]
    ],
    style: {
      color: "#3388ff",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff"
    }
  })
  graphicLayer.addGraphic(graphic)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Draw the surface
function drawPolygon() {
  graphicLayer.clear()
  polygonsLayer.clear()

  // Start drawing
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: getColor(),
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff"
    }
  })
}

//Rotate the surface
function spinPolygons(angle) {
  clearGraphic()

  const graphic = graphicLayer.getGraphics()[0]
  const poly = graphic.toGeoJSON({ closure: true })

  const centerPoint = mars3d.LngLatPoint.fromCartesian(graphic.center).toArray() // The point around which the rotation is performed
  // truf rotation operation
  const rotatedPoly = turf.transformRotate(poly, angle, { pivot: centerPoint })
  const spinGraphic = mars3d.Util.geoJsonToGraphics(rotatedPoly, {
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff"
    }
  })
  polygonsLayer.addGraphic(spinGraphic)
}

//Translation plane
function translationPolygons(offset) {
  clearGraphic()

  const graphic = graphicLayer.getGraphics()[0]
  const poly = graphic.toGeoJSON({ closure: true })

  // truf translation operation
  const rotatedPoly = turf.transformTranslate(poly, offset, 10)

  const spinGraphic = mars3d.Util.geoJsonToGraphics(rotatedPoly, {
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff"
    }
  })
  polygonsLayer.addGraphic(spinGraphic)
}

//Scale surface
function zoomPolygons(scale) {
  clearGraphic()

  if (scale === 0) {
    return
  }

  const graphic = graphicLayer.getGraphics()[0]
  const poly = graphic.toGeoJSON({ closure: true })

  // truf scaling operation
  if (poly.geometry.coordinates[0].length !== 0) {
    const rotatedPoly = turf.transformScale(poly, scale)
    const spinGraphic = mars3d.Util.geoJsonToGraphics(rotatedPoly, {
      style: {
        color: "#ff0000",
        opacity: 0.5,
        outline: true,
        outlineWidth: 2,
        outlineColor: "#ffffff"
      }
    })
    polygonsLayer.addGraphic(spinGraphic)
  }
}

function clearGraphic() {
  polygonsLayer.clear()
  graphicLayer.endDraw()
}

// color
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#0000FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}
