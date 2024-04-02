// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.783013, lng: 117.221851, alt: 2307, heading: 1, pitch: -29 }
  },
  terrain: false
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  GeodePoiLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let geodePoiLayer

function GeodePoiLayer() {
  // Gaode error code: https://lbs.amap.com/api/webservice/guide/tools/info/

  // Amap POI layer, demonstrating block loading of big data
  geodePoiLayer = new mars3d.layer.GeodePoiLayer({
    minimumLevel: 13,
    debuggerTileInfo: false, // Whether to display grid information (for testing)
    key: mars3d.Token.gaodeArr, // Please replace the Gaode KEY below with the one you applied for in the actual project, because this key is not guaranteed to be valid for a long time.
    filter: {
      types: "120000|130000|190000"
    },
    height: 5,
    symbol: {
      styleOptions: {
        image: "img/marker/mark-blue.png",
        scaleByDistance: true,
        scaleByDistance_far: 20000,
        scaleByDistance_farValue: 0.6,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        label: {
          text: "{name}",
          font_size: 15,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -30,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 4000,
          distanceDisplayCondition_near: 0
        }
      }
    }
    // When it is an entity type, the aggregation configuration of the point
    // clustering: {
    //   enabled: true,
    //   pixelRange: 20,
    // },
  })
  map.addLayer(geodePoiLayer)
}

//Layer state The layer managed in the component
function getManagerLayer() {
  return geodePoiLayer
}
