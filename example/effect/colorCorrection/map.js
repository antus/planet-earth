// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let colorCorrection

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 33.591015, lng: 119.032698, alt: 73, heading: 343, pitch: -21 }
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

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false
  })
  map.addLayer(tiles3dLayer)

  //Construction effect
  colorCorrection = new mars3d.effect.ColorCorrectionEffect()
  map.addEffect(colorCorrection)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Whether to enable special effects
function setDepthOfField(val) {
  colorCorrection.enabled = val
}
//Modify the corresponding parameters
function setBrightness(val) {
  colorCorrection.brightness = val
}

function setContrast(val) {
  colorCorrection.contrast = val
}

function setHue(val) {
  colorCorrection.hue = val
}

function setSaturation(val) {
  colorCorrection.saturation = val
}
