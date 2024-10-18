var map // mars3d.Map three-dimensional map object

var mapOptions = {
  scene: {
    center: {"lat":42.109196,"lng":13.360908,"alt":2138813.3,"heading":360,"pitch":-90},
    mapProjection: mars3d.CRS.EPSG3857, // Display Mercator projection in 2D
    sceneMode: Cesium.SceneMode.SCENE2D
  },
  control: {
    geocoder: false
  },
  terrain: {
      "name": "ION",
      "type": "ion",
      "requestWaterMask": false,
      "requestVertexNormals": false,
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
  },
  "basemaps": [  
    {
      pid: 10,
      name: "Open Street Map",
      type: "xyz",
      icon: "/img/basemaps/osm.png",
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      subdomains: "abc",
      id: 19,
      opacity: 1,
      zIndex: 2,
      show: true
    }
  ],
  "layers": [
    { "id": 4020, "name": "OGC WMS Service", "type": "group" },
    {
      "pid": 4020,
      "name": "Stazioni",
      "type": "wms",
      "url": "http://localhost:8080/geoserver/wms",
      "layers": "monitoraggio-ambientale:stazioni",
      "parameters": { "transparent": "true", "format": "image/png" },
      "getFeatureInfoParameters": {
        feature_count: 10
      },
      "popup": "all",
      "show": false,
      "flyTo": true
    },
    {
      "pid": 4020,
      "name": "Comuni",
      "type": "wms",
      "url": "http://localhost:8080/geoserver/wms",
      "layers": "monitoraggio-ambientale:Comuni",
      "parameters": { "transparent": "true", "format": "image/png" },
      "getFeatureInfoParameters": {
        feature_count: 10
      },
      "popup": "all",
      "show": true,
      "flyTo": true
    },
  ]

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
    "autoDisable": false,
    "disableOther": false
  },
  "openAtStart": [

    {
      "name": "Toolbar",
      "uri": "widgets/antus/toolbar/widget.js",
      "css": {
        "top": "10px",
        "left": "auto",
        "right": "10px"
      }
    },
  ],
  "widgets": [
    {
      "name": "dockable-layer-manager",
      "uri": "widgets/antus/dockable-layer-manager/widget.js"
    },
    {
      "name": "Panel",
      "uri": "widgets/antus/panel/widget.js",
      "data": [
          {
            "name": "Geoserver local",
            "url": "http://localhost:8080/geoserver/wms",
            "type": "wms"
          },
          {
            "name": "Geoserver GiottoLab",
            "url": "http://10.100.208.140:8089/geoserver/wms",
            "type": "wms"
          },
        ]
    },
    {
      "name": "Layer attributes",
      "uri": "widgets/antus/layer-table/widget.js"
    },
    {
      "name": "winbox_sample",
      "uri": "widgets/winbox_sample/widget.js",
      "parent": "mars3dContainer",
      "properties": {
        "background": "#1e243299",
        "border": 0,
        "width": 200,
        "height": 200,
        "x": "right",
        "y": "bottom",
        "top":50,
        "left":0,
        "bottom":26,
        "right":0,
        "class": [
          "no-full",
          "no-min",
          "no-max"
        ]
      }
    }
  ]
}

/*
    {
      "name": "appbar",
      "uri": "widgets/antus/appbar/widget.js",
    },
*/

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
    //const GooglePhotorealisticLayer = await Cesium.createGooglePhotorealistic3DTileset();
    //map.viewer.scene.primitives.add(GooglePhotorealisticLayer);

    //map.flyHome({ duration: 2 })

    // opening animation
	
    map.openFlyAnimation({
      duration: 2,
      easingFunction1: Cesium.EasingFunction.QUINTIC_IN_OUT,
      callback: function () {
        // Callback after animation playback is completed
      }
    })
	
  } catch (error) {
    console.log(`Failed to load tileset: ${error}`);
  }
}

