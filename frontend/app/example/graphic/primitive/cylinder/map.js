// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.63693, lng: 116.271312, alt: 25226, heading: 350, pitch: -38 }
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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.CylinderPrimitive({
    position: [116.282587, 30.859197, 1544.31],
    style: {
      length: 2000.0,
      topRadius: 0.0,
      bottomRadius: 1000.0,
      color: "#ff0000",
      opacity: 0.7
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
  // const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
  //   Cesium.Cartesian3.fromDegrees(116.22457, 30.883148, 1035.2),
  //   new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0, 0)
  // )
  const graphic = new mars3d.graphic.CylinderPrimitive({
    position: new mars3d.LngLatPoint(116.22457, 30.883148, 1035.2),
    // modelMatrix: modelMatrix,
    style: {
      length: 2000.0,
      topRadius: 0.0,
      bottomRadius: 1000.0,
      color: "#ff0000",
      opacity: 0.4,
      heading: 45,
      roll: 45,
      pitch: 0
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CylinderPrimitive({
    position: [116.177214, 30.842242, 2000],
    style: {
      slices: 4, // four cones
      length: 4000.0,
      topRadius: 0.0,
      bottomRadius: 900.0,
      color: "#00ffff",
      opacity: 0.4,

      label: { text: "Mouseover will highlight", pixelOffsetY: -30 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.CylinderPrimitive({
    position: [116.244399, 30.920459, 573.6],
    style: {
      length: 2000.0,
      topRadius: 1000.0,
      bottomRadius: 1000.0,
      color: "#00FFFF",
      opacity: 0.4
    },
    attr: { remark: "Example 4" }
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

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.CylinderPrimitive({
    position: [116.328775, 30.954602, 5000],
    style: {
      length: 10000.0,
      topRadius: 0.0,
      bottomRadius: 1500.0,
      // Custom diffuse ripple texture
      materialType: mars3d.MaterialType.CylinderWave,
      materialOptions: {
        color: "#ffff00",
        repeat: 30.0
      },
      faceForward: false, // When the normal direction of the drawn triangular patch cannot face the viewpoint, the normal direction will be automatically flipped to avoid problems such as blackening after normal calculation.
      closed: true // Whether it is a closed body, what is actually performed is whether to perform back cropping
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic6(graphicLayer) {
  //Add satellite 1
  const point = new mars3d.LngLatPoint(116.148832, 30.920609, 9000)

  //Add model
  const graphicModel = new mars3d.graphic.ModelPrimitive({
    position: point,
    style: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 1,
      minimumPixelSize: 50
    },
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphicModel)

  // Effect 1
  const pointQY = point.clone()
  pointQY.alt = pointQY.alt / 2

  const graphic = new mars3d.graphic.CylinderPrimitive({
    position: pointQY,
    style: {
      length: point.alt,
      topRadius: 0.0,
      bottomRadius: 3000,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#02ff00"
      }
    }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

//Register custom material
const CylinderFadeType = "CylinderFade"
mars3d.MaterialUtil.register(CylinderFadeType, {
  fabric: {
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      image: Cesium.Material.DefaultImageId,
      globalAlpha: 1.0
    },
    source: `
        uniform vec4 color;
        uniform sampler2D image;
        czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st;
          float time = fract(czm_frameNumber / 90.) ;
          vec2 new_st = fract(st- vec2(time,time));
          vec4 colorImage = texture(image, new_st);
          vec3 diffuse = colorImage.rgb;
          float alpha = colorImage.a;
          diffuse *= color.rgb;
          alpha *= color.a;
          material.diffuse = diffuse;
          material.alpha = alpha * pow(1. - st.t,color.a) * globalAlpha;
          return material;
        } `
  },
  translucent: true
})

function addDemoGraphic7(graphicLayer) {
  Cesium.Resource.fetchImage({ url: "img/textures/vline-point.png" }).then((image) => {
    const graphic = new mars3d.graphic.CylinderPrimitive({
      position: [116.209929, 30.975196, 1670.4],
      style: {
        length: 2000.0,
        topRadius: 0.0,
        bottomRadius: 1000.0,
        materialType: CylinderFadeType,
        materialOptions: {
          color: "#00ffff",
          image: _getParticlesImage(image)
        }
      },
      attr: { remark: "Example 7" }
    })
    graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
  })
}

function _getParticlesImage(image) {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 256
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, 64, 256)
  ctx.drawImage(image, 0, 0)
  ctx.drawImage(image, 33, 0)
  return canvas
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

    const graphic = new mars3d.graphic.CylinderEntity({
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

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "cylinderP",
    style: {
      fill: true,
      color: "#00ff00",
      opacity: 0.6
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
      text: "Enable axis translation",
      icon: "fa fa-pencil",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
          return false
        }
        return !graphic.editing?.hasMoveMatrix
      },
      callback: (event) => {
        const graphic = event.graphic
        graphic.editing.startMoveMatrix(event.graphic, event)
      }
    },
    {
      text: "Stop panning by axis",
      icon: "fa fa-pencil",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
          return false
        }
        return graphic.editing?.hasMoveMatrix
      },
      callback: (event) => {
        const graphic = event.graphic
        graphic.editing.stopMoveMatrix()
      }
    },
    {
      text: "Enable rotation by axis",
      icon: "fa fa-bullseye",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
          return false
        }
        return !graphic.editing?.hasRotateMatrix
      },
      callback: (event) => {
        const graphic = event.graphic
        graphic.editing.startRotateMatrix(event.graphic, event)
      }
    },
    {
      text: "Stop rotating on axis",
      icon: "fa fa-bullseye",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
          return false
        }
        return graphic.editing?.hasRotateMatrix
      },
      callback: (event) => {
        const graphic = event.graphic
        graphic.editing.stopRotateMatrix()
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
