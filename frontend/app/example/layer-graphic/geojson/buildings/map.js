// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.752136, lng: 117.269021, alt: 3782, heading: 338, pitch: -23 }
  },
  terrain: { show: false }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
  map.basemap = 2017 // blue basemap

  globalMsg("The file data is large and the data is being loaded, please wait a moment...")
  showLoading()

  const colorHash = {
    10: "#FFEDA0",
    15: "#FED976",
    20: "#FEB24C",
    25: "#FD8D3C",
    30: "#FC4E2A",
    35: "#E31A1C",
    40: "#BD0026",
    450000: "#800026"
  }

  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Building Floor",
    url: "//data.mars3d.cn/file/geojson/buildings-hf.json",
    symbol: {
      type: "polygonC", // Large data surface type, high efficiency
      styleOptions: {
        color: "#0d3685",
        opacity: 1.0,
        outline: false
      },
      callback: function (attr, styleOpt) {
        const floor = Number(attr.floor || 1)
        const diffHeight = floor * 5
        for (const key in colorHash) {
          if (floor <= parseInt(key)) {
            return { height: 0, diffHeight, color: colorHash[key] }
          }
        }
        return { height: 0, diffHeight }
      }
    },
    popup: "all"
  })
  map.addLayer(geoJsonLayer)

  //Bind event
  geoJsonLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)

    hideLoading() // Close
  })

  //Bind listening events on the layer
  geoJsonLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.graphic.attr
    console.log("The single value in the merged object was clicked", pickedItem)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
