// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lng: 117.084439, lat: 31.653047, alt: 354, heading: 319, pitch: -23 }
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

  //Load the petrochemical plant model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Petrochemical Plant",
    url: "http://data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    maximumScreenSpaceError: 1,
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  //Create div data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add vector data
  addRandomGraphicByCount([117.077462, 31.657745, 60], { value: 0.53, color: "#fb980b" })
  addRandomGraphicByCount([117.079091, 31.65898, 90], { value: 0.45, color: "#00ff00" })
  addRandomGraphicByCount([117.079766, 31.658268, 70], { value: 0.35, color: "#00ffff" })
  addRandomGraphicByCount([117.07913, 31.655748, 80], { value: 0.21, color: "#ff0000" })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addRandomGraphicByCount(position, attr) {
  const graphic = new mars3d.graphic.DivGraphic({
    position,
    style: {
      html: `<div style="width: 80px;height:80px;"></div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr
  })
  graphic.on(mars3d.EventType.add, function (e) {
    const dom = e.target.container.firstChild
    const attr = e.target.attr

    const liquidfillchartChart = echarts.init(dom)

    // Reference API: https://github.com/ecomfe/echarts-liquidfill
    // Reference example: https://www.makeapie.com/explore.html#tags=liquidFill~sort=rank~timeframe=all~author=all
    const option = {
      series: [
        {
          type: "liquidFill",
          radius: "100%",
          outline: { show: false },
          color: [attr.color],
          data: [attr.value],
          label: {
            color: "#294D99",
            insideColor: "#fff",
            fontSize: 20
          }
        }
      ]
    }
    liquidfillchartChart.setOption(option)
  })
  graphicLayer.addGraphic(graphic)
}
