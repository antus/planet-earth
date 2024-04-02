// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.801072, lng: 117.208356, alt: 1250, heading: 35, pitch: -17 }
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
  map.basemap = 2017 // switch to blue basemap

  const tilesetLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    style: {
      color: {
        conditions: [["true", `color("rgba(42, 160, 224, 1)")`]]
      }
    },
    marsJzwStyle: true, // Turn on building special effects (built-in Shader code)
    center: { lat: 31.801072, lng: 117.208356, alt: 1250, heading: 35, pitch: -17 },
    popup: "all"
  })
  map.addLayer(tilesetLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const arrData = []
  for (let j = 0; j < 100; ++j) {
    const startPt = randomPoint()

    const endPt = startPt.clone()
    endPt.alt = random(1000, 2000)

    arrData.push({
      positions: [startPt, endPt],
      style: {
        width: 1,
        materialType: mars3d.MaterialType.LineFlowColor,
        materialOptions: {
          color: "rgb(141,172,172)",
          speed: random(5, 10),
          startTime: random(1000, 3000),
          percent: 0.1,
          alpha: 0.01
        }
      }
    })
  }

  // Combined rendering of multiple line objects.
  const graphic = new mars3d.graphic.PolylineCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(graphic)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

// Get random points in the area
function randomPoint() {
  const jd = random(117.208056 * 1000, 117.25548 * 1000) / 1000
  const wd = random(31.816617 * 1000, 31.855756 * 1000) / 1000
  return new mars3d.LngLatPoint(jd, wd, 100)
}

// Get random numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
