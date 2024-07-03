// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer object
let pointsLayer

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

  //Point vector data layer
  pointsLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(pointsLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
// Generate 50 random points
function randomPoints() {
  clearlayer()

  const points = turf.randomPoint(50, { bbox }) // 50 random points

  points.features.forEach((e, index) => {
    const position = e.geometry.coordinates
    const graphic = new mars3d.graphic.BillboardPrimitive({
      position,
      style: {
        image: "img/marker/mark-blue.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1),
        clampToGround: false
      },
      popup: "th" + index + "number"
    })
    pointsLayer.addGraphic(graphic)
  })
}

// Calculate the surrounding area
function convexPolygon() {
  graphicLayer.clear()

  const points = pointsLayer.toGeoJSON()

  if (points.features.length === 0) {
    globalMsg("Please create original data first")
    return
  }

  const hull = turf.convex(points)

  const convexPoints = hull.geometry.coordinates
  // Outer envelope;
  const polygonGraphic = new mars3d.graphic.PolygonEntity({
    positions: convexPoints,
    style: {
      color: "#00ffff",
      opacity: 0.2,
      clampToGround: false
    }
  })
  graphicLayer.addGraphic(polygonGraphic)
}

// Thiessen polygon
function voronoiPolygon() {
  graphicLayer.clear()

  const points = pointsLayer.toGeoJSON()

  if (points.features.length === 0) {
    globalMsg("Please create original data first")
    return
  }

  const options = {
    bbox
  }
  const voronoiPolygons = turf.voronoi(points, options)

  voronoiPolygons.features.forEach((e, index) => {
    const position = e.geometry.coordinates

    const voronoiPolygon = new mars3d.graphic.PolygonEntity({
      positions: position,
      style: {
        randomColor: true, // random color
        opacity: 0.5,
        clampToGround: false
      },
      popup: "th" + index + "number"
    })
    graphicLayer.addGraphic(voronoiPolygon)
  })
}

// Calculate TIN polygon
function tinPolygon() {
  graphicLayer.clear()

  const points = pointsLayer.toGeoJSON()

  if (points.features.length === 0) {
    globalMsg("Please create original data first")
    return
  }

  for (let i = 0; i < points.features.length; i++) {
    points.features[i].properties.z = ~~(Math.random() * 9)
  }
  const tin = turf.tin(points, "z")

  tin.features.forEach((e, index) => {
    const position = e.geometry.coordinates

    // TIN polygon
    const tinPolygon = new mars3d.graphic.PolygonEntity({
      positions: position,
      style: {
        randomColor: true, // random color
        opacity: 0.5,
        outline: true,
        outlineColor: "rgb(3, 4, 5,0.2)",
        outlineWidth: 2,
        clampToGround: false
      },
      popup: "th" + index + "number"
    })
    graphicLayer.addGraphic(tinPolygon)
  })
}

// Clear all vector layers
function clearlayer() {
  graphicLayer.clear()
  pointsLayer.clear()
}
