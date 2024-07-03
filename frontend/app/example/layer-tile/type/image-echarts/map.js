// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.797497, lng: 117.470076, alt: 404990.7, heading: 357.2, pitch: -73.5 }
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/radar-scores.json" })
    .then(function (arrPoints) {
      const dataLD = []
      for (let angle = 0; angle < arrPoints.length; angle++) {
        const item = arrPoints[angle]
        for (let radius = 0; radius < item.scores.length; radius++) {
          const val = item.scores[radius]
          dataLD.push([radius, item.angle, val])
        }
      }
      //Create layer
      createEchartsImageLayer(dataLD)
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

function createEchartsImageLayer(dataLD) {
  // Calculate the boundaries around the image
  const rectangle = mars3d.PolyUtil.getRectangle(
    mars3d.PolyUtil.getEllipseOuterPositions({
      position: [117.22413, 31.859107], // Radar center point coordinates
      radius: 100000 // Radar radius, unit: meters
    }),
    true
  )

  //Single image layer
  const imageLayer = new mars3d.layer.ImageLayer({
    crs: mars3d.CRS.EPSG3857,
    rectangle
  })
  map.addLayer(imageLayer)

  // Get the echart rendering object
  const echartsInstance = getEchartsInstance(dataLD)

  function updateImage() {
    const imageData = echartsInstance.getDataURL({ type: "png", pixelRatio: 1 })
    imageLayer.url = imageData //Update image, base64 image
  }

  let timeTik
  echartsInstance.on("rendered", function () {
    clearTimeout(timeTik) // Anti-shake processing
    timeTik = setTimeout(() => {
      updateImage()
    }, 1000)
  })
}

// Get the echart rendering object
function getEchartsInstance(dataLD) {
  function renderItem(params, api) {
    const values = [api.value(0), api.value(1)]
    const coord = api.coord(values)
    const size = api.size([1, 1], values)
    return {
      type: "sector",
      shape: {
        cx: params.coordSys.cx,
        cy: params.coordSys.cy,
        r0: coord[2] - size[0] / 2,
        r: coord[2] + size[0] / 2,
        startAngle: -(coord[3] + size[1] / 2),
        endAngle: -(coord[3] - size[1] / 2)
      },
      style: api.style({
        fill: api.visual("color")
      })
    }
  }

  const maxValue = echarts.util.reduce(
    dataLD,
    function (max, item) {
      return Math.max(max, item[2])
    },
    -Infinity
  )

  // Construct echarts option
  const option = {
    animation: false,
    polar: {},
    visualMap: {
      type: "continuous",
      min: 0,
      max: maxValue,
      top: "middle",
      dimension: 2,
      show: false
    },
    // Radial axis of polar coordinate system
    radiusAxis: {
      type: "category",
      z: 100,
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false }
    },
    //Angle axis of polar coordinate system
    angleAxis: {
      type: "category",
      boundaryGap: false,
      splitLine: { show: false },
      axisLine: { show: false }
    },
    series: [
      {
        type: "custom",
        coordinateSystem: "polar",
        itemStyle: {
          normal: {
            color: "#d14a61"
          }
        },
        renderItem,
        data: dataLD
      }
    ]
  }

  // echarts.init
  const container = mars3d.DomUtil.create("div", "mars3d-echarts mars3d-hideDiv", map.container)
  container.style.position = "absolute"
  container.style.top = "0px"
  container.style.left = "0px"
  container.style.width = "1024px"
  container.style.height = "1024px"

  const echartsInstance = echarts.init(container)
  echartsInstance.setOption(option)

  return echartsInstance
}
