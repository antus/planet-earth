// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.653865, lng: 116.262622, alt: 54556, heading: 0, pitch: -60 }
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

//
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.1, 31.0, 1000],
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 1000.0),
      maximumConeDegree: 90, // hemisphere
      fill: false,
      subdivisions: 64,
      stackPartitions: 32,
      slicePartitions: 32,
      outline: true,
      outlineColor: "#ffff00",

      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        outlineColor: "#ff0000"
      }
    },
    attr: { remark: "Example 1" },
    //Add scanning surface
    scanPlane: {
      step: 0.5, // step size
      style: {
        color: "#ffff00",
        opacity: 0.4
      }
    }
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
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 31.0, 1000),
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 1000.0),
      maximumConeDegree: 90, // hemisphere
      color: Cesium.Color.RED.withAlpha(0.3),
      subdivisions: 128,
      stackPartitions: 32,
      slicePartitions: 32,
      outline: true,
      outlineColor: Cesium.Color.RED.withAlpha(0.7)
    },
    attr: { remark: "Example 2" },
    //Add scanning surface
    scanPlane: [
      { step: 0.9, style: { color: "#ffff00", minimumConeDegree: 70.0, maximumConeDegree: 90.0 } },
      { step: 0.9, style: { heading: 120, color: "#ffff00", minimumConeDegree: 70.0, maximumConeDegree: 90.0 } },
      { step: 0.9, style: { heading: 240, color: "#ffff00", minimumConeDegree: 70.0, maximumConeDegree: 90.0 } }
    ]
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.307258, 30.999546, 1239.2),
    style: {
      radii: 2500,
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.EllipsoidElectric,
      materialOptions: {
        color: Cesium.Color.GREEN,
        speed: 5.0
      },
      outline: false
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

//
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.4, 31.0, 1000],
    style: {
      radii: 2500,
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.EllipsoidWave,
      materialOptions: {
        color: "#00ffff",
        speed: 5.0
      },
      outline: false
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)
}

//
function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.1, 30.9, 1000],
    style: {
      radii: 2500,
      innerRadii: 1500,
      maximumConeDegree: 90, // hemisphere
      materialType: mars3d.MaterialType.WallScroll,
      materialOptions: {
        image: "img/textures/line-color-azure.png",
        color: "#00ffff",
        count: 1.0,
        speed: 20,
        reverse: true,
        axisY: true,
        bloom: true
      },
      subdivisions: 128,
      stackPartitions: 32,
      slicePartitions: 32,
      outline: true,
      outlineColor: "#00ffff"
    },
    hasEdit: false,
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  //Add scanning surface
  // graphic.addScanPlane({
  // type: "roll", // Scan type
  // step: 0.5, // step size
  //   style: {
  //     minimumConeDegree: -90.0,
  //     maximumConeDegree: 90.0
  //   }
  // })
}

// half dome sphere
function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 30.9, 1000),
    style: {
      radii: 2500,
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.WallScroll,
      materialOptions: {
        image: "img/textures/poly-san.png",
        count: 1.0,
        color: "#00ffff",
        speed: 10,
        reverse: false,
        axisY: false,
        bloom: true
      }
      // outline: true,
      // outlineColor: Cesium.Color.BLUE.withAlpha(0.6)
    },
    hasEdit: false,
    //Add scanning surface
    scanPlane: {
      innerRadii: 2500,
      step: 0.5, // step size
      style: {
        color: "#00ffff",
        opacity: 0.2,
        outline: true,
        minimumClockDegree: 90.0,
        maximumClockDegree: 100.0,
        minimumConeDegree: -30.0,
        maximumConeDegree: 70.0
      }
    },
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphic)

  // //Add scanning surface
  // graphic.addScanPlane({
  // type: "pitch", // Scan type
  // step: 0.5, // step size
  //   style: {
  //     roll: 90,
  //     minimumConeDegree: 0.0,
  //     maximumConeDegree: 180.0
  //   }
  // })
}

