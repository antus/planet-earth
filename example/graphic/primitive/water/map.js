// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.81008, lng: 117.291538, alt: 5537, heading: 282, pitch: -38 }
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
  addDemoGraphic1()
  addDemoGraphic2()
  addDemoGraphic3()
  addDemoGraphic4()
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

function addDemoGraphic1() {
  const graphic = new mars3d.graphic.Water({
    positions: [
      [117.218662, 31.800226, 37.68],
      [117.227836, 31.800388, 32.98],
      [117.229831, 31.792927, 37.91],
      [117.222571, 31.791298, 37.04],
      [117.216327, 31.79375, 37.49]
    ],
    style: {
      height: 3, // water surface height
      normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
      frequency: 8000.0, // Number that controls the wave number.
      animationSpeed: 0.02, // Number that controls the animation speed of water.
      amplitude: 5.0, // Number that controls the amplitude of the water wave.
      specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
      baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
      blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
      opacity: 0.7, // transparency
      clampToGround: false, // Whether to stick to the ground
      label: {
        text: "I am Mars Technology",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      },
      textureCoordinates: {
        positions: [
          new Cesium.Cartesian2(0, 1),
          new Cesium.Cartesian2(0, 0),
          new Cesium.Cartesian2(0.5, 0),
          new Cesium.Cartesian2(1, 0),
          new Cesium.Cartesian2(1, 1)
        ]
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  initGraphicManager(graphic)
}
// You can also perform personalized management and binding operations on a single Graphic
function initGraphicManager(graphic) {
  // 3. Bind the listening event to the graphic
  // graphic.on(mars3d.EventType.click, function (event) {
  // console.log("Listening to graphic, clicked vector object", event)
  // })
  // Bind Tooltip
  // graphic.bindTooltip('I am the Tooltip bound to graphic') //.openTooltip()

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

function addDemoGraphic2() {
  const graphic = new mars3d.graphic.Water({
    positions: [
      [117.144368, 31.803005, 800],
      [117.165242, 31.800811, 400],
      [117.180132, 31.80352, 200],
      [117.185858, 31.812145, 50],

      [117.197283, 31.806191, 50],
      [117.190464, 31.796236, 200],
      [117.167184, 31.789867, 400],
      [117.147186, 31.791731, 800]
    ],
    style: {
      normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
      frequency: 8000.0, // Number that controls the wave number.
      animationSpeed: 0.02, // Number that controls the animation speed of water.
      amplitude: 5.0, // Number that controls the amplitude of the water wave.
      specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
      baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
      blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
      opacity: 0.7, // transparency

      offsetAttribute: Cesium.GeometryOffsetAttribute.ALL, // required
      offsetHeight: 0
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  // Demo: Smoothly move height
  let height = 0
  setInterval(() => {
    if (height > 10000 || graphic.isDestroy) {
      return
    }
    height += 1
    graphic.offsetHeight = height
  }, 10)
}

function addDemoGraphic3() {
  const graphic = new mars3d.graphic.Water({
    positions: [
      [117.216386, 31.815376, 35.16],
      [117.222533, 31.81729, 29.21],
      [117.22642, 31.814983, 28.43],
      [117.22681, 31.810739, 28.55],
      [117.212868, 31.811302, 34.4],
      [117.212538, 31.81424, 31.87],
      [117.214681, 31.81402, 32.97]
    ],
    style: {
      normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
      frequency: 8000.0, // Number that controls the wave number.
      animationSpeed: 0.02, // Number that controls the animation speed of water.
      amplitude: 5.0, // Number that controls the amplitude of the water wave.
      specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
      baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
      blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
      opacity: 0.6, // transparency
      clampToGround: true, // Whether to stick to the ground

      label: { text: "It will be highlighted when the mouse is moved into it" },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        opacity: 0.9
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic4() {
  const graphic = new mars3d.graphic.Water({
    positions: [
      [117.208302, 31.85757],
      [117.234234, 31.858263],
      [117.234261, 31.833317],
      [117.207414, 31.834541],
      [117.208302, 31.85757]
    ],
    style: {
      height: 100, // water surface height
      diffHeight: 700,
      normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
      frequency: 8000.0, // Number that controls the wave number.
      animationSpeed: 0.02, // Number that controls the animation speed of water.
      amplitude: 5.0, // Number that controls the amplitude of the water wave.
      specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
      baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
      blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
      opacity: 0.6 // transparency
    },
    attr: { remark: "Example 4" }
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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 72, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 144, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 216, result.radius)
    const pt5 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 288, result.radius)

    const graphic = new mars3d.graphic.Water({
      positions: [pt1, pt2, pt3, pt4, pt5],
      style: {
        normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
        frequency: 8000.0, // Number that controls the wave number.
        animationSpeed: 0.02, // Number that controls the animation speed of water.
        amplitude: 5.0, // Number that controls the amplitude of the water wave.
        specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
        baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
        blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
        opacity: 0.6 // transparency
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
    type: "water",
    style: {
      // height: 3, // water surface height
      normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
      frequency: 8000.0, // Number that controls the wave number.
      animationSpeed: 0.02, // Number that controls the animation speed of water.
      amplitude: 5.0, // Number that controls the amplitude of the water wave.
      specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
      baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
      blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
      opacity: 0.7 // transparency
    }
  })
}
// Start drawing
function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "water",
    style: {
      height: 100, // water surface height
      diffHeight: 700,
      normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
      frequency: 8000.0, // Number that controls the wave number.
      animationSpeed: 0.02, // Number that controls the animation speed of water.
      amplitude: 5.0, // Number that controls the amplitude of the water wave.
      specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
      baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
      blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
      opacity: 0.6 // transparency
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
