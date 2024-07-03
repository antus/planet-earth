// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer object

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

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const turfOptions = { units: "kilometers" }
const bbox = [116.984788, 31.625909, 117.484068, 32.021504]

// honeycomb grid
function hexGrid(cellSide) {
  const geojson = turf.hexGrid(bbox, cellSide, turfOptions)
  drawPolyon(geojson)
}

//point grid
function pointGrid(cellSide) {
  const geojson = turf.pointGrid(bbox, cellSide, turfOptions)
  drawPoint(geojson)
}

// square grid
function squareGrid(cellSide) {
  const geojson = turf.squareGrid(bbox, cellSide, turfOptions)
  drawPolyon(geojson)
}

// triangle mesh
function triangleGrid(cellSide) {
  const geojson = turf.triangleGrid(bbox, cellSide, turfOptions)
  drawPolyon(geojson)
}

// Honeycomb grid, square grid, triangle grid
function drawPolyon(geojson) {
  graphicLayer.clear()
  const polygons = mars3d.Util.geoJsonToGraphics(geojson) // Parse geojson

  for (let i = 0; i < polygons.length; i++) {
    const item = polygons[i]
    const text = "th" + i + "number"
    const graphic = new mars3d.graphic.PolygonPrimitive({
      positions: item.positions,
      style: {
        color: "#ffff00",
        opacity: 0.2,
        outline: true,
        outlineWidth: 2,
        outlineColor: "#ffff00",
        outlineOpacity: 0.5,
        clampToGround: true,
        label: {
          text: text
        }
      },
      attr: item.attr,
      popup: text
    })
    graphicLayer.addGraphic(graphic)
  }
}

//point grid
function drawPoint(geojson) {
  graphicLayer.clear()

  const points = mars3d.Util.geoJsonToGraphics(geojson) // Parse geojson

  for (let i = 0; i < points.length; i++) {
    const item = points[i]

    const graphic = new mars3d.graphic.PointPrimitive({
      position: item.position,
      style: {
        color: "#ffff00",
        pixelSize: 8
      },
      popup: "th" + i + "number"
    })
    graphicLayer.addGraphic(graphic)
  }
}
