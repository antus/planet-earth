// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.56238, lng: 117.215326, alt: 32419, heading: 2, pitch: -49 }
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
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.Sector({
    positions: [
      [117.151322, 31.863556, 34.3]
      // [117.18186, 31.869359, 29.8],
      // [117.17505, 31.84342, 105.7],
    ],
    style: {
      radius: 5000,
      startAngle: 0, //Start angle (due east is 0, clockwise to 360 degrees)
      endAngle: 90,

      color: "#3388ff",
      opacity: 0.5,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      label: {
        text: "I am Mars Technology",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.Sector({
    position: [117.257699, 31.861722, 24.8],
    style: {
      radius: 4000,
      startAngle: 45, //Start angle (due east is 0, clockwise to 360 degrees)
      endAngle: 170,
      clampToGround: true,
      materialType: mars3d.MaterialType.Image,
      materialOptions: {
        image: "img/textures/poly-soil.jpg",
        color: Cesium.Color.WHITE.withAlpha(0.8) // Transparency processing
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.Sector({
    position: [117.152749, 31.77278, 24.1],
    style: {
      radius: 3000,
      startAngle: 90, //Start angle (due east is 0, clockwise to 360 degrees)
      endAngle: 20,
      materialType: mars3d.MaterialType.Water,
      materialOptions: {
        normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
        frequency: 80.0, // Number that controls the wave number.
        animationSpeed: 0.02, // Number that controls the animation speed of water.
        amplitude: 5.0, // Number that controls the amplitude of the water wave.
        specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
        baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
        blendColor: "#006ab4" // The rgba color object used when blending from water to non-water.
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.Sector({
    position: [117.272405, 31.798676, 21.2],
    style: {
      radius: 3000,
      startAngle: 0, //Start angle (due east is 0, clockwise to 360 degrees)
      endAngle: 60,

      diffHeight: 2000.0,
      color: Cesium.Color.YELLOW,
      opacity: 0.5,
      closeTop: false,
      closeBottom: false,

      label: { text: "It will be highlighted when the mouse is moved into it" },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        opacity: 0.9
      }
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.Sector({
    position: [117.237446, 31.753303, 23.1],
    style: {
      radius: 5000,
      startAngle: 0, //Start angle (due east is 0, clockwise to 360 degrees)
      endAngle: 60,

      fill: false,
      outline: true,
      noCenter: true,
      outlineStyle: {
        width: 3,
        color: "#ff0000",
        closure: false
      }
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.Sector({
    position: [117.172735, 31.660464, 17],
    style: {
      radius: 5000,
      startAngle: 90, //Start angle (due east is 0, clockwise to 360 degrees)
      endAngle: 20,
      materialType: "Circle3Wave",
      materialOptions: {
        color1: Cesium.Color.RED,
        color2: Cesium.Color.YELLOW,
        color3: Cesium.Color.BLUE,
        alpha: 0.4,
        speed: 10.0
      }
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
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

    const graphic = new mars3d.graphic.Sector({
      position,
      style: {
        radius: result.radius,
        startAngle: Math.random() * 100, // Starting angle (due east is 0, clockwise to 360 degrees)
        endAngle: Math.random() * 100 + 100,
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
    type: "sector",
    style: {
      color: "#29cf34",
      opacity: 0.5,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      label: {
        text: "I am Mars Technology",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    }
  })
}

// Start drawing and draw the three-dimensional surface
function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "sector",
    style: {
      color: "#00ff00",
      opacity: 0.5,
      diffHeight: 300
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
    },
    {
      text: "Calculate perimeter",
      icon: "fa fa-medium",
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("The perimeter of this object is:" + strDis)
      }
    },
    {
      text: "Calculate area",
      icon: "fa fa-reorder",
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("The area of ​​this object is:" + strArea)
      }
    }
  ])
}