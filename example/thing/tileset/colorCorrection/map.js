// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 33.591015, lng: 119.032698, alt: 73, heading: 343, pitch: -21 }
  }
}

var tilesetColorCorrection
var tiles3dLayer

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false
  })
  map.addLayer(tiles3dLayer)

  tilesetColorCorrection = new mars3d.thing.TilesetColorCorrection({
    layer: tiles3dLayer
  })
  map.addThing(tilesetColorCorrection)
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
  tilesetColorCorrection.enabled = val
}
//Modify the corresponding parameters
function setBrightness(val) {
  tilesetColorCorrection.brightness = val
}

function setContrast(val) {
  tilesetColorCorrection.contrast = val
}

function setHue(val) {
  tilesetColorCorrection.hue = val
}

function setSaturation(val) {
  tilesetColorCorrection.saturation = val
}