//Including inner radius semi-dome sphere
function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.3, 30.9, 1000),
    style: {
      radii: 2500,
      innerRadii: 1000,
      maximumConeDegree: 90,
      color: "rgba(253,2,0,0.3)",
      outline: true
    },
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  //Add scanning surface
  graphic.addScanPlane({
    step: 1.5, // step size
    style: {
      innerRadii: 1000
    }
  })
}

// The cut inner radius of the semi-dome sphere
function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.4, 30.9, 1000),
    style: {
      radii: 2500,
      innerRadii: 1000,
      minimumConeDegree: 20.0,
      maximumConeDegree: 90,
      color: "rgba(253,200,0,0.3)",
      outline: true
    },
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  //Add scanning surface
  graphic.addScanPlane({
    step: 0.8, // step size
    style: {
      innerRadii: 1000
    }
  })
}

function addDemoGraphic9(graphicLayer) {
  const ellipsoid = new mars3d.graphic.EllipsoidEntity({
    position: [116.105052, 30.816437, 991],
    style: {
      radii: 2500,
      minimumClockDegree: -90.0,
      maximumClockDegree: 180.0,
      minimumConeDegree: 20.0,
      maximumConeDegree: 90.0,
      fill: false,
      outline: true,
      outlineColor: "rgba(0, 204, 0, 0.4)", // green
      stackPartitions: 30, // vertical
      slicePartitions: 30 // horizontal
    },
    //Add scanning surface
    scanPlane: {
      step: 1.0, // step size
      min: -90.0, // minimum value
      max: 180.0, // maximum value
      style: {
        innerRadii: 1000,
        outline: true,
        color: "rgba(255, 204, 0)",
        outlineColor: "rgba(255, 204, 0, 0.1)",
        minimumClockDegree: 90.0,
        maximumClockDegree: 100.0,
        minimumConeDegree: 20.0,
        maximumConeDegree: 70.0
      }
    }
  })
  graphicLayer.addGraphic(ellipsoid)
}

function addDemoGraphic10(graphicLayer) {
  const point = [116.257171, 31.218046, 962.1]

  const graphicN = new mars3d.graphic.EllipsoidEntity({
    position: point,
    style: {
      radii: 4000,
      maximumConeDegree: 90,
      color: "rgba(231,6,16,0.2)",
      label: {
        text: "minimum radius",
        color: "blue",
        background: true,
        backgroundColor: "rgba(255,255,255,0.4)",
        setHeight: 4000,
        visibleDepth: false,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 100000
      }
    },
    hasEdit: false
  })
  graphicLayer.addGraphic(graphicN)

  const graphicZ = new mars3d.graphic.EllipsoidEntity({
    position: point,
    style: {
      radii: 6000,
      maximumConeDegree: 90,
      color: "rgba(26,144,255,0.2)",
      label: {
        text: "middle radius",
        color: "blue",
        background: true,
        backgroundColor: "rgba(255,255,255,0.4)",
        setHeight: 6000,
        visibleDepth: false,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 100000
      }
    },
    hasEdit: false
  })
  graphicLayer.addGraphic(graphicZ)

  const graphicW = new mars3d.graphic.EllipsoidEntity({
    position: point,
    style: {
      radii: 8000,
      maximumConeDegree: 90,
      color: "rgba(82,196,26,0.2)",
      label: {
        text: "maximum radius",
        color: "blue",
        background: true,
        backgroundColor: "rgba(255,255,255,0.4)",
        setHeight: 8000,
        visibleDepth: false,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 100000
      }
    },
    hasEditRadii: false,
    linkage: [graphicN, graphicZ] // Linkage object
  })
  graphicLayer.addGraphic(graphicW)

  //Bind event
  graphicW.on(mars3d.EventType.editMouseMove, (event) => {
    const linkage = event.graphic?.options?.linkage // Linked object
    if (linkage) {
      const position = event.graphic.position
      linkage.forEach((element) => {
        element.position = position
      })
    }
  })
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  const radius = result.radius

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.EllipsoidEntity({
      position,
      style: {
        radii: radius,
        maximumConeDegree: 90,
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
    type: "ellipsoid",
    style: {
      color: "rgba(0,255,255,0.6)",
      maximumConeDegree: 90
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
