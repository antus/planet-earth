// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 39.800803, lng: 116.34344, alt: 6521, heading: 0, pitch: -45 }
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

  map.basemap = "Black basemap"

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addDemoGraphics(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphics(graphicLayer) {
  // color
  const colors = ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"].reverse()

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/bj-bus.json" })
    .then(function (res) {
      const arr = mars3d.Util.geoJsonToGraphics(res) // Parse geojson
      arr.forEach((item, index) => {
        const i = index % colors.length

        const color = colors[i]
        const height = i * 80 + 50

        const graphic = new mars3d.graphic.PolylinePrimitive({
          positions: item.positions,
          style: {
            width: 3,
            color,
            opacity: 0.8,
            setHeight: height
          },
          attr: item.attr
        })
        graphicLayer.addGraphic(graphic)
      })
    })
    .catch(function (error) {
      console.log("Failed to obtain single truck details", error)
    })
}
