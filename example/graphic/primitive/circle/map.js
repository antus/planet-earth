// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.643597, lng: 116.261903, alt: 38826, heading: 15, pitch: -52 }
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
  addDemoGraphic12(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.CirclePrimitive({
    position: [116.314482, 30.918334, 417],
    style: {
      radius: 2000.0,
      color: "#00FFFF",
      opacity: 0.4,
      clampToGround: true,

      label: { text: "Mouseover will highlight", pixelOffsetY: -30 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  // Demonstrate personalized processing of graphics
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

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.239096, 30.872072, 700),
    style: {
      radius: 1500.0,
      diffHeight: 1000,
      image: "img/textures/poly-soil.jpg"
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.392526, 30.903729, 933.55),
    style: {
      radius: 1500.0,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#FF0000",
        count: 1, // number of circles
        speed: 20
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.CirclePrimitive({
    position: [116.244399, 30.920459],
    style: {
      radius: 2000,
      materialType: mars3d.MaterialType.ScanLine,
      materialOptions: {
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        speed: 10
      }
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.37617, 30.847384, 396.12),
    style: {
      radius: 900.0,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#ffff00",
        count: 3, // number of circles
        speed: 20,
        gradient: 0.1
      }
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.258301, 30.979046, 1483.7),
    style: {
      radius: 2500.0,
      // clampToGround: true,
      materialType: mars3d.MaterialType.RadarWave,
      materialOptions: {
        color: "#00ffff",
        speed: 10
      }
    },
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.318342, 30.972578, 1431.9),
    style: {
      radius: 1200.0,
      clampToGround: true,
      materialType: mars3d.MaterialType.RadarLine,
      materialOptions: {
        color: "#00ff00",
        speed: 10
      }
    },
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic8(graphicLayer) {
  //Register custom material
  const Circle3WaveType = "Circle3Wave"
  mars3d.MaterialUtil.register(Circle3WaveType, {
    fabric: {
      uniforms: {
        color1: Cesium.Color.RED,
        color2: Cesium.Color.YELLOW,
        color3: Cesium.Color.BLUE,
        alpha: 1.0,
        speed: 10.0,
        globalAlpha: 1.0
      },
      source: `czm_material czm_getMaterial(czm_materialInput materialInput)
      {
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st;
          float dis = distance(st, vec2(0.5, 0.5));
          float per = fract(speed*czm_frameNumber/1000.0);
          float scale = per * 0.5;
          if(dis > scale){
            discard;
          }else {
            material.alpha = alpha * globalAlpha;
          }

          if(dis < scale/3.0)
            material.diffuse = color1.rgb;
          else  if(dis>scale/3.0 && dis<scale*2.0/3.0)
            material.diffuse =  color2.rgb;
          else
            material.diffuse = color3.rgb;

          return material;
      }`
    },
    translucent: true
  })

  const circlePrimitiveScan = new mars3d.graphic.CirclePrimitive({
    name: "Three Colors",
    position: new mars3d.LngLatPoint(116.405876, 30.963469, 1054.6),
    style: {
      radius: 3000.0,
      materialType: Circle3WaveType,
      materialOptions: {
        color1: Cesium.Color.RED,
        color2: Cesium.Color.YELLOW,
        color3: Cesium.Color.BLUE,
        alpha: 0.4,
        speed: 10.0
      }
    },
    hasEdit: false,
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(circlePrimitiveScan)
}

function addDemoGraphic12(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.155132, 30.956363, 677.2),
    style: {
      radius: 1000,
      fill: false,

      outline: true,
      outlineStyle: {
        width: 12,
        materialType: mars3d.MaterialType.LineCross,
        materialOptions: {
          color: Cesium.Color.RED, // center line color
          dashLength: 36, // cross length
          maskLength: 10, // Gap interval length
          centerPower: 0.1, // Center width percentage
          dashPower: 0.2 // dashed line percentage
        }
        // materialType: mars3d.MaterialType.Image2,
        // materialOptions: {
        //   image: "/img/textures/line-air.svg",
        //   repeat: new mars3d.Cesium.Cartesian2(500, 1)
        // }
      }
    },
    attr: { remark: "Example 12" }
  })
  graphicLayer.addGraphic(graphic)
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

    const graphic = new mars3d.graphic.CircleEntity({
      position,
      style: {
        radius: result.radius,
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
    type: "circleP",
    style: {
      color: "#ffff00",
      opacity: 0.6,
      clampToGround: false,
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
    drawShowRadius: true
  })
}

// Start drawing the cylinder
function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "circleP",
    style: {
      color: "#ff0000",
      opacity: 0.5,
      diffHeight: 600,

      highlight: {
        type: "click",
        opacity: 0.9
      }
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
