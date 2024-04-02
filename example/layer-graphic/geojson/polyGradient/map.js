// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 26.339073, lng: 118.495643, alt: 937783, heading: 355, pitch: -58 }
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
  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Cities in Anhui",
    url: "//data.mars3d.cn/file/geojson/areas/340000_full.json",
    symbol: {
      type: "polygon",
      styleOptions: {
        materialType: mars3d.MaterialType.PolyGradient, // Important parameters, specify the material
        materialOptions: {
          color: "#3388cc",
          opacity: 0.7,
          alphaPower: 1.3
        },
        // Center point of the surface, display text configuration
        label: {
          text: "{name}", // Corresponding attribute name
          opacity: 1,
          font_size: 25,
          color: "#fff",
          font_family: "楷体",
          outline: false,
          scaleByDistance: true,
          scaleByDistance_far: 20000000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1
        }
      },
      callback: function (attr, styleOpt) {
        const randomHeight = (attr.childrenNum || 1) * 500 // Test height
        return {
          materialOptions: {
            color: getColor()
          },
          height: 0,
          diffHeight: randomHeight
        }
      }
    },
    popup: "{name}"
  })
  map.addLayer(geoJsonLayer)

  //Bind event
  geoJsonLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })
  geoJsonLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

const arrColor = ["rgb(15,176,255)", "rgb(18,76,154)", "#40C4E4", "#42B2BE", "rgb(51,176,204)", "#8CB7E5", "rgb(0,244,188)", "#139FF0"]

let index = 0
function getColor() {
  return arrColor[++index % arrColor.length]
}
