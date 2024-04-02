// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.scene.center = { lat: 28.439577, lng: 119.476925, alt: 229, heading: 57, pitch: -29 }
  option.control = {
    vrButton: true
  }
  return option
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  globalNotify("Known Issue Tips", `(1) Please make sure your monitor is adjusted to 3D mode. (2) You need to wear 3D glasses to experience the effect.`)

  //Add a model and the effect will be better
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "County Community",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    center: { lat: 28.439577, lng: 119.476925, alt: 229, heading: 57, pitch: -29 }
  })
  map.addLayer(tiles3dLayer)

  //This sentence opens VR
  map.scene.useWebVR = true

  // WebVR related parameters: viewing distance of glasses (unit: meters)
  map.scene.eyeSeparation = 100.0

  //WebVR related parameters: focal length
  map.scene.eyeSeparation.focalLength = 5.0
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
