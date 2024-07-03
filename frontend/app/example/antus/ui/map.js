var map // mars3d.Map three-dimensional map object

var mapOptions = {
  scene: {
    center: {"lat":41.875969,"lng":12.490323,"alt":629.7,"heading":2,"pitch":-19.9}
  },
  control: {
    geocoder: false
  },
  terrain: {
      "name": "ION",
      "type": "ion",
      "requestWaterMask": true,
      "requestVertexNormals": true,
      "show": true
    },
    control: {
      baseLayerPicker: false,
      sceneModePicker: false,
      compass:false,
      homeButton:false,
      baseLayerPicker: false,
      sceneModePicker: false,
      vrButton: false,
      fullscreenButton: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      infoBox: false,
      geocoder: false,
      selectionIndicator: false,
      showRenderLoopErrors: true,
      contextmenu: { hasDefault: true },
      mouseDownView: true,
      distanceLegend: false,
      locationBar: false,
      zoom:false
    }

}

var mapWidgets =
{
  "version": "20220120",
  "defaultOptions": {
    "style": "dark",
    "windowOptions": {
      "skin": "layer-mars-dialog animation-scale-up",
      "position": {
        "top": 50,
        "right": 10
      },
      "maxmin": false,
      "resize": true
    },
    "autoReset": false,
    "autoDisable": true,
    "disableOther": true
  },
  "openAtStart": [
    {
      "name": "toolbar",
      "uri": "widgets/smartcity/toolbar/widget.js",
      "css": {
        "top": "10px",
        "left": "auto",
        "right": "10px"
      }
    }
  ],
  "widgets": []
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

