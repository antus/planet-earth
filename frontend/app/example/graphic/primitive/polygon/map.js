// import * as mars3d from "mars3d"


var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.61982, lng: 117.230607, alt: 22746, heading: 2, pitch: -49 }
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
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
  addDemoGraphic11(graphicLayer)
  addDemoGraphic12(graphicLayer)
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
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.218662, 31.800226, 37.68],
      [117.227836, 31.800388, 32.98],
      [117.229831, 31.792927, 37.91],
      [117.222571, 31.791298, 37.04],
      [117.216327, 31.79375, 37.49]
    ],
    style: {
      color: "#00ffff",
      opacity: 0.4,
      // clampToGround: true,
      // classificationType: Cesium.ClassificationType.BOTH,

      label: { text: "It will be highlighted when the mouse is moved into it" },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        // type: mars3d.EventType.click,
        opacity: 0.8
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

//Image material
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.187572, 31.823074, 45.53],
      [117.195377, 31.82418, 43.36],
      [117.204541, 31.818933, 37.06],
      [117.19775, 31.809539, 36.59],
      [117.183832, 31.814237, 38.76]
    ],
    style: {
      image: "img/textures/poly-soil.jpg",
      // image: "img/tietu/gugong.jpg",
      vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
      textureCoordinates: {
        positions: [new Cesium.Cartesian2(0, 1), new Cesium.Cartesian2(0, 0), new Cesium.Cartesian2(0.5, 0), new Cesium.Cartesian2(0.5, 1)] // Rectangular tiling
      },
      clampToGround: true,

      label: {
        text: "I am Mars Technology",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
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
      materialType: mars3d.MaterialType.Water,
      materialOptions: {
        normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
        frequency: 1000.0, // Number that controls the wave number.
        animationSpeed: 0.01, // Number that controls the animation speed of water.
        amplitude: 10, // Number that controls the amplitude of the water wave.
        specularIntensity: 0.5, // Number that controls the intensity of specular reflection.
        baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
        blendColor: "#006ab4" // The rgba color object used when blending from water to non-water.
      }
    },
    attr: { remark: "Example 3" }
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

// Surface shape: grass surface effect
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.319966, 31.842082, 12.29],
      [117.330034, 31.835286, 11.07],
      [117.330576, 31.823452, 11.01],
      [117.311457, 31.821023, 17.11],
      [117.308954, 31.828975, 16.29]
    ],
    style: {
      materialType: mars3d.MaterialType.PolyGrass,
      materialOptions: {
        evenColor: new Cesium.Color(0.25, 0.4, 0.1, 1.0),
        oddColor: new Cesium.Color(0.1, 0.1, 0.1, 1.0),
        frequency: 1.5 // mottled
      }
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

// Surface shape: wood surface effect
function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.271662, 31.870639, 21.49],
      [117.290605, 31.871517, 19.47],
      [117.302056, 31.858145, 16.27],
      [117.299439, 31.847545, 14.77],
      [117.267705, 31.8491, 22.11]
    ],
    style: {
      materialType: mars3d.MaterialType.PolyWood,
      materialOptions: {
        evenColor: new Cesium.Color(0.6, 0.3, 0.1, 1.0),
        oddColor: new Cesium.Color(0.4, 0.2, 0.07, 1.0),
        frequency: 10.0, // ring frequency
        noiseScale: new Cesium.Cartesian2(0.7, 0.5),
        grainFrequency: 27.0 // ripple frequency
      }
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

// Surface shape: blending effect
function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.154815, 31.853495],
      [117.181255, 31.854257],
      [117.182284, 31.848255],
      [117.184748, 31.840141],
      [117.180557, 31.835556],
      [117.180023, 31.833741],
      [117.166846, 31.833737],
      [117.155531, 31.833151],
      [117.154787, 31.835978],
      [117.151994, 31.839036],
      [117.150691, 31.8416],
      [117.151215, 31.844734],
      [117.154815, 31.853495]
    ],
    style: {
      materialType: mars3d.MaterialType.PolyBlob,
      materialOptions: {
        evenColor: new Cesium.Color(1.0, 1.0, 1.0, 0.5),
        oddColor: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
        frequency: 30.0 // times
      }
    },
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

// Surface shape: asphalt road effect
function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.208302, 31.85757],
      [117.234234, 31.858263],
      [117.234261, 31.833317],
      [117.207414, 31.834541],
      [117.208302, 31.85757]
    ],
    style: {
      materialType: mars3d.MaterialType.PolyAsphalt,
      materialOptions: {
        color: new Cesium.Color(0.15, 0.15, 0.15, 1.0),
        size: 0.005, // Bump size
        frequency: 0.2 // rough
      }
    },
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

