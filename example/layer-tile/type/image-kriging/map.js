// import * as mars3d from "mars3d"
// import kriging from "./krigingConfig"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 24.018309, lng: 109.414236, alt: 8607884, heading: 0, pitch: -82 }
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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// overlaid layers
let tileLayer
function addTileLayer() {
  removeTileLayer()

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/temperature.json" })
    .then(function (geojson) {
      console.log("Loading data completed", geojson)

      // eslint-disable-next-line no-undef
      const image = loadkriging(geojson.features, kriging_bounds, kriging_colors)
      tileLayer = new mars3d.layer.ImageLayer({
        url: image,
        rectangle: {
          xmin: 73.4766,
          xmax: 135.088,
          ymin: 18.1055,
          ymax: 53.5693
        },
        alpha: 0.4
      })
      map.addLayer(tileLayer)
    })
    .catch(function (error) {
      console.log("Construction error", error)
    })
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

// Draw pictures based on kriging interpolation
function loadkriging(tempture, bounds, colors) {
  // let canvas = document.createElement("canvas")
  const canvas = mars3d.DomUtil.create("canvas")
  canvas.width = 2000
  canvas.height = 2000

  const t = []
  const x = []
  const y = []
  for (let i = 0, len = tempture.length; i < len; i++) {
    t.push(tempture[i].properties.Temperatur) // Weight value
    x.push(tempture[i].geometry.coordinates[0]) // x
    y.push(tempture[i].geometry.coordinates[1]) // y
  }
  // 1. Use Kriging to train a variogram object

  const variogram = kriging.train(t, x, y, "exponential", 0, 100)

  // 2. Use the variogram object just now to make the grid elements in the geographical location described by polygons have different predicted values;
  // bounds: coordinates of the surface format in ordinary geojson format.

  const grid = kriging.grid(bounds, variogram, 0.05)
  // 3. Render the obtained grid prediction value to the canvas

  kriging.plot(canvas, grid, [73.4766, 135.088], [18.1055, 53.5693], colors)

  const image = canvas.toDataURL("image/png")
  return image
}
