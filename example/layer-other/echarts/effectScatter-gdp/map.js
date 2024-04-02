// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 13.474941, lng: 117.364073, alt: 2774097, heading: 6, pitch: -62 }
  }
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let echartsLayer
function createEchartsLayer(val) {
  const options = getEchartsOption()
  options.clampToGround = true // Calculate the ground height

  options.pointerEvents = val

  echartsLayer = new mars3d.layer.EchartsLayer(options)
  map.addLayer(echartsLayer)

  window.addEventListener("resize", function () {
    echartsLayer.resize()
  })
}

// Use echarts to interact
function chkPointerEvents(val) {
  echartsLayer.pointerEvents = val
}

/**
 *echart layer
 *
 * @return {option} echart chart data
 */
function getEchartsOption() {
  const data = [
    {
      name: "Shanghai",
      value: 19780
    },
    {
      name: "Zhuhai",
      value: 2186
    },
    {
      name: "Sanya",
      value: 1135
    },
    {
      name: "Huizhou",
      value: 1973
    },
    {
      name: "Haikou",
      value: 2568
    },
    {
      name: "Hefei",
      value: 4039
    },
    {
      name: "Nanjing",
      value: 6959
    },
    {
      name: "Hangzhou",
      value: 5632
    },
    {
      name: "Suzhou",
      value: 6707
    },
    {
      name: "Wuxi",
      value: 3393
    },
    {
      name: "Kunshan",
      value: 1894
    },
    {
      name: "Guangzhou",
      value: 15769
    },
    {
      name: "Shenzhen",
      value: 8259
    },
    {
      name: "Foshan",
      value: 5741
    },
    {
      name: "Dongguan",
      value: 3030
    },
    {
      name: "Fuzhou",
      value: 4542
    },
    {
      name: "Xiamen",
      value: 3329
    },
    {
      name: "Nanning",
      value: 3157
    },
    {
      name: "Zhengzhou",
      value: 6690
    },
    {
      name: "Wuhan",
      value: 8678
    },
    {
      name: "Changsha",
      value: 5303
    },
    {
      name: "Nanchang",
      value: 3025
    },
    {
      name: "Beijing",
      value: 20259
    },
    {
      name: "Changchun",
      value: 3016
    },
    {
      name: "Dalian",
      value: 3202
    },
    {
      name: "Shenyang",
      value: 4540
    },
    {
      name: "Harbin",
      value: 3141
    },
    {
      name: "Tianjin",
      value: 8626
    },
    {
      name: "Jinan",
      value: 4361
    },
    {
      name: "Qingdao",
      value: 6667
    },
    {
      name: "Taiyuan",
      value: 4080
    },
    {
      name: "Shijiazhuang",
      value: 6137
    },
    {
      name: "Xi'an",
      value: 6991
    },
    {
      name: "Chengdu",
      value: 13873
    },
    {
      name: "Chongqing",
      value: 13283
    },
    {
      name: "Kunming",
      value: 4633
    }
  ]

  const geoCoordMap = {
    Shanghai: [121.48, 31.22],
    Zhuhai: [113.52, 22.3],
    Sanya: [109.31, 18.14],
    Huizhou: [114.4, 23.09],
    Haikou: [110.35, 20.02],
    Hefei: [117.27, 31.86],
    Nanjing: [118.78, 32.04],
    Hangzhou: [120.19, 30.26],
    Suzhou: [120.62, 31.32],
    Wuxi: [120.29, 31.59],
    Kunshan: [120.95, 31.39],
    Guangzhou: [113.23, 23.16],
    Shenzhen: [114.07, 22.62],
    Foshan: [113.11, 23.05],
    Dongguan: [113.75, 23.04],
    Fuzhou: [119.3, 26.08],
    Xiamen: [118.1, 24.46],
    Nanning: [108.33, 22.84],
    Zhengzhou: [113.65, 34.76],
    Wuhan: [114.31, 30.52],
    Changsha: [113, 28.21],
    Nanchang: [115.89, 28.68],
    Beijing: [116.46, 39.92],
    Changchun: [125.35, 43.88],
    Dalian: [121.62, 38.92],
    Shenyang: [123.38, 41.8],
    Harbin: [126.63, 45.75],
    Tianjin: [117.2, 39.13],
    Jinan: [117, 36.65],
    Qingdao: [120.33, 36.07],
    Taiyuan: [112.53, 37.87],
    Shijiazhuang: [114.48, 38.03],
    Xi'an: [108.95, 34.27],
    Chengdu: [104.06, 30.67],
    Chongqing: [106.54, 29.59],
    Kunming: [102.73, 25.04]
  }

  // Display graph points in echart chart
  const convertData = function (data) {
    const res = []
    for (let i = 0; i < data.length; i++) {
      const geoCoord = geoCoordMap[data[i].name]
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value)
        })
      }
    }
    return res
  }

  // Sort the numbers in the chart from large to small downwards
  data.sort(function (a, b) {
    return a.value - b.value
  })

  const categoryData = []
  const barData = []
  let sum = 0
  const count = data.length

  for (let i = 0; i < count; i++) {
    categoryData.push(data[i].name)
    barData.push(data[i].value)
    sum += data[i].value
  }

  const option = {
    animation: false,
    backgroundColor: "rgba(17, 19, 42, 0.3)",
    title: [
      {
        text: "Scatter chart situation",
        subtext: "san dian tu taishi",
        left: "center",
        textStyle: {
          color: "#fff"
        },
        subtextStyle: {
          color: "yellow",
          fontWeight: "bold"
        }
      },
      {
        id: "statistic",
        text: count ? "Average: " + parseInt((sum / count).toFixed(4)) : "",
        right: 120,
        top: 40,
        width: 100,
        textStyle: {
          color: "#fff"
        },
        fontSize: 16
      }
    ],

    tooltip: {
      trigger: "item"
    },
    grid: {
      right: 40,
      top: 100,
      bottom: 40,
      width: "30%"
    },
    xAxis: {
      type: "value",
      scale: true,
      position: "top",
      boundaryGap: false,
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        margin: 2,
        color: "#aaa"
      }
    },
    yAxis: {
      type: "category",
      nameGap: 16,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#ddd"
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#ddd"
        }
      },
      axisLabel: {
        interval: 0,
        color: "#ddd"
      },
      data: categoryData
    },
    series: [
      {
        // Scatter plot
        type: "scatter",
        coordinateSystem: "mars3dMap",
        data: convertData(data),
        symbolSize: function (val) {
          const size = (val[2] / 500) * 1.5
          return Math.max(size, 8)
        },
        label: {
          formatter: "{b}",
          position: "right",
          show: false
        },
        itemStyle: {
          color: "#FF8C00",
          position: "right",
          show: true
        }
      },
      {
        //Special effects scatter plot
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        data: convertData(data),
        symbolSize: function (val) {
          const size = val[2] / 500
          return Math.max(size, 8)
        },
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke"
        },
        hoverAnimation: true,
        label: {
          formatter: "{b}",
          position: "right",
          color: "inherit",
          show: true
        },
        itemStyle: {
          color: "#f4e925",
          shadowBlur: 50,
          shadowColor: "#EE0000"
        },
        zlevel: 1
      },
      {
        id: "bar",
        zlevel: 2,
        type: "bar",
        symbol: "none",
        itemStyle: {
          color: "#ddb926"
        },
        data
      }
    ]
  }

  return option
}
