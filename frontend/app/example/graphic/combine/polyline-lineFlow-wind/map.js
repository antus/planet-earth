// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 29.851048, lng: 117.477098, alt: 1294279, heading: 358, pitch: -87 }
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

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.

  //Load weather
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/windpoint.json" })
    .then(function (res) {
      showWindLine(res.data)
    })
    .catch(function () {
      globalMsg("Real-time query of weather information failed, please try again later")
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// flow field lines
function showWindLine(arr) {
  const arrData = []
  const radius = 12000

  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, 0)
    const angle = 180 - item.dir

    let pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, angle, radius)
    pt1 = mars3d.PointUtil.setPositionsHeight(pt1, 0)

    arrData.push({
      positions: [position, pt1],
      style: {
        width: 8,
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          image: "img/textures/line-arrow-right.png",
          color: "#00ff00",
          speed: 30
        }
      },
      attr: item
    })
  }

  // Combined rendering of multiple line objects.
  const graphic = new mars3d.graphic.PolylineCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(graphic)
}

// Rendering according to a single line is less efficient
/* function showWindLine(arr) {
  //Create vector data layer
  let graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  let lineMaterial = mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
    image: "img/textures/line-arrow-right.png",
    color: "#00ff00",
    speed: 30
  })

  let radius = 12000
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    let position = Cesium.Cartesian3.fromDegrees(item.x, item.y, 0)
    let angle = 180 - item.dir

    let pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, angle, radius)
    pt1 = mars3d.PointUtil.setPositionsHeight(pt1, 0)

    let graphic = new mars3d.graphic.PolylinePrimitive({
      positions: [position, pt1],
      style: {
        width: 8,
        material: lineMaterial // animation line material
      }
    })
    graphic.bindPopup(`${angle}`)
    graphicLayer.addGraphic(graphic)
  }
} */

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["source"] = "I am the Popup bound to the layer"
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr })
  })
}
