// import * as mars3d from "mars3d"
/*
async function initMap(mapOptions) {

  var options = mars3d.Util.merge(mapOptions, {
    scene: {
      center: {"lat":41.875969,"lng":12.490323,"alt":629.7,"heading":2,"pitch":-19.9}
    }
  })

  //Create a 3D earth scene
  const map = new mars3d.Map("mars3dContainer", mapOptions)

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

  //Print test information
  console.log("Mars3d's Map main object construction completed", map)
  console.log("The native Cesium.Viewer of Cesium is ", map.viewer)


  console.log("Does the current computer support webgl2", Cesium.FeatureDetection.supportsWebgl2(map.scene))

  return map
}
*/

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

