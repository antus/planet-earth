// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let heatLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.80232, lng: 117.206907, alt: 1996, heading: 39, pitch: -22 }
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
  map.basemap = 2017 // blue basemap

  // Layer 1
  const arrPoints = getRandomPoints(1000) //Test point data, replaced during actual development
  showHeatMap(arrPoints, 300)

  //Layer 2
  const arrPoints2 = getRandomPoints(1000) //Test point data, replaced during actual development
  showHeatMap(arrPoints2, 800)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function showHeatMap(arrPoints, height) {
  //Heat map layer
  heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    rectangle,
    //The following are the style parameters of the heat map itself, please refer to the API: https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 40,
      blur: 0.85
    },
    //The following are the style parameters of the rectangular vector object
    style: {
      height
    }
  })
  map.addLayer(heatLayer)
}

// update data
function btnUpdate() {
  const arr = getRandomPoints(1000)
  heatLayer.setPositions(arr, true)
}

const rectangle = {
  xmin: 117.226189,
  xmax: 117.245831,
  ymin: 31.828858,
  ymax: 31.842967
}

// Get count random points within the bbox rectangular area
function getRandomPoints(count) {
  const arr = []
  const arrPoint = turf.randomPoint(count, { bbox: [rectangle.xmin, rectangle.ymin, rectangle.xmax, rectangle.ymax] }).features // Random points
  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i].geometry.coordinates
    const val = Math.floor(Math.random() * 100) // Thermal value
    arr.push({ lng: item[0], lat: item[1], value: val })
  }
  return arr
}
