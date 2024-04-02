// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let heatLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.823087, lng: 117.236208, alt: 2383, heading: 3, pitch: -61 }
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

  showHeatMap()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function showHeatMap() {
  //Generation of random data
  const heatMapData0 = getRandomPoints()
  const heatMapData1 = getRandomPoints()
  const resultHeatMapData = getRandomPoints()

  //Heat map layer
  heatLayer = new mars3d.layer.HeatLayer({
    positions: heatMapData0,
    rectangle,
    //The following are the style parameters of the heat map itself, please refer to the API: https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 40,
      blur: 0.85
    },
    //The following are the style parameters of the rectangular vector object
    style: {
      // arc: true, // Whether it is a surface
      height: 200.0
    }
  })
  map.addLayer(heatLayer)

  // To demonstrate dynamic updates
  let ratio = 0
  setInterval(() => {
    if (!isDynamic) {
      return
    }

    ratio += 0.003
    if (ratio > 1.0) {
      ratio = 0.0
    }

    lerpHeatMapData(heatMapData0, heatMapData1, ratio, resultHeatMapData)

    // update data
    heatLayer.setPositions(resultHeatMapData, true)
  }, 100)
}

let isDynamic = true
function chkUnderground(enabled) {
  isDynamic = enabled
}

const rectangle = {
  xmin: 117.226189,
  xmax: 117.245831,
  ymin: 31.828858,
  ymax: 31.842967
}

const heatCount = 1000

// Get count random points within the bbox rectangular area
function getRandomPoints() {
  const arr = []
  const arrPoint = turf.randomPoint(heatCount, { bbox: [rectangle.xmin, rectangle.ymin, rectangle.xmax, rectangle.ymax] }).features // Random points
  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i].geometry.coordinates
    const val = Math.floor(Math.random() * 100) // Thermal value
    arr.push({ lng: item[0], lat: item[1], value: val })
  }
  return arr
}

function lerpHeatMapData(startArr, endArr, ratio, result) {
  for (let i = 0; i < heatCount; i++) {
    const start = startArr[i]
    const end = endArr[i]
    result[i] = {
      lng: start.lng * (1 - ratio) + end.lng * ratio,
      lat: start.lat * (1 - ratio) + end.lat * ratio,
      value: start.value * (1 - ratio) + end.value * ratio
    }
  }
}
