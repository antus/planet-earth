// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

/**
 * Construct bloom effect object
 * @type {mars3d.BloomEffect}
 */
let bloomEffect

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.823874, lng: 117.223976, alt: 3509, heading: 0, pitch: -90 }
  },
  control: {
    baseLayerPicker: false
  }
}

function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
  // Construct bloom effect for slide bar testing
  bloomEffect = new mars3d.effect.BloomEffect()
  map.addEffect(bloomEffect)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Adjust brightness (demo slider)
function updateBrightness(val) {
  bloomEffect.brightness = val
}

// Whether to run map mouse interaction
function enableMapMouseController(value) {
  map.setSceneOptions({
    cameraController: {
      enableZoom: value,
      enableTranslate: value,
      enableRotate: value,
      enableTilt: value
    }
  })
}
