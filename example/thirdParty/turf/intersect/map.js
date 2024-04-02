// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer object

let graphic1
let graphic2

var mapOptions = {
  scene: {
    center: { lat: 31.715325, lng: 117.233867, alt: 21228, heading: 2, pitch: -60 }
  },
  layers: []
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  addEntity()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addEntity() {
  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Side 1
  graphic1 = new mars3d.graphic.PolygonEntity({
    positions: [
      [117.182288, 31.854164, 35.2],
      [117.210254, 31.878324, 28.2],
      [117.238229, 31.855796, 22.4],
      [117.242307, 31.826109, 12.5],
      [117.177277, 31.821475, 54.5],
      [117.182288, 31.854164, 35.2]
    ],
    style: {
      color: "#ff0000",
      opacity: 0.5,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic1)

  // Side 2
  graphic2 = new mars3d.graphic.PolygonEntity({
    positions: [
      [117.267046, 31.842971, 25.4],
      [117.20963, 31.840323, 37.2],
      [117.230646, 31.787122, 27.5],
      [117.28833, 31.799624, 20.6],
      [117.267046, 31.842971, 25.4]
    ],
    style: {
      color: "#0000FF",
      opacity: 0.5,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic2)
}

// Seek friendship
let intersectGraphic
function intersect() {
  if (intersectGraphic) {
    graphicLayer.removeGraphic(intersectGraphic, true)
    intersectGraphic = null
  }

  const layer1 = graphic1.toGeoJSON()
  const layer2 = graphic2.toGeoJSON()
  console.log("2 geojson objects", layer1, layer2)

  const geojson = turf.intersect(layer1, layer2)

  intersectGraphic = mars3d.Util.geoJsonToGraphics(geojson)[0]
  intersectGraphic.type = "polygon"
  intersectGraphic.style = {
    color: "#00ff00",
    opacity: 0.8,
    outline: true,
    outlineWidth: 3,
    outlineColor: "#ffffff",
    clampToGround: true,
    label: {
      text: "I am the intersection part",
      font_size: 18,
      color: "#000000"
    }
  }
  intersectGraphic = graphicLayer.addGraphic(intersectGraphic)
}

// clear
function clear() {
  if (intersectGraphic) {
    graphicLayer.removeGraphic(intersectGraphic, true)
    intersectGraphic = null
  }
}
