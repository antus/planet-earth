// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.794428, lng: 117.235343, alt: 2351.9, heading: 1.6, pitch: -28.8, roll: 0 }
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
  map.basemap = 2017 // blue basemap

  //Load city model
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    style: {
      color: {
        conditions: [["true", `color("rgba(42, 160, 224, 1)")`]]
      }
    },
    marsJzwStyle: true,
    popup: "all"
  })
  map.addLayer(tilesetLayer)

  // Perspective switching (step-by-step execution)
  map.setCameraViewList([
    { lat: 31.813938, lng: 117.240085, alt: 3243, heading: 357, pitch: -52 },
    { lat: 31.821728, lng: 117.253605, alt: 1702, heading: 319, pitch: -37 },
    { lat: 31.836674, lng: 117.260762, alt: 1779, heading: 269, pitch: -37 }
  ])

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Test point data, replaced during actual development
  const arrPoints = getRandomPoints(1000)

  //Heat map layer
  const heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    //The following are the style parameters of the heat map itself, please refer to the API: https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 60,
      blur: 0.85
    },
    //The following are the style parameters of the rectangular vector object
    style: {
      arc: true, // Is it a surface?
      height: 200.0
    }
    // flyTo: true,
  })
  map.addLayer(heatLayer)

  //Display the corresponding points on the ground to test the correctness of the rendering results
  for (let i = 0; i < arrPoints.length; i++) {
    const item = arrPoints[i]

    const graphic = new mars3d.graphic.PointPrimitive({
      position: [item.lng, item.lat, 90],
      style: {
        color: "#ffff00",
        pixelSize: 7
      }
    })
    graphicLayer.addGraphic(graphic)
  }
  graphicLayer.show = false
}

//Display the corresponding data points
function chkUnderground(val) {
  graphicLayer.show = val
}

// Get count random points within the bbox rectangular area
function getRandomPoints(count) {
  const xmin = 117.226189
  const xmax = 117.245831
  const ymin = 31.828858
  const ymax = 31.842967
  const arr = []
  const arrPoint = turf.randomPoint(count, { bbox: [xmin, ymin, xmax, ymax] }).features // Random point
  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i].geometry.coordinates
    const val = Math.floor(Math.random() * 100) // Thermal value
    arr.push({ lng: item[0], lat: item[1], value: val })
  }
  return arr
}
