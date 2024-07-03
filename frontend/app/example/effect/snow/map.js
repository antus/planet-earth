// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let snowEffect
let snowCover

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 33.591015, lng: 119.032697, alt: 73, heading: 343, pitch: -21 },
    globe: {
      // depthTestAgainstTerrain: true
    }
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

  //Atomization effect
  map.scene.fog.density = 0.001
  map.scene.fog.minimumBrightness = 0.8

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false
  })
  map.addLayer(tiles3dLayer)

  snowEffect = new mars3d.effect.SnowEffect({
    speed: 20,
    maxHeight: 8000 // Do not display if the height is greater than this
  })
  map.addEffect(snowEffect)

  snowCover = new mars3d.effect.SnowCoverEffect({
    layer: tiles3dLayer, // If the 3dtiles layer is passed, it will only take effect on this model.
    alpha: 0.6,
    maxHeight: 8000 // Do not display if the height is greater than this
  })
  map.addEffect(snowCover)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Whether to enable the snow effect
function setSnow(val) {
  snowEffect.enabled = val
}

// speed
function setSpeed(value) {
  snowEffect.speed = value
}
//
function setScale(value) {
  snowEffect.scale = value
}

// Whether to enable the snow effect
function setCover(val) {
  snowCover.enabled = val
}

//Snow thickness
function setAlpha(value) {
  snowCover.alpha = value
}
