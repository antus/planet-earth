// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: -0.357253, lng: 85.510429, alt: 18716757, heading: 0, pitch: -90 },
    sceneMode: 2 // 2d map display
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
  map.basemap = "Blue Basemap"

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
  const options = {
    animation: false,

    visualMap: { min: 0, max: 15, bottom: "5%", right: "5%", itemHeight: 30, show: true },
    series: [
      {
        type: "effectScatter",
        coordinateSystem: "mars3dMap",
        showEffectOn: "render",
        zlevel: 0,
        rippleEffect: { period: 15, scale: 4, brushType: "fill" },
        label: { normal: { show: true, formatter: "{b}", position: "top", offset: [5, 0], color: "#1DE9B6" }, emphasis: { show: true } },
        symbol: "circle",
        itemStyle: { normal: { show: true, shadowBlur: 10, shadowColor: "#333" } },
        data: [
          { key: "China", name: "China", latitudeAndLongitude: "110.094854,34.525002", counts: 15, value: [110.094854, 34.525002, 15] },
          { key: "Australia", name: "Australia", latitudeAndLongitude: "150.993137,-33.675509", counts: 6, value: [150.993137, -33.675509, 6] },
          { key: "Mongolia", name: "Mongolia", latitudeAndLongitude: "106.731711, 48.056936", counts: 3, value: [106.731711, 48.056936, 3] },
          { key: "Thailand", name: "Thailand", latitudeAndLongitude: "100.52901, 13.814341", counts: 3, value: [100.52901, 13.814341, 3] },
          { key: "South Korea", name: "South Korea", latitudeAndLongitude: "126.928257, 37.617069", counts: 3, value: [126.928257, 37.617069, 3] },
          { key: "Hungary", name: "Hungary", latitudeAndLongitude: "17.108519,48.179162", counts: 3, value: [17.108519, 48.179162, 3] },
          { key: "UAE", name: "UAE", latitudeAndLongitude: "55.269441,25.204514", counts: 3, value: [55.269441, 25.204514, 3] }
        ]
      },
      {
        type: "lines",
        coordinateSystem: "mars3dMap",
        zlevel: 0,
        effect: { show: true, period: 4, trailLength: 0.2, symbol: "arrow", symbolSize: 5 },
        lineStyle: { normal: { width: 1, opacity: 1, curveness: 0.3 } },
        data: [
          {
            coords: [
              [17.108519, 48.179162],
              [55.269441, 25.204514]
            ],
            value: 1
          },
          {
            coords: [
              [150.993137, -33.675509],
              [126.928257, 37.617069]
            ],
            value: 1
          },
          {
            coords: [
              [55.269441, 25.204514],
              [110.094854, 34.525002]
            ],
            value: 1
          },
          {
            coords: [
              [150.993137, -33.675509],
              [110.094854, 34.525002]
            ],
            value: 1
          },
          {
            coords: [
              [110.094854, 34.525002],
              [106.731711, 48.056936]
            ],
            value: 1
          },
          {
            coords: [
              [126.928257, 37.617069],
              [17.108519, 48.179162]
            ],
            value: 1
          },
          {
            coords: [
              [106.731711, 48.056936],
              [100.52901, 13.814341]
            ],
            value: 1
          },
          {
            coords: [
              [100.52901, 13.814341],
              [150.993137, -33.675509]
            ],
            value: 1
          }
        ]
      }
    ]
  }
  return options
}
