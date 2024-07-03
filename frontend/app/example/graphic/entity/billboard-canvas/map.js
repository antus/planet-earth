// import * as mars3d from "mars3d"
// import { CanvasBillboard } from "CanvasBillboard.js"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var mapOptions = {
  scene: {
    center: { lat: 31.81226, lng: 117.096703, alt: 231, heading: 329, pitch: -28 }
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

  //Load the oilfield joint station model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    pid: 2020,
    type: "3dtiles",
    name: "Oilfield Union Station",
    url: "//data.mars3d.cn/3dtiles/max-ytlhz/tileset.json",
    position: { lng: 117.094224, lat: 31.815859, alt: 26.4 },
    rotation: { z: 116.2 },
    maximumScreenSpaceError: 1,
    center: { lat: 32.407076, lng: 117.459703, alt: 3361, heading: 358, pitch: -51 }
  })
  map.addLayer(tiles3dLayer)

  //Create DIV data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Randomly update text
  setInterval(() => {
    graphicLayer.eachGraphic((graphic) => {
      graphic.text = random(0, 100) // update text
    })
  }, 2000)

  addDemoGraphic1(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

function addDemoGraphic1(graphicLayer) {
  const arrData = [
    { name: "Oil Tank One", position: [117.09521, 31.814404, 47.3] },
    { name: "Oil Tank Two", position: [117.095206, 31.814878, 47.3] },
    { name: "Oil Tank Three", position: [117.094653, 31.814428, 47.3] },
    { name: "Generator", position: [117.093428, 31.816959, 31.8] },
    { name: "Command Room", position: [117.093953, 31.814397, 36] },
    { name: "Heating tank", position: [117.09385, 31.815837, 36.9] },
    { name: "Cooling Room", position: [117.094662, 31.816403, 32.9] }
  ]
  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const graphic = new mars3d.graphic.CanvasBillboard({
      position: item.position,
      style: {
        text: 18,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(800, 0.4, 1200, 0.2),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000)
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.CanvasBillboard({
      position,
      style: {
        text: 18,
        scale: 0.4,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 900000)
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "canvasBillboard",
    style: {
      text: 18,
      scale: 0.4,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 900000)
    }
  })
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getGraphic(graphicId) {
  return graphicLayer.getGraphicById(graphicId)
}
