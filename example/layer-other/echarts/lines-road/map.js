// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.589203, lng: 120.732051, alt: 18446, heading: 2, pitch: -49 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/lineroad.json" })
    .then(function (json) {
      createEchartsLayer(json.data)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Create echart layer
 *
 * @param {object} data backend interface, obtained data
 * @returns {void} None
 */
function createEchartsLayer(data) {
  const options = getEchartsOption(data)
  options.depthTest = false // Whether to calculate depth (needs to be turned off when using large data)

  const echartsLayer = new mars3d.layer.EchartsLayer(options)
  map.addLayer(echartsLayer)

  //Chart adaptive
  window.addEventListener("resize", function () {
    echartsLayer.resize()
  })
}

/**
 *echart layer
 *
 * @param {object} data backend interface data
 * @return {option} Create echart chart data based on the obtained data
 */
function getEchartsOption(data) {
  const option = {
    animation: false,

    visualMap: {
      type: "piecewise",
      left: "right",
      bottom: 46,
      /* pieces: [
                {min: 15}, // If max is not specified, it means max is infinite (Infinity).
                {min: 12, max: 15},
                {min: 9, max: 12},
                {min: 6, max: 9},
                {min: 3, max: 6},
                {max: 3} // If min is not specified, it means min is infinite (-Infinity).
        ], */
      min: 0,
      max: 15,
      splitNumber: 5,
      maxOpen: true,
      color: ["red", "yellow", "green"],
      textStyle: {
        color: "#ffffff"
      }
    },
    tooltip: {
      formatter: function (params, ticket, callback) {
        return "Congestion Index:" + params.value
      },
      trigger: "item"
    },
    series: [
      {
        type: "lines",
        coordinateSystem: "mars3dMap",
        polyline: true,
        data,
        lineStyle: {
          normal: {
            opacity: 1,
            width: 4
          },
          emphasis: {
            width: 6
          }
        },
        effect: {
          show: true,
          symbolSize: 2,
          color: "white"
        }
      }
    ]
  }

  return option
}
