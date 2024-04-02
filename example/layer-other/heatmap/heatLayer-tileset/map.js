// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.654436, lng: 117.083883, alt: 759, heading: 316, pitch: -50 }
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
  addLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addLayer() {
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Petrochemical Plant",
    url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    maximumScreenSpaceError: 1,
    center: {
      lat: 31.654436,
      lng: 117.083883,
      alt: 758.53,
      heading: 316.4,
      pitch: -50.1,
      roll: 359.8
    },
    popup: "all"
  })
  map.addLayer(tilesetLayer)

  //Test point data, replaced during actual development
  const arrPoints = getRandomPoints(900)

  //Heat map layer
  const heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    //The following are the style parameters of the heat map itself, please refer to the API: https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 40,
      blur: 0.8
    },
    //The following are the style parameters of the rectangular vector object
    style: {
      opacity: 0.6,
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
      clampToGround: true
    }
  })
  map.addLayer(heatLayer)
}

// Get count random points within the bbox rectangular area
function getRandomPoints(count) {
  const xmin = 117.075718
  const xmax = 117.083508
  const ymin = 31.654645
  const ymax = 31.661744

  const arr = []
  const arrPoint = turf.randomPoint(count, { bbox: [xmin, ymin, xmax, ymax] }).features // Random point
  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i].geometry.coordinates
    const val = Math.floor(Math.random() * 100) // Thermal value

    arr.push({ lng: item[0], lat: item[1], value: val })
  }
  return arr
}
