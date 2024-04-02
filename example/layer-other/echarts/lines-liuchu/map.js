// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 26.63086, lng: 113.052819, alt: 5934039, heading: 0, pitch: -80 }
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
  const geoCoordMap = {
    Anhui Province: [117.17, 31.52],
    Beijing: [116.24, 39.55],
    Chongqing: [106.54, 29.59],
    Fujian Province: [119.18, 26.05],
    Gansu Province: [103.51, 36.04],
    Guangdong Province: [113.14, 23.08],
    Guangxi Zhuang Autonomous Region: [108.19, 22.48],
    Guizhou Province: [106.42, 26.35],
    Hainan Province: [110.2, 20.02],
    Hebei Province: [114.3, 38.02],
    Henan Province: [113.4, 34.46],
    Heilongjiang Province: [128.36, 45.44],
    Hubei Province: [112.27, 30.15],
    Hunan Province: [112.59, 28.12],
    Jilin Province: [125.19, 43.54],
    Jiangsu Province: [118.46, 32.03],
    Jiangxi Province: [115.55, 28.4],
    Liaoning Province: [123.25, 41.48],
    Inner Mongolia: [108.41, 40.48],
    Ningxia Hui Autonomous Region: [106.16, 38.27],
    Qinghai Province: [101.48, 36.38],
    Shandong Province: [118.0, 36.4],
    Shanxi Province: [112.33, 37.54],
    Shaanxi Province: [108.57, 34.17],
    Shanghai: [121.29, 31.14],
    Hainan: [108.77, 19.1],
    Sichuan Province: [104.04, 30.4],
    Tianjin: [117.12, 39.02],
    Tibet Autonomous Region: [91.08, 29.39],
    Xinjiang Uygur Autonomous Region: [87.36, 43.45],
    Yunnan Province: [102.42, 25.04],
    Zhejiang Province: [120.1, 30.16],
    Macau: [115.07, 21.33],
    Taiwan Province: [121.21, 23.53]
  }

  const BJData = [
    [
      {
        name: "Beijing"
      },
      {
        name: "Shanghai City",
        value: 195
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Guangdong Province",
        value: 90
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Liaoning Province",
        value: 80
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Hubei Province",
        value: 70
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Inner Mongolia",
        value: 70
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Jiangsu Province",
        value: 60
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Xinjiang Uygur Autonomous Region",
        value: 70
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Sichuan Province",
        value: 40
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Yunnan Province",
        value: 130
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Heilongjiang Province",
        value: 130
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Gansu Province",
        value: 200
      }
    ],
    [
      {
        name: "Beijing"
      },
      {
        name: "Tibet Autonomous Region",
        value: 60
      }
    ]
  ]

  // let planePath =  "path://M917.965523 917.331585c0 22.469758-17.891486 40.699957-39.913035 40.699957-22.058388 0-39.913035-18.2302-39.913035-40.699957l-0.075725-0.490164-1.087774 0c-18.945491-157.665903-148.177807-280.296871-306.821991-285.4748-3.412726 0.151449-6.751774 0.562818-10.240225 0.562818-3.450589 0-6.789637-0.410346-10.202363-0.524956-158.606321 5.139044-287.839661 127.806851-306.784128 285.436938l-1.014096 0 0.075725 0.490164c0 22.469758-17.854647 40.699957-39.913035 40.699957s-39.915082-18.2302-39.915082-40.699957l-0.373507-3.789303c0-6.751774 2.026146-12.903891 4.91494-18.531052 21.082154-140.712789 111.075795-258.241552 235.432057-312.784796C288.420387 530.831904 239.989351 444.515003 239.989351 346.604042c0-157.591201 125.33352-285.361213 279.924387-285.361213 154.62873 0 279.960203 127.770012 279.960203 285.361213 0 97.873098-48.391127 184.15316-122.103966 235.545644 124.843356 54.732555 215.099986 172.863023 235.808634 314.211285 2.437515 5.290493 4.01443 10.992355 4.01443 17.181311L917.965523 917.331585zM719.822744 346.679767c0-112.576985-89.544409-203.808826-199.983707-203.808826-110.402459 0-199.944821 91.232864-199.944821 203.808826s89.542362 203.808826 199.944821 203.808826C630.278335 550.488593 719.822744 459.256752 719.822744 346.679767z";

  const convertData = function (data) {
    const res = []
    for (let i = 0; i < data.length; i++) {
      const dataItem = data[i]
      const fromCoord = geoCoordMap[dataItem[0].name]
      const toCoord = geoCoordMap[dataItem[1].name]
      if (fromCoord && toCoord) {
        res.push({
          fromName: dataItem[0].name,
          toName: dataItem[1].name,
          coords: [fromCoord, toCoord]
        })
      }
    }
    return res
  }

  const color = ["#a6c84c", "#ffa022", "#46bee9"]

  const mySeries = []
  ;[["", BJData]].forEach(function (item, i) {
    mySeries.push(
      {
        // Wire
        name: item[0],
        type: "lines",
        coordinateSystem: "mars3dMap",
        zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.7,
          color: "#fff",
          symbolSize: 3
        },
        lineStyle: {
          color: color[0],
          width: 0,
          curveness: 0.2
        },
        data: convertData(item[1])
      },
      {
        //Move point
        name: item[0],
        type: "lines",
        coordinateSystem: "mars3dMap",
        zlevel: 2,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.1,
          //            symbol: planePath,
          symbol: "arrow",
          symbolSize: 5
        },
        lineStyle: {
          color: color[1],
          width: 1,
          opacity: 0.4,
          curveness: 0.2
        },
        data: convertData(item[1])
      },
      {
        //Province dots
        name: item[0],
        // name: item[0] + ' Top10',
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        zlevel: 3,
        rippleEffect: {
          brushType: "stroke"
        },
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
          color: "inherit"
        },
        symbolSize: function (val) {
          return val[2] / 6
        },
        itemStyle: {
          color: function (params) {
            const tmp = params.data.value[2]
            if (tmp < 100) {
              return "green"
            } else if (tmp > 150) {
              return "red"
            } else {
              return "yellow"
            }
          }
        },
        data: item[1].map(function (dataItem) {
          return {
            name: dataItem[1].name,
            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
          }
        })
      }
    )
  })

  const option = {
    animation: false,
    // backgroundColor: '#404a59',
    backgroundColor: "rgba(116, 112, 124, 0.2)",
    title: {
      text: "Patient treatment flow chart in Beijing",
      subtext: "(Statistical results for January)",
      left: "center",
      textStyle: {
        color: "#fff"
      },
      subtextStyle: {
        color: "yellow",
        fontWeight: "bold"
      }
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        if (params.seriesIndex === 2 || params.seriesIndex === 5 || params.seriesIndex === 8) {
          return params.name + " " + params.seriesName + " " + params.data.value[2] + " persons"
        } else if (params.seriesIndex === 1 || params.seriesIndex === 4 || params.seriesIndex === 7) {
          return params.data.fromName + "→" + params.data.toName
        }
      }
    },

    series: mySeries
  }

  return option
}
