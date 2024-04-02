// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 26.197302, lng: 112.783136, alt: 5933911, heading: 0, pitch: -80 }
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
  const items = [
    {
      level: 1,
      name: "Beijing",
      label: "beijing",
      value: [116.407395, 39.904211],
      symbol: "",
      symbolSize: [30, 30]
    },
    {
      level: 1,
      symbol: "",
      name: "Shenyang",
      label: "langfang",
      category: 0,
      active: true,
      speed: 6,
      value: [122.904763, 41.689105],
      belong: "Beijing"
    },
    {
      level: 1,
      symbol: "",
      name: "Xining",
      category: 0,
      active: true,
      speed: 6,
      value: [101.4038, 36.8207],
      belong: "Beijing"
    },
    {
      level: 1,
      symbol: "",
      name: "Lanzhou",
      category: 0,
      active: true,
      speed: 6,
      value: [103.5901, 36.3043],
      belong: "Beijing"
    },
    {
      level: 1,
      symbol: "",
      name: "Hangzhou",
      category: 0,
      active: true,
      speed: 6,
      value: [119.5313, 29.8773],
      belong: "Beijing"
    },
    {
      level: 1,
      symbol: "",
      name: "Sichuan",
      category: 0,
      active: true,
      speed: 6,
      value: [103.9526, 30.7617],
      belong: "Beijing"
    },
    {
      level: 2,
      symbol: "",
      name: "Chongqing",
      category: 0,
      active: true,
      speed: 6,
      value: [107.7539, 30.1904],
      belong: "Sichuan"
    },
    {
      level: 1,
      symbol: "",
      name: "Urumqi",
      category: 0,
      active: true,
      speed: 6,
      value: [85.865421, 43.452051],
      belong: "Beijing"
    },
    {
      level: 1,
      symbol: "",
      name: "Kashi",
      category: 0,
      active: true,
      speed: 6,
      value: [84.693786, 36.353336],
      belong: "Beijing"
    },
    {
      level: 1,
      symbol: "",
      name: "Wenzhou",
      category: 0,
      active: true,
      speed: 6,
      value: [120.647069, 28.01946],
      belong: "Hangzhou"
    },
    {
      level: 2,
      symbol: "",
      name: "Zhoushan",
      category: 0,
      active: true,
      speed: 6,
      value: [122.2559, 30.2234],
      belong: "Hangzhou"
    }
  ]

  const lineColor = ["#fff", "#f6fb05", "#00fcff"]

  //City point icon
  const symbolList = ["image://img/icon/symbol1.png", "image://img/icon/symbol2.png"]

  // Dynamic motion point icon online
  const pointSymbol = ["image://img/icon/linePoint1.png", "image://img/icon/linePoint2.png"]

  //Add icon to location with level = 1
  items.forEach((el) => {
    el.symbol = symbolList[el.level - 1]
  })

  const dataArr = [[], [], []]
  items.forEach((el) => {
    if (el.belong) {
      items.forEach((element) => {
        if (el.belong === element.name) {
          dataArr[el.level - 1].push([
            {
              coord: element.value
            },
            {
              coord: el.value
            }
          ])
        }
      })
    }
  })

  const seriesOne = [
    {
      type: "effectScatter",
      layout: "none",
      // coordinateSystem: "cartesian2d",
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
          fontSize: 24,
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
      data: items
    }
  ]
  const lineSeries = []
  dataArr.forEach((el, index) => {
    lineSeries.push({
      name: "",
      type: "lines",
      // coordinateSystem: "cartesian2d",
      coordinateSystem: "mars3dMap",
      zlevel: 1,
      effect: {
        show: true,
        smooth: false,
        trailLength: 0,
        symbol: pointSymbol[index],
        symbolSize: [10, 30],
        period: 4
      },

      lineStyle: {
        width: 2,
        color: lineColor[index],
        curveness: -0.2
      },
      data: el
    })
  })

  const seriesData = seriesOne.concat(lineSeries)

  const option = {
    animation: false,
    // backgroundColor: '#000',

    series: seriesData
  }
  return option
}
