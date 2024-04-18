var map // mars3d.Map three-dimensional map object

var mapOptions = {
  scene: {
    center: {"lat":41.875969,"lng":12.490323,"alt":629.7,"heading":2,"pitch":-19.9}
  },
  control: {
    geocoder: false
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
  configMap();
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

async function configMap() {
  try {
    const GooglePhotorealisticLayer = await Cesium.createGooglePhotorealistic3DTileset();
    map.viewer.scene.primitives.add(GooglePhotorealisticLayer);

    map.flyHome({ duration: 0 })
      
    // opening animation
    map.openFlyAnimation({
      duration1:3,
      easingFunction1: Cesium.EasingFunction.QUINTIC_IN_OUT,
      callback: function () {
        // Callback after animation playback is completed
      }
    })
  } catch (error) {
    console.log(`Failed to load tileset: ${error}`);
  }
}

