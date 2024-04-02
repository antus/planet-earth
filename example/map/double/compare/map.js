// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let mapSplit

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  layers: [
    {
      type: "geojson",
      name: "Sample data",
      url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
      popup: "{type} {name}",
      show: true
    },
    {
      type: "3dtiles",
      name: "Test Model",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 116.313536, lat: 31.217297, alt: 80 },
      scale: 100,
      show: true
    }
  ]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  createControl()

  map.on(mars3d.EventType.addLayer, function (event) {
    const mapEx = mapSplit.mapEx
    if (mapEx) {
      const layerOptions = event.layer.toJSON() // Convert to parameters
      const newLayer = mars3d.LayerUtil.create(layerOptions) // Create layer
      mapEx.addLayer(newLayer)
    }
  })

  setTimeout(() => {
    addTestData()
  }, 10000)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function createControl() {
  if (mapSplit) {
    return
  }

  // Modify the existing map to 50%
  const mapOld = document.getElementById("centerDiv3D")
  mapOld.style.width = "50%"

  // Get the parameters of the original map
  const mapOptions2 = map.getCurrentOptions() // map.getOptions()
  mapOptions2.control.baseLayerPicker = true // basemaps basemap switching button
  mapOptions2.control.sceneModePicker = false

  // Used for dual screens with the same layer and different configuration display
  for (let i = 0, len = mapOptions2.layers.length; i < len; i++) {
    const item = mapOptions2.layers[i]
    if (item.compare) {
      for (const key in item.compare) {
        item[key] = item.compare[key] // When compare attribute exists
      }
    }
  }
  console.log("Split screen map configuration", mars3d.Util.clone(mapOptions2))

  mapSplit = new mars3d.control.MapCompare({
    ...mapOptions2,
    parentContainer: document.body
  })
  map.addControl(mapSplit)

  //Modify comparison map
  mapSplit.mapEx.basemap = "Tian Map Electronics"
}

function destroyControl() {
  if (mapSplit) {
    map.removeControl(mapSplit)
    mapSplit = null
    const mapOld = document.getElementById("centerDiv3D")
    mapOld.style.width = "100%"
  }
}

function addTestData() {
  const layer = new mars3d.layer.TilesetLayer({
    name: "Test Model 2",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 116.267315, lat: 31.457617, alt: 103 },
    scale: 100,
    maximumScreenSpaceError: 2,
    cullWithChildrenBounds: false
  })
  map.addLayer(layer)
}
