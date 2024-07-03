// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var mapOptions = {
  scene: {
    center: { lat: 31.255881, lng: 117.271026, alt: 60133, heading: 0, pitch: -46 }
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

  randomPoints()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// color
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#0000FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}

const bbox = [116.984788, 31.625909, 117.484068, 32.021504]

function randomPoints() {
  graphicLayer.clear()

  const points = turf.randomPoint(100, { bbox })

  points.features.forEach((e, index) => {
    const position = e.geometry.coordinates

    const graphic = new mars3d.graphic.BillboardPrimitive({
      position,
      style: {
        image: "img/marker/mark-blue.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1)
      },
      popup: "th" + index + "number"
    })
    graphicLayer.addGraphic(graphic)
  })
}

function randomPolylines() {
  graphicLayer.clear()

  let numVertices = parseInt(Math.random() * 10)
  numVertices = numVertices < 3 ? 3 : numVertices

  const polylines = turf.randomLineString(100, {
    bbox,
    num_vertices: numVertices, // How many coordinates each LineString will contain.
    max_length: 0.01 // size
  })

  polylines.features.forEach((e, index) => {
    const positions = e.geometry.coordinates

    const graphic = new mars3d.graphic.PolylinePrimitive({
      positions,
      style: {
        width: 4,
        color: getColor(),
        opacity: 0.8,
        clampToGround: true
      },
      popup: "th" + index + "number"
    })
    graphicLayer.addGraphic(graphic)
  })
}

function randomPolygons() {
  graphicLayer.clear()

  let numVertices = parseInt(Math.random() * 10)
  numVertices = numVertices < 3 ? 3 : numVertices

  const polygons = turf.randomPolygon(100, {
    bbox,
    num_vertices: numVertices, //The number of coordinates, must be more than or equal to four
    max_radial_length: 0.01 // size
  })

  polygons.features.forEach((e, index) => {
    const positions = e.geometry.coordinates
    const graphic = new mars3d.graphic.PolygonPrimitive({
      positions,
      style: {
        color: getColor(),
        opacity: 0.6,
        clampToGround: true
      },
      popup: "th" + index + "number"
    })
    graphicLayer.addGraphic(graphic)
  })
}

function clearAll() {
  graphicLayer.clear()
}
