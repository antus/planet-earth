// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 25.845231, lng: 117.57678, alt: 488175, heading: 358, pitch: -42 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: "#363635", // sky background color
    globe: {
      baseColor: " #363635", // Earth ground background color
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  control: {
    baseLayerPicker: false
  },
  basemaps: [],
  layers: []
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  // Add Anhui Province boundary wall
  const anhuiWall = new mars3d.layer.GeoJsonLayer({
    name: "Anhui Province Border Wall",
    url: "//data.mars3d.cn/file/geojson/areas/340000.json",
    symbol: {
      type: "wallP",
      styleOptions: {
        setHeight: -15000,
        diffHeight: 15000, // wall height
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: "./img/textures/fence-top.png",
          color: "rgba(0,255,255,0.6)"
        }
      }
    }
  })
  map.addLayer(anhuiWall)

  // Satellite base map of Anhui Province
  const tileLayer = new mars3d.layer.XyzLayer({
    url: "//data.mars3d.cn/tile/anhui/{z}/{x}/{y}.png",
    minimumLevel: 0,
    maximumLevel: 12,
    rectangle: { xmin: 114.811691, xmax: 119.703609, ymin: 29.35597, ymax: 34.698585 }
  })
  map.addLayer(tileLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
