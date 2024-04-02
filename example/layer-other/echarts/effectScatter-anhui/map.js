// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 28.348014, lng: 118.789746, alt: 840941, heading: 350, pitch: -66 }
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
  options.clampToGround = true // Calculate the ground height
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
  const data = [
    {
      name: "Lu'an City",
      value: 112,
      location: [116.3123, 31.8329]
    },
    {
      name: "Anqing City",
      value: 424,
      location: [116.7517, 30.5255]
    },
    {
      name: "Chuzhou City",
      value: 76,
      location: [118.1909, 32.536]
    },
    {
      name: "Xuancheng City",
      value: 45,
      location: [118.8062, 30.6244]
    },
    {
      name: "Fuyang City",
      value: 234,
      location: [115.7629, 32.9919]
    },
    {
      name: "Suzhou City",
      value: 110,
      location: [117.5208, 33.6841]
    },
    {
      name: "Huangshan City",
      value: 98,
      location: [118.0481, 29.9542]
    },
    {
      name: "Chaohu City",
      value: 71,
      location: [117.7734, 31.4978]
    },
    {
      name: "Bozhou City",
      value: 165,
      location: [116.1914, 33.4698]
    },
    {
      name: "Chizhou City",
      value: 12,
      location: [117.3889, 30.2014]
    },
    {
      name: "Hefei City",
      value: 232,
      location: [117.29, 32.0581]
    },
    {
      name: "Bengbu City",
      value: 123,
      location: [117.4109, 33.1073]
    },
    {
      name: "Wuhu City",
      value: 73,
      location: [118.3557, 31.0858]
    },
    {
      name: "Huaibei City",
      value: 16,
      location: [116.6968, 33.6896]
    },
    {
      name: "Huainan City",
      value: 75,
      location: [116.7847, 32.7722]
    },
    {
      name: "Ma'anshan City",
      value: 45,
      location: [118.6304, 31.5363]
    },
    {
      name: "Tongling City",
      value: 93,
      location: [117.9382, 30.9375]
    }
  ]

  //Offset latitude to avoid overlap
  if (data.length > 1) {
    data.sort(function (a, b) {
      return b.location[1] - a.location[1]
    })
    for (let i = 1; i < data.length; i++) {
      const thisItem = data[i].location

      let ispy = false
      for (let j = 0; j < i; j++) {
        const lastItem = data[j].location
        const offX = Math.abs(lastItem[0] - thisItem[0])
        const offY = Math.abs(lastItem[1] - thisItem[1])
        if (offX < 0.025 && offY < 0.005) {
          ispy = true
          break
        }
      }

      if (ispy) {
        thisItem[1] -= 0.006 // Offset latitude
      }
    }
  }

  let sum = 0
  const dataVals = []
  for (let i = 0; i < data.length; i++) {
    sum += data[i].value

    dataVals.push({
      name: data[i].name,
      value: data[i].location.concat(data[i].value)
    })
  }

  const option = {
    animation: false,
    backgroundColor: "rgba(0, 0, 0, 0.4)",

    tooltip: {
      trigger: "item"
    },
    series: [
      {
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        data: dataVals,
        symbolSize: function (val) {
          if (sum === 0) {
            return 8
          }

          const num = (val[2] / sum) * 150
          return Math.max(num, 8)
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
          fontSize: "18",
          show: true
        },
        tooltip: {
          formatter: function (params, ticket, callback) {
            if (params.value[2] <= 0) {
              return params.name
            } else {
              return params.name + " ： " + params.value[2]
            }
          }
        },
        itemStyle: {
          color: "#ffff00",
          shadowBlur: 60,
          shadowColor: "#cccccc"
        },
        zlevel: 1
      }
    ]
  }
  return option
}
