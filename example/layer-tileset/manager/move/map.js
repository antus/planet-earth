// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tiles3dLayer

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  // If there is a "+" symbol in the model address, you can add the following method for customized processing
  Cesium.Resource.ReplaceUrl = function (url) {
    if (url.endsWith(".json") || url.endsWith(".b3dm")) {
      return url.replace(/\+/gm, "%2B") // Escape the "+" symbol in 3dtiles
    } else {
      return url
    }
  }
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
  removeLayer()
}

function removeLayer() {
  if (tiles3dLayer) {
    map.basemap = 2021 // Switch to the default satellite base map

    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}

// Whether there is terrain
function chkHasTerrain(isStkTerrain) {
  map.hasTerrain = isStkTerrain
}

// Depth detection
function chkTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
}

// Current page business related
function showModel(modelUrl) {
  removeLayer()
  if (!modelUrl) {
    return
  }

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: modelUrl,
    maximumScreenSpaceError: 1,

    // Style when highlighted
    highlight: {
      type: mars3d.EventType.click, // The default is to highlight when the mouse moves in, you can also specify click to highlight
      color: "#00FF00"
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // Loading completion event
  tiles3dLayer.on(mars3d.EventType.load, function (event) {
    console.log("Model loading completed", event)
  })
}

function setTranslation(x, y, z) {
  const translation = Cesium.Cartesian3.fromArray([x, y, z])
  const modelMatrix = Cesium.Matrix4.fromTranslation(translation)
  tiles3dLayer.tileset.modelMatrix = modelMatrix

  // print value
  const position = mars3d.PointUtil.getPositionByHprAndOffset(tiles3dLayer.position, new Cesium.Cartesian3(x, y, z))
  const point = mars3d.LngLatPoint.parse(position)
  console.log("New coordinates are", point)
}
