// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 18.188973, lng: 112.70603, alt: 5647407, heading: 352, pitch: -76 }
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

  // Create Echarts layer
  createEchartsLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function createEchartsLayer() {
  const options = getEchartsOption()
  // options.pointerEvents = true // Use click

  const echartsLayer = new mars3d.layer.EchartsLayer(options)
  map.addLayer(echartsLayer)

  if (options.pointerEvents) {
    echartsLayer.on("click", function (event) {
      console.log("Layer clicked", event)
    })
  }

  //Chart adaptive
  window.addEventListener("resize", function () {
    echartsLayer.resize()
  })
}

/**
 *echart layer
 *
 * @return {option} echart chart data
 */
function getEchartsOption() {
  const beijinCoord = [116.407395, 39.904211]

  const geoCoorddata = {
    Hefei: [117.399043, 31.741401],
    Shenzhen: [114.057865, 22.543096],
    Urumqi: [87.405386, 41.779595]
  }

  const symbolPoint = "image://img/icon/symbol1.png"
  const linePoint = "image://img/icon/linePoint1.png"

  const pointArr = []
  for (const key in geoCoorddata) {
    pointArr.push({
      name: key,
      value: geoCoorddata[key],
      symbol: symbolPoint
    })
  }

  const option = {
    animation: false,

    series: [
      {
        name: "",
        type: "lines",
        coordinateSystem: "mars3dMap",
        zlevel: 1,
        data: [
          {
            name: "Hefei",
            toname: "Beijing",
            coords: [geoCoorddata["Hefei"], beijinCoord]
          },
          {
            name: "Shenzhen",
            toname: "Beijing",
            coords: [geoCoorddata["Shenzhen"], beijinCoord]
          },
          {
            name: "Urumqi",
            toname: "Beijing",
            coords: [geoCoorddata["Urumqi"], beijinCoord]
          }
        ],
        //Dynamic special effects above the line
        effect: {
          show: true,
          smooth: false,
          trailLength: 0,
          symbol: linePoint,
          symbolSize: [10, 30],
          period: 4
        },
        lineStyle: {
          normal: {
            width: 1,
            color: "#ffffff",
            curveness: 0.2
          }
        }
      },
      {
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        zlevel: 3,
        data: [
          {
            name: "Beijing",
            value: beijinCoord.concat(200)
          }
        ],
        rippleEffect: {
          period: 10,
          scale: 5,
          brushType: "fill"
        }
      },
      {
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        symbolSize: [20, 20],
        symbolOffset: [0, -10],
        zlevel: 3,
        circular: {
          rotateLabel: true
        },
        label: {
          normal: {
            show: true,
            position: "bottom",
            formatter: "{b}",
            fontSize: 18,
            color: "#fff",
            textBorderColor: "#2aa4e8",
            offset: [0, 20]
          }
        },
        itemStyle: {
          normal: {
            shadowColor: "none"
          }
        },
        data: pointArr
      }
    ]
  }
  return option
}
