// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.808137, lng: 116.411699, alt: 23221, heading: 347, pitch: -40 },
    clock: {
      currentTime: "2021-07-01 10:45:00"
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

  graphicLayer.remove()
  graphicLayer = null
}

// static position
function addDemoGraphic1(graphicLayer) {
  const coneTrack = new mars3d.graphic.ConeTrackPrimitive({
    position: [116.327881, 31.018378, 5000],
    targetPosition: [116.365017, 30.996012, 898.6], // optional
    style: {
      slices: 4, // four cones
      // length: 4000, // no need to pass when targetPosition exists
      angle: 5, // half-court angle
      color: "#ff0000",
      opacity: 0.3,

      label: { text: "It will be highlighted when the mouse is moved into it" },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(coneTrack)
}

// static position
let coneTrack
function addDemoGraphic2(graphicLayer) {
  const position = [116.28782, 30.971557, 5000]
  //Add an airplane
  const graphic = new mars3d.graphic.ModelPrimitive({
    position,
    style: {
      url: "//data.mars3d.cn/gltf/mars/feiji.glb",
      scale: 1,
      minimumPixelSize: 50
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)

  //Cone tracking body
  coneTrack = new mars3d.graphic.ConeTrackPrimitive({
    position,
    // targetPosition: [116.317411, 30.972581, 1439.7], //optional
    style: {
      length: 4000,
      angle: 5, // half-court angle
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#02ff00"
      }
    }
  })
  graphicLayer.addGraphic(coneTrack)
}

//Modify the target point tracked by the aircraft
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

      coneTrack.targetPosition = position
    }
  })
}

// dynamic position
function addDemoGraphic3(graphicLayer) {
  const propertyFJ = getSampledPositionProperty([
    [116.364307, 31.03778, 5000],
    [116.42794, 31.064786, 5000],
    [116.474002, 31.003825, 5000],
    [116.432393, 30.951142, 5000],
    [116.368497, 30.969006, 5000],
    [116.364307, 31.03778, 5000]
  ])

  // airplane
  const graphicModel = new mars3d.graphic.ModelEntity({
    position: propertyFJ,
    orientation: new Cesium.VelocityOrientationProperty(propertyFJ),
    style: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.3,
      minimumPixelSize: 30
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphicModel)

  // car
  const propertyQC = getSampledPositionProperty([
    [116.391268, 30.956038, 827.2],
    [116.37934, 30.980835, 898.1],
    [116.382514, 30.999031, 921.5],
    [116.40338, 31.009258, 1214],
    [116.412254, 31.021635, 1224.1],
    [116.432328, 31.045508, 804.3]
  ])
  const graphicQC = new mars3d.graphic.PathEntity({
    position: propertyQC,
    orientation: new Cesium.VelocityOrientationProperty(propertyQC),
    style: {
      width: 1,
      color: "#ffff00",
      opacity: 0.4,
      leadTime: 0
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.5,
      minimumPixelSize: 50
    }
  })
  graphicLayer.addGraphic(graphicQC)

  // Cone tracking body (dynamic position=>dynamic targetPosition)
  const coneTrack = new mars3d.graphic.ConeTrackPrimitive({
    position: propertyFJ,
    // targetPosition: [116.417326, 31.046258, 841.2],
    targetPosition: propertyQC,
    style: {
      //length: 4000, //No need to pass when targetPosition exists
      angle: 5, // half-court angle
      // Custom diffuse ripple texture
      materialType: mars3d.MaterialType.CylinderWave,
      materialOptions: {
        color: "#ffff00",
        repeat: 30.0
      },
      faceForward: false, // When the normal direction of the drawn triangular patch cannot face the viewpoint, the normal direction will be automatically flipped to avoid problems such as blackening after normal calculation.
      closed: true, // Whether it is a closed body, what is actually performed is whether to perform back cropping
      renderState: Cesium.RenderState.fromCache({
        blending: Cesium.BlendingState.ALPHA_BLEND,
        depthTest: {
          enabled: false,
          func: Cesium.DepthFunction.LESS
        },
        cull: {
          enabled: true,
          face: Cesium.CullFace.BACK
        },
        depthMask: false
      })
    }
  })
  graphicLayer.addGraphic(coneTrack)
}

// Calculate the SampledPositionProperty trajectory of the demonstration
function getSampledPositionProperty(points) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const start = map.clock.currentTime
  const positions = mars3d.LngLatArray.toCartesians(points)
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, i * 20, new Cesium.JulianDate())
    const position = positions[i]
    property.addSample(time, position)
  }
  return property
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

    const graphic = new mars3d.graphic.ConeTrackPrimitive({
      position,
      style: {
        length: result.radius * 2,
        topRadius: 0.0,
        bottomRadius: result.radius,
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
