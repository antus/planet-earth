// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 33.591733, lng: 119.032381, alt: 32, heading: 331, pitch: -21 },
    globe: {
      depthTestAgainstTerrain: true
    }
  }
}

let invertedEffect

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  globalNotify("Known Issue Tips", "(1) This is currently an experimental example, and the mirror effect is average. (2) The flatter the model, the better the effect.")

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false
  })
  map.addLayer(tiles3dLayer)

  // reflection effect
  invertedEffect = new mars3d.effect.InvertedEffect()
  map.addEffect(invertedEffect)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function changeState(val) {
  invertedEffect.enabled = val
}