// Surface shape: Gravel surface effect
function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.275127, 31.839641, 25.1],
      [117.291876, 31.83181, 23.6],
      [117.289005, 31.82154, 20.1],
      [117.281431, 31.816607, 23.2],
      [117.268173, 31.826157, 34.8],
      [117.268478, 31.82567, 34.2]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.PolyFacet,
      materialOptions: {
        evenColor: new Cesium.Color(0.25, 0.25, 0.25, 0.75),
        oddColor: new Cesium.Color(0.75, 0.75, 0.75, 0.75),
        frequency: 50.0 // times
      }
    },
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic9(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.261476, 31.799865, 20.8],
      [117.270864, 31.804957, 26],
      [117.289609, 31.804853, 25.4],
      [117.290861, 31.79569, 25.2],
      [117.268148, 31.788912, 18.5]
    ],
    style: {
      height: 50,
      diffHeight: 300,
      materialType: mars3d.MaterialType.PolyGradient,
      materialOptions: {
        color: "#3388cc",
        alphaPower: 1.5
      },
      vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
      textureCoordinates: {
        positions: [
          new Cesium.Cartesian2(0, 1),
          new Cesium.Cartesian2(0, 0),
          new Cesium.Cartesian2(0.5, 0),
          new Cesium.Cartesian2(1, 0),
          new Cesium.Cartesian2(1, 1)
        ]
      },
      label: {
        text: "Mars3D Platform",
        font_family: "楷体",
        color: "#ffff00",
        font_size: 18,
        setHeight: 400
      }
    },
    attr: { remark: "Example 9" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic10(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      // outer ring
      [
        [117.24679, 31.835806, 35.8],
        [117.258539, 31.832093, 36],
        [117.254762, 31.8219, 33.3],
        [117.24656, 31.8196, 24.8],
        [117.240134, 31.827664, 27.4]
      ],
      // inner loop
      [
        [117.247433, 31.829648, 33.4],
        [117.253809, 31.828713, 33],
        [117.252086, 31.824081, 32.6],
        [117.247597, 31.825922, 31.6]
      ]
    ],
    style: {
      color: "#ffff00",
      opacity: 0.6
    },
    attr: { remark: "Example 10" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic11(graphicLayer) {
  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.232633, 31.816532, 31.2],
      [117.247045, 31.816953, 25.8],
      [117.246916, 31.815743, 23.5],
      [117.243156, 31.811025, 25.7],
      [117.232491, 31.811307, 27.3]
    ],
    style: {
      materialType: mars3d.MaterialType.WaterLight,
      materialOptions: {
        specularMap: "img/textures/poly-stone.jpg",
        alpha: 0.6
      },
      clampToGround: true
    },
    attr: { remark: "Example 11" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic12(graphicLayer) {
  // const extent = { xmin: 73.0, xmax: 136.0, ymin: 3.0, ymax: 59.0 } //China area
  const extent = { xmin: 117.153681, xmax: 117.243941, ymin: 31.668831, ymax: 31.731177 } // Hefei South

  // Calculate the edges of the circle
  const circleOuterPositions = mars3d.PolyUtil.getEllipseOuterPositions({
    position: [117.198898, 31.702784, 8],
    radius: 1000
  })

  const graphic = new mars3d.graphic.PolygonPrimitive({
    positions: [
      // outer ring
      [
        [extent.xmin, extent.ymax],
        [extent.xmin, extent.ymin],
        [extent.xmax, extent.ymin],
        [extent.xmax, extent.ymax],
        [extent.xmin, extent.ymax]
      ],
      // inner loop
      mars3d.LngLatArray.toArray(circleOuterPositions)
    ],
    style: {
      fill: true,
      color: "rgb(2,26,79)",
      opacity: 0.9,
      outline: true,
      outlineColor: "#39E09B",
      outlineWidth: 4,
      outlineOpacity: 0.8,
      arcType: Cesium.ArcType.GEODESIC,
      clampToGround: true
    },
    attr: { remark: "Example 12" }
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

    const graphic = new mars3d.graphic.PolygonPrimitive({
      positions: [pt1, pt2, pt3, pt4, pt5],
      style: {
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
    type: "polygonP",
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
// Start drawing
function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "polygonP",
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