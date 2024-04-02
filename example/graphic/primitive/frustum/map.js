// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
let graphicFrustum

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.841529, lng: 116.389494, alt: 28201.5, heading: 357, pitch: -58.6 }
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
  map.hasTerrain = false

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
  const position = [116.359147, 30.990366, 6000]

  //Add an airplane
  const graphicFJ = new mars3d.graphic.ModelPrimitive({
    position,
    style: {
      url: "//data.mars3d.cn/gltf/mars/feiji.glb",
      scale: 1,
      minimumPixelSize: 50,
      heading: 0
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphicFJ)

  // Four cone tracking body
  graphicFrustum = new mars3d.graphic.FrustumPrimitive({
    position,
    targetPosition: [116.317411, 30.972581, 1439.7], // optional
    style: {
      angle: 10,
      angle2: 10,
      // length: 4000, // No need to pass when targetPosition exists
      color: "#02ff00",
      opacity: 0.4,
      outline: true,
      outlineColor: "#ffffff",
      outlineOpacity: 1.0
    }
  })
  graphicLayer.addGraphic(graphicFrustum)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.FrustumPrimitive({
    position: [116.25813, 30.983059, 5000],
    style: {
      angle: 7,
      length: 4000,
      heading: 270,
      pitch: -90, // eye level
      color: "#FF0000",
      opacity: 0.4,
      outline: true,
      outlineColor: "#ffffff",
      outlineOpacity: 1.0,

      label: { text: "Mouseover will highlight", pixelOffsetY: -30 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  //Add a satellite
  const graphicFJ = new mars3d.graphic.ModelPrimitive({
    position: [116.303349, 31.070789, 7000],
    style: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 50,
      heading: 70
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphicFJ)

  const graphic = new mars3d.graphic.FrustumPrimitive({
    position: [116.303349, 31.070789, 7000],
    style: {
      angle: 10,
      angle2: 0.01,
      length: 7000,
      heading: 70,
      pitch: -180, // top view
      color: "#00ffff",
      opacity: 0.7
    }
  })
  graphicLayer.addGraphic(graphic)
}

// Track target point
function onClickSelPoint() {
  map.graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 8,
      color: "#ffff00"
    },
    success: function (graphic) {
      const position = graphic.positionShow
      map.graphicLayer.clear()

      graphicFrustum.targetPosition = position
    }
  })
}

function clear() {
  map.graphicLayer.clear()
}

function getRayEarthPositions() {
  map.graphicLayer.clear()

  if (graphicFrustum.isDestroy) {
    return
  }

  // 4 vertex coordinates of the ground
  const positions = graphicFrustum.getRayEarthPositions()

  //Add ground rectangle
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions,
    style: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.3),
      // image: "img/tietu/gugong.jpg",
      // stRotationDegree: fixedRoute.model.heading,
      zIndex: graphicLayer.length
    }
  })
  map.graphicLayer.addGraphic(graphic)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 1000)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.FrustumPrimitive({
      position,
      style: {
        angle: 10,
        angle2: 5,
        length: result.radius * 2,
        heading: Math.random() * 100,
        pitch: -180, // top view

        color: Cesium.Color.fromRandom({ alpha: 0.6 })
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
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

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "frustum",
    style: {
      angle: 10,
      angle2: 5,
      length: 1000,

      color: "#00ffff",
      opacity: 0.7
    }
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
