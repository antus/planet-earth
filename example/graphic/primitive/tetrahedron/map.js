// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.815928, lng: 117.21376, alt: 683, heading: 61, pitch: -24 }
  }
}

var graphicLayer

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = 2017 // switch to blue basemap

  //Add reference 3D model;
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei City Building",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    style: {
      color: {
        conditions: [["true", `color("rgba(42, 160, 224, 1)")`]]
      }
    },
    marsJzwStyle: true
  })
  map.addLayer(tiles3dLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })
  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  //Add some demo data
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const tetrahedronPrimitive = new mars3d.graphic.Tetrahedron({
    position: Cesium.Cartesian3.fromDegrees(117.222132, 31.822729, 250),
    style: {
      width: 25,
      height: 40,
      color: "rgba(255,0,0,0.7)",
      moveHeight: 50
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(tetrahedronPrimitive)
}

function addDemoGraphic2(graphicLayer) {
  const tetrahedronPrimitive = new mars3d.graphic.Tetrahedron({
    position: Cesium.Cartesian3.fromDegrees(117.227581, 31.821564, 250),
    style: {
      width: 20,
      height: 30,
      color: new Cesium.Color(0.8, 0.8, 0, 0.8),
      moveHeight: 40
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(tetrahedronPrimitive)
}

function addDemoGraphic3(graphicLayer) {
  const tetrahedronPrimitive = new mars3d.graphic.Tetrahedron({
    position: Cesium.Cartesian3.fromDegrees(117.223923, 31.81897, 250),
    style: {
      width: 20,
      height: 30,
      color: new Cesium.Color(0.8, 0.8, 0, 0.8),
      animation: true,
      moveHeight: 30,
      moveDuration: 1,
      rotationAngle: 1
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(tetrahedronPrimitive)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 1500)
  console.log("Generated test grid coordinates", result)

  const radius = result.radius * 0.3

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.Tetrahedron({
      position,
      style: {
        width: radius / 2,
        height: radius,
        moveHeight: radius,
        color: Cesium.Color.fromRandom({ alpha: 0.6 })
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
    type: "tetrahedron",
    style: {
      width: 25,
      height: 40,
      color: "#00ff00",
      moveHeight: 50
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
