// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 29.464497, lng: 106.529141, alt: 14871, heading: 1, pitch: -55 },
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    globe: {
      baseColor: "rgba(0,0,0,0)",
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  terrain: {
    show: false
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
  map.basemap = 2017 // blue basemap

  addDemoGraphics()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphics() {
  // geojson layer
  const geoJsonLayer1 = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/wuhan-line1.json",
    symbol: {
      type: "polylineC",
      styleOptions: {
        width: 50, // line width
        materialType: "PolylineGlow",
        materialOptions: {
          color: "#FF4500",
          opacity: 0.9,
          glowPower: 0.06 // luminous intensity
        }
      }
    },
    // popup: "all",
    show: true
  })
  map.addLayer(geoJsonLayer1)

  const geoJsonLayer2 = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/wuhan-line2.json",
    symbol: {
      type: "polylineC",
      styleOptions: {
        width: 10, // line width
        materialType: "PolylineGlow",
        materialOptions: {
          color: "#FF4500",
          opacity: 0.9,
          glowPower: 0.1 // luminous intensity
        }
      }
    },
    // popup: "all",
    show: true
  })
  map.addLayer(geoJsonLayer2)

  const geoJsonLayer3 = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/wuhan-line3.json",
    symbol: {
      type: "polylineC",
      styleOptions: {
        width: 10, // line width
        materialType: "PolylineGlow",
        materialOptions: {
          color: "#FF4500",
          opacity: 0.9,
          glowPower: 0.1 // luminous intensity
        }
      }
    },
    // popup: "all",
    show: true
  })
  map.addLayer(geoJsonLayer3)
}
