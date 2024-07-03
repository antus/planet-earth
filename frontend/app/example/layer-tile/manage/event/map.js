// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tileLayer
let wmsLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 28.268322, lng: 117.426104, alt: 1052215, heading: 0, pitch: -69 }
  },
  control: {
    baseLayerPicker: false
  },
  basemaps: [],
  layers: [{ type: "tileinfo", name: "tile information", zIndex: 3, show: true }]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
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
  //Add layer
  tileLayer = new mars3d.layer.TdtLayer({
    name: "Heaven Map Image",
    layer: "img_d",
    zIndex: 1
  })
  map.addLayer(tileLayer)

  // Vector publishing type layers such as wms and arcgis support click events.
  wmsLayer = new mars3d.layer.WmsLayer({
    url: "//server.mars3d.cn/geoserver/mars/wms",
    layers: "mars:hf",
    crs: "EPSG:4326",
    parameters: {
      transparent: "true",
      format: "image/png"
    },
    getFeatureInfoParameters: {
      feature_count: 10
    },
    popup: "all",
    zIndex: 2
  })
  map.addLayer(wmsLayer)

  addTileStatus()
}

function addTileStatus() {
  map.on(mars3d.EventType.tileLoadProgress, function (count) {
    // console.log(`All map tiles loaded, remaining: ${count}`)
    if (count === 0) {
      console.log(`All map tiles loaded`)
    }
  })

  let count = 0
  //Add a single tile and start loading tiles (before request)
  tileLayer.on(mars3d.EventType.addTile, function (event) {
    count++
    console.log(`${count}, start request to load tiles: L:${event.level},X:${event.x},Y:${event.y}`)
  })
  //Add a single tile. Loading of tiles is completed.
  tileLayer.on(mars3d.EventType.addTileSuccess, function (event) {
    count--
    console.log(`${count}, start request to load tiles: L:${event.level},X:${event.x},Y:${event.y}`)
  })
  //Add a single tile. An error occurred while loading the tile.
  tileLayer.on(mars3d.EventType.addTileError, function (event) {
    count--
    console.log(`${count}, start request to load tiles: L:${event.level},X:${event.x},Y:${event.y}`)
  })

  // Uninstall removes tiles
  tileLayer.on(mars3d.EventType.removeTile, function (event) {
    console.log(`Uninstall removed tiles: L:${event.level},X:${event.x},Y:${event.y}`)
  })

  // click event
  wmsLayer.on(mars3d.EventType.click, function (event) {
    console.log("Clicked vector data, total" + event.features.length + "bar", event)
  })
}
