// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 23.729961, lng: 116.284734, alt: 1868672, heading: 355, pitch: -65 },
    cameraController: {
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    }
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

  //Add a model
  const graphic = new mars3d.graphic.ModelPrimitive({
    name: "Ground station model",
    position: [117.170264, 31.840312, 258],
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 1,
      minimumPixelSize: 40,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic)

  addDemoGraphic1()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Initialize to create a four-sided pyramid
function addDemoGraphic1() {
  //Test the connection line
  const testLine = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const localEnd = rectSensor?.rayPosition
      if (!localEnd) {
        return []
      }
      return [rectSensor.position, localEnd]
    }, false),
    style: {
      arcType: Cesium.ArcType.NONE,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: "#ff0000"
      },
      width: 1
    }
  })
  graphicLayer.addGraphic(testLine)

  const rectSensor = new mars3d.graphic.RectSensor({
    position: [117.170264, 31.840312, 363],
    style: {
      angle1: 30,
      angle2: 30,
      length: 700000,
      // length: new Cesium.CallbackProperty(function (time) {
      //length += 100 //Test dynamic length
      //   return length
      // }, false),
      heading: 0,
      pitch: 40,
      roll: 0,
      color: "rgba(0,255,0,0.4)",
      outline: true,
      topShow: true,
      topSteps: 2,
      flat: true
    }
  })
  graphicLayer.addGraphic(rectSensor)

  rectSensor.on(mars3d.EventType.remove, function () {
    graphicLayer.removeGraphic(testLine)
  })
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

    const graphic = new mars3d.graphic.RectSensor({
      position,
      style: {
        angle1: 30,
        angle2: 30,
        length: result.radius * 2,
        pitch: 40,
        color: "rgba(0,255,255,0.4)"
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing phased array radar
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "rectSensor",
    style: {
      angle1: 30,
      angle2: 30,
      length: 5000,
      pitch: 40,
      color: "rgba(0,255,0,0.4)",
      outline: true,
      topShow: true,
      topSteps: 2
    }
  })
}

// gaze target
function changeLookAt() {
  const cone = graphicLayer.graphics[0]
  if (cone.lookAt) {
    cone.lookAt = null
  } else {
    map.graphicLayer.startDraw({
      type: "point",
      style: {
        pixelSize: 12,
        color: "#ffff00"
      },
      success: function (graphic) {
        const position = graphic.positionShow
        map.graphicLayer.clear()

        cone.lookAt = position
      }
    })
  }
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