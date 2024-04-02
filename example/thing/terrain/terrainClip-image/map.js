// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.401401, lng: 117.014981, alt: 12825, heading: 316, pitch: -53 }
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

  const terrainClip = new mars3d.thing.TerrainClip({
    positions: [
      [116.919224, 31.460461],
      [116.901819, 31.459734],
      [116.902772, 31.479859],
      [116.926981, 31.479483],
      [116.936875, 31.486053],
      [116.974004, 31.489014],
      [116.982398, 31.483053],
      [116.981635, 31.458477],
      [116.946754, 31.424056],
      [116.908152, 31.44481]
    ],
    exact: true,
    diffHeight: 1200, // Depth of mining area
    image: "./img/textures/mining.jpg", // Well wall texture url
    imageBottom: "./img/textures/poly-soil.jpg", // Bottom texture url
    splitNum: 2 // wall boundary interpolation number
  })
  map.addThing(terrainClip)

  globalNotify("Function Tip", "Not real data, only reflects the effect of rock formations.")
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
