// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 14.986428, lng: 113.87451, alt: 3519007, heading: 353, pitch: -69 }
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
 * @return {option} echart chart data
 */
function getEchartsOption() {
  const allData = {
    citys: [
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u8087\u5e86",
        value: [112.47, 23.05, 2],
        symbolSize: 1
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u5fb7\u9633",
        value: [104.38, 31.13, 2],
        symbolSize: 1
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u8861\u9633",
        value: [112.57, 26.9, 2],
        symbolSize: 1
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u6069\u65bd",
        value: [109.47, 30.3, 2],
        symbolSize: 1
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u54b8\u9633",
        value: [108.7, 34.33, 2],
        symbolSize: 1.0
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u8302\u540d",
        value: [110.92, 21.67, 2],
        symbolSize: 1
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u91cd\u5e86",
        value: [106.55, 29.57, 2],
        symbolSize: 8.0
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u6b66\u6c49",
        value: [114.3, 30.6, 2],
        symbolSize: 11.0
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u6c88\u9633",
        value: [123.43, 41.8, 2],
        symbolSize: 1
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u6d77\u53e3",
        value: [110.32, 20.03, 2],
        symbolSize: 1
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u4e0a\u6d77",
        value: [121.47, 31.23, 2],
        symbolSize: 5.0
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u5e7f\u5dde",
        value: [113.5107, 23.2196, 2],
        symbolSize: 5.0
      },
      {
        itemStyle: {
          normal: {
            color: "#58B3CC"
          }
        },
        name: "\u8346\u95e8",
        value: [112.2, 31.03, 2],
        symbolSize: 1
      }
    ],
    movelines: [
      {
        toName: "\u91cd\u5e86",
        fromName: "\u54b8\u9633",
        coords: [
          [108.7, 34.33],
          [106.55, 29.57]
        ]
      },
      {
        toName: "\u4e0a\u6d77",
        fromName: "\u91cd\u5e86",
        coords: [
          [106.55, 29.57],
          [121.47, 31.23]
        ]
      },
      {
        toName: "\u91cd\u5e86",
        fromName: "\u6b66\u6c49",
        coords: [
          [114.3, 30.6],
          [106.55, 29.57]
        ]
      },
      {
        toName: "\u5fb7\u9633",
        fromName: "\u6b66\u6c49",
        coords: [
          [114.3, 30.6],
          [104.38, 31.13]
        ]
      },
      {
        toName: "\u4e0a\u6d77",
        fromName: "\u6b66\u6c49",
        coords: [
          [114.3, 30.6],
          [121.47, 31.23]
        ]
      },
      {
        toName: "\u8087\u5e86",
        fromName: "\u4e0a\u6d77",
        coords: [
          [121.47, 31.23],
          [112.47, 23.05]
        ]
      },
      {
        toName: "\u8861\u9633",
        fromName: "\u4e0a\u6d77",
        coords: [
          [121.47, 31.23],
          [112.57, 26.9]
        ]
      },
      {
        toName: "\u6069\u65bd",
        fromName: "\u4e0a\u6d77",
        coords: [
          [121.47, 31.23],
          [109.47, 30.3]
        ]
      },
      {
        toName: "\u8302\u540d",
        fromName: "\u4e0a\u6d77",
        coords: [
          [121.47, 31.23],
          [110.92, 21.67]
        ]
      },
      {
        toName: "\u6b66\u6c49",
        fromName: "\u4e0a\u6d77",
        coords: [
          [121.47, 31.23],
          [114.3, 30.6]
        ]
      },
      {
        toName: "\u6d77\u53e3",
        fromName: "\u4e0a\u6d77",
        coords: [
          [121.47, 31.23],
          [110.32, 20.03]
        ]
      },
      {
        toName: "\u5e7f\u5dde",
        fromName: "\u4e0a\u6d77",
        coords: [
          [121.47, 31.23],
          [113.5107, 23.2196]
        ]
      },
      {
        toName: "\u8346\u95e8",
        fromName: "\u4e0a\u6d77",
        coords: [
          [121.47, 31.23],
          [112.2, 31.03]
        ]
      },
      {
        toName: "\u4e0a\u6d77",
        fromName: "\u5e7f\u5dde",
        coords: [
          [113.5107, 23.2196],
          [121.47, 31.23]
        ]
      },
      {
        toName: "\u6c88\u9633",
        fromName: "\u5e7f\u5dde",
        coords: [
          [113.5107, 23.2196],
          [123.43, 41.8]
        ]
      }
    ]
  }
  const option = {
    animation: false,

    backgroundColor: "rgba(17, 19, 42, 0.4)",
    title: {
      text: "Mars Technology Logistics and Transportation Map",
      left: "center",
      textStyle: {
        color: "#fff"
      }
    },
    legend: {
      show: false,
      orient: "vertical",
      top: "bottom",
      left: "right",
      data: ["location", "route"],
      textStyle: {
        color: "#fff"
      }
    },
    series: [
      {
        name: "location",
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        zlevel: 2,
        rippleEffect: {
          brushType: "stroke"
        },
        label: {
          emphasis: {
            show: true,
            position: "right",
            formatter: "{b}"
          }
        },
        symbolSize: 2,
        showEffectOn: "render",
        itemStyle: {
          normal: {
            color: "#46bee9"
          }
        },
        data: allData.citys
      },
      {
        name: "Line",
        type: "lines",
        coordinateSystem: "mars3dMap",
        zlevel: 2,
        large: true,
        effect: {
          show: true,
          constantSpeed: 30,
          symbol: "pin",
          symbolSize: 4,
          trailLength: 0
        },
        lineStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#58B3CC"
                },
                {
                  offset: 1,
                  color: "#F58158"
                }
              ],
              false
            ),
            width: 1.5,
            opacity: 0.4,
            curveness: 0.1
          }
        },
        data: allData.movelines
      }
    ]
  }
  return option
}