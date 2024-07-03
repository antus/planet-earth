// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 27.375302, lng: 115.43395, alt: 631709, heading: 26, pitch: -49 }
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
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  // Hefei City
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const lightCone = new mars3d.graphic.LightCone({
    position: Cesium.Cartesian3.fromDegrees(117.29, 32.0581, 117.8),
    style: {
      color: "rgba(255,0,0,0.9)",
      radius: 8000, // bottom radius
      height: 150000 // vertebral body height
    },
    show: true
  })
  graphicLayer.addGraphic(lightCone)

  // Demonstrate personalized processing graphic
  initGraphicManager(lightCone)
}
// You can also perform personalized management and binding operations on a single Graphic
function initGraphicManager(graphic) {
  // Bind Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">I am a Popup bound to the graphic </th>
            </tr>
            <tr>
              <td>Tips:</td>
              <td>This is just test information, you can use any html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  //Bind right-click menu
  graphic.bindContextMenu([
    {
      text: "Delete object [graphic-bound]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])
}

function addDemoGraphic2(graphicLayer) {
  const cities = [
    { name: "Lu'an City", lon: 116.3123, lat: 31.8329 },
    { name: "Anqing City", lon: 116.7517, lat: 30.5255 },
    { name: "Chuzhou City", lon: 118.1909, lat: 32.536 },
    { name: "Xuancheng City", lon: 118.8062, lat: 30.6244 },
    { name: "Fuyang City", lon: 115.7629, lat: 32.9919 },
    { name: "Suzhou City", lon: 117.5208, lat: 33.6841 },
    { name: "Huangshan City", lon: 118.0481, lat: 29.9542 },
    { name: "Chaohu City", lon: 117.7734, lat: 31.4978 },
    { name: "Bozhou City", lon: 116.1914, lat: 33.4698 },
    { name: "Chizhou City", lon: 117.3889, lat: 30.2014 },
    { name: "Bengbu City", lon: 117.4109, lat: 33.1073 },
    { name: "Wuhu City", lon: 118.3557, lat: 31.0858 },
    { name: "Huaibei City", lon: 116.6968, lat: 33.6896 },
    { name: "Huainan City", lon: 116.7847, lat: 32.7722 },
    { name: "Ma'anshan City", lon: 118.6304, lat: 31.5363 },
    { name: "Tongling City", lon: 117.9382, lat: 30.9375 }
  ]
  for (let i = 0; i < cities.length; i++) {
    const item = cities[i]

    const coneGlow2 = new mars3d.graphic.LightCone({
      position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0),
      style: {
        radius: 5000,
        height: 80000,
        distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(80000, 3010000),

        // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
        highlight: {
          type: mars3d.EventType.click,
          color: "#ffff00"
        }
      }
      // popup: item.name,
    })
    graphicLayer.addGraphic(coneGlow2)
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

    const graphic = new mars3d.graphic.LightCone({
      position,
      style: {
        radius: result.radius * 0.3,
        height: result.radius * 3
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
    type: "lightCone",
    style: {
      radius: 500,
      height: 8000
    }
  })
}

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

//Bind right-click menu
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "Start editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "Stop editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "Delete object",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // When the right click is the editing point
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}
