// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let geoJsonLayer

var mapOptions = {
  scene: {
    center: { lat: 31.722018, lng: 117.251926, alt: 8378, heading: 0, pitch: -33 }
  }
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = 2017 // switch to blue basemap

  addLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Added buildings and sports facilities in Hefei City
 * @returns {void}
 *
 */
function addLayer() {
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei City Building",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    marsJzwStyle: true, // Turn on building special effects (built-in Shader code)
    popup: [
      { field: "objectid", name: "number" },
      { field: "name", name: "name" },
      { field: "height", name: "building height", unit: "meters" }
    ],
    center: { lat: 31.841018, lng: 117.252932, alt: 1346, heading: 38, pitch: -26 },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Sports facilities",
    url: "//data.mars3d.cn/file/geojson/hfty-point.json",
    symbol: {
      type: "billboard",
      styleOptions: {
        image: "img/marker/mark-red.png",
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(geoJsonLayer)

  //Bind event
  geoJsonLayer.on(mars3d.EventType.load, function (event) {
    const geojsonLength = geoJsonLayer.length
    eventTarget.fire("geoJsonLayerLoad", { geojsonLength })
    console.log("Data loading completed", event)
  })
}

// Save as Geojson file
function toGeojson() {
  const geojson = geoJsonLayer.toGeoJSON()
  mars3d.Util.downloadFile("hfty-point-contains height value.json", JSON.stringify(geojson))
}

// The sample code for calculating the height of the ground can update the obtained height into the database, so there is no need to repeat the calculation in the future.
function getDataSurfaceHeight() {
  if (geoJsonLayer.length === 0) {
    globalMsg("The data has not been loaded successfully!")
    return
  }
  showLoading()

  // Perform the grounding operation on the data in the layer to automatically obtain the grounding height.
  geoJsonLayer
    .autoSurfaceHeight({
      endItem: function (result) {
        const resultData = {
          percent: result.index + 1,
          percentAll: result.count
        }
        eventTarget.fire("computedResult", { resultData })
      }
    })
    .then(() => {
      hideLoading()
    })
}
