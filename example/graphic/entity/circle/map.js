// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.740724, lng: 116.363055, alt: 23499, heading: 351, pitch: -54 }
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
}

//
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: [116.253946, 30.865476, 881.9],
    style: {
      radius: 800.0,
      color: "#00ff00",
      opacity: 0.3,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  // Demonstrate personalized processing graphic
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

  //Test color flash
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // Flashing duration (seconds)
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // Callback after completion
      }
    })
  }
}

//
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: [116.244399, 30.920459],
    style: {
      radius: 2000,
      height: 200,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#ffff00",
        count: 2,
        speed: 20
      },
      label: {
        text: "I am the original\ntest newline",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  // graphic to geojson
  const geojson = graphic.toGeoJSON()
  console.log("Converted geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// Add a single geojson as graphic, use graphicLayer.loadGeoJSON directly for multiple
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // new coordinates
  graphicCopy.position = [116.301991, 30.933872, 624.03]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "I generated it after conversion"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.392526, 30.903729, 933.55),
    style: {
      radius: 1500.0,
      diffHeight: 1000.0,
      color: "#00ff00",
      opacity: 0.3,
      rotationDegree: 45,

      label: { text: "Mouseover will highlight", pixelOffsetY: -30 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.329199, 30.881595, 390.3),
    style: {
      radius: 1500.0,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        // color: "#ff0000",
        color: new Cesium.CallbackProperty(function () {
          return Cesium.Color.BLUE
        }, false),
        count: 1, // single circle
        speed: 20
      }
    },
    hasMoveEdit: false, // Edit example: no movement allowed, only radius adjustment
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic5(graphicLayer) {
  let _rotation = Math.random()

  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.37617, 30.847384, 396.12),
    style: {
      radius: 1500.0,
      clampToGround: false,
      //Scan material
      materialType: mars3d.MaterialType.CircleScan,
      materialOptions: {
        image: "img/textures/circle-scan.png",
        color: "#5fc4ee",
        opacity: 1.0
      },
      stRotation: new Cesium.CallbackProperty(function (e) {
        _rotation -= 0.1
        return _rotation
      }, false),
      classificationType: Cesium.ClassificationType.BOTH
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic6(graphicLayer) {
  let _rotation = Math.random()
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.326329, 30.84786, 421.7),
    style: {
      radius: 1000.0,
      //Scan material
      materialType: mars3d.MaterialType.CircleScan,
      materialOptions: {
        image: "img/textures/circle-two.png",
        color: "#ffff00"
      },
      stRotation: new Cesium.CallbackProperty(function (e) {
        _rotation += 0.1
        return _rotation
      }, false)
    },
    attr: { remark: "Example 6" },
    hasEdit: false // No editing allowed
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic7(graphicLayer) {
  let currentRadius = 1
  const duration = 5000 // milliseconds
  const maxRadius = 2000 // meters

  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.271298, 30.831822, 634),
    style: {
      semiMajorAxis: new Cesium.CallbackProperty(function (event) {
        currentRadius += (1000 / duration) * 50
        if (currentRadius > maxRadius) {
          currentRadius = 1
        }
        return currentRadius
      }, false),
      semiMinorAxis: new Cesium.CallbackProperty(function (event) {
        return currentRadius
      }, false),
      //Scan material
      materialType: mars3d.MaterialType.CircleScan,
      materialOptions: {
        image: "img/textures/poly-hexa.png",
        color: "#ff0000",
        opacity: 1.0
      }
    },
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic8(graphicLayer) {
  const canvasCollection = document.createElement("canvas")
  canvasCollection.setAttribute("width", "800px")
  canvasCollection.setAttribute("height", "800px")

  let rotation = 0
  const step = -0.02

  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.326672, 30.811903, 605),
    style: {
      radius: 2000,
      rotation: new Cesium.CallbackProperty(() => {
        rotation -= step
        return rotation
      }, false),
      stRotation: new Cesium.CallbackProperty(() => {
        rotation -= step
        return rotation
      }, false),
      material: new Cesium.ImageMaterialProperty({
        image: new Cesium.CallbackProperty(() => {
          const context = canvasCollection.getContext("2d")
          context.clearRect(0, 0, canvasCollection.width, canvasCollection.height) // Clear the canvas

          const scanColor0 = "rgba(0,255,255,1)"
          const scanColorTmp = scanColor0.split(",")
          scanColorTmp[3] = "0)"
          const scanColor1 = scanColorTmp.join()

          const grd = context.createLinearGradient(175, 100, canvasCollection.width, canvasCollection.height / 2)
          grd.addColorStop(0, scanColor0)
          grd.addColorStop(1, scanColor1)
          context.fillStyle = grd
          context.globalAlpha = Cesium.defaultValue(graphic.style.globalAlpha, 1.0)

          context.beginPath()
          context.moveTo(400, 400)
          context.arc(400, 400, 400, (-30 / 180) * Math.PI, (0 / 180) * Math.PI)
          context.fill()

          const newImg = new Image(canvasCollection.width, canvasCollection.height)
          newImg.src = canvasCollection.toDataURL("image/png")

          return newImg
        }, false),
        transparent: true
      })
    },
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic9(graphicLayer) {
  let lastPosition
  const circleEntity = new mars3d.graphic.CircleEntity({
    position: new Cesium.CallbackProperty(function (time) {
      return lastPosition
    }, false),
    style: {
      radius: 500,
      materialType: mars3d.MaterialType.Image2,
      materialOptions: {
        image: getMarsCanves()
      },
      clampToGround: true
    },
    attr: { remark: "Example 9" },
    hasEdit: false
  })
  graphicLayer.addGraphic(circleEntity)

  map.on(mars3d.EventType.mouseMove, function (event) {
    lastPosition = event.cartesian
    // circleEntity._updatePositionsHook()
  })
}

function getMarsCanves() {
  // Get the canvas element
  const canvas = document.createElement("canvas")
  canvas.width = 400
  canvas.height = 400

  const ctx = canvas.getContext("2d")

  //Set the radius and center point coordinates of the circle
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 20

  //Draw a hollow circle
  ctx.translate(centerX, centerY) // Translate to the center of the circle
  ctx.rotate(Math.PI) // Rotate 180 degrees
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = "transparent"
  ctx.lineWidth = 2
  ctx.stroke()

  // draw scale
  const numTicks = 360 //Total number of ticks
  let tickLength = 10 // tick length

  for (let i = 0; i < numTicks; i++) {
    ctx.save()
    const angle = ((i - numTicks / 2) * (Math.PI * 2)) / numTicks - Math.PI / 2
    // let angle = ((2 * Math.PI) / numTicks) * i - Math.PI / 2; // Calculate the angle of the tick mark
    // Calculate the angle of the text
    let textAngle = angle + Math.PI * 1.75
    ctx.rotate(angle) // Calculate the rotation angle
    // ctx.rotate((Math.PI * 2 * i) / numTicks); // Calculate the rotation angle
    ctx.beginPath()
    //Draw tick marks and mark tick text
    if (i % 5 === 0 && (i / 5) % 2 !== 0) {
      tickLength = 15 // Modify tick length
    } else if (i % 5 === 0 && (i / 5) % 2 === 0) {
      tickLength = 20
    } else {
      tickLength = 10
    }
    ctx.moveTo(radius, 0) // Starting point of tick mark
    ctx.lineTo(radius - tickLength, 0) // End point of tick mark
    ctx.translate(radius - tickLength - 10, 0)
    let magnification = 2
    // Determine the angle of each scale
    switch (i) {
      case 0:
        textAngle = angle + Math.PI * magnification
        break
      case 45:
        magnification = 1.75
        textAngle = angle + Math.PI * magnification
        break
      case 90:
        magnification = 1.5
        textAngle = angle + Math.PI * magnification
        break
      case 135:
        magnification = 1.25
        textAngle = angle + Math.PI * magnification
        break
      case 180:
        magnification = 1
        textAngle = angle + Math.PI * magnification
        break
      case 225:
        magnification = 0.75
        textAngle = angle + Math.PI * magnification
        break
      case 270:
        magnification = 0.5
        textAngle = angle + Math.PI * magnification
        break
      case 315:
        magnification = 0.25
        textAngle = angle + Math.PI * magnification
        break
      case 360:
        magnification = 0
        textAngle = angle + Math.PI * magnification
        break

      default:
        break
    }
    ctx.rotate(textAngle)
    ctx.textAlign = "center"
    ctx.font = "14px Arial"
    ctx.fillStyle = "#ffffff"
    if (i > -1 && i <= 180) {
      ctx.strokeStyle = "red"
    } else {
      ctx.strokeStyle = "blue"
    }
    ctx.stroke()
    //Modify the position of the scale text
    if (i % 45 === 0 && i <= 180) {
      ctx.fillText(i, 0, 5) // Number of clockwise angle ticks
    } else if (i % 45 === 0 && i > 180) {
      if (i < 270) {
        ctx.fillText(i - 90, 0, 5)
      } else if (i === 270) {
        ctx.fillText(i - 180, 0, 5)
      } else if (i > 270) {
        ctx.fillText(360 - i, 0, 5)
      }
    }
    ctx.restore()
  }
  return canvas.toDataURL("image/png")
}

function addDemoGraphic10(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.365776, 30.963614, 1090.7),
    style: {
      radius: 500,
      opacity: 0.4,
      color: "#02D4FD",
      clampToGround: true,

      outline: true,
      outlineStyle: {
        width: 12,
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: "/img/textures/line-air.svg",
          repeat: new mars3d.Cesium.Cartesian2(1000, 1)
        }
      }
    },
    attr: { remark: "Example 10" }
  })
  graphicLayer.addGraphic(graphic)

  let newRadius = 500

  graphic.radius = new Cesium.CallbackProperty(function (time) {
    if (newRadius < 2000) {
      newRadius += 10
    }
    return newRadius
  }, false)
}

// Flashing circle, principle: callback attribute, automatically modify alpha transparency
function addDemoGraphic11(graphicLayer) {
  let alpha = 1
  let biaoshi = true

  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.261813, 30.9766, 1310.1),
    style: {
      radius: 900,
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(function () {
          if (biaoshi) {
            alpha = alpha - 0.05
            if (alpha <= 0) {
              biaoshi = false // hide
            }
          } else {
            alpha = alpha + 0.05
            if (alpha >= 1) {
              biaoshi = true // show
            }
          }
          return Cesium.Color.RED.withAlpha(alpha)
        }, false)
      )
    },
    attr: { remark: "Example 11" }
  })
  graphicLayer.addGraphic(graphic)
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
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.6,
      clampToGround: false,
      outline: true,
      outlineStyle: {
        width: 20,
        materialType: mars3d.MaterialType.LineCross,
        materialOptions: {
          color: Cesium.Color.RED, // center line color
          dashLength: 36, // cross length
          maskLength: 10, // Gap interval length
          centerPower: 0.1, // Center width percentage
          dashPower: 0.2 // dashed line percentage
        }
      },
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
    type: "circle",
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
