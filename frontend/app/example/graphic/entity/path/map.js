// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.756263, lng: 117.209077, alt: 7696, heading: 5, pitch: -33 },
    clock: {
      currentTime: "2017-08-25 08:00:00"
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true // Whether to display the timeline control
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
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  let tempTime

  // starting point
  tempTime = map.clock.currentTime // Flight start time
  property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.172852, 31.862736, 50))

  //The first target point to move to
  tempTime = Cesium.JulianDate.addSeconds(tempTime, 120, new Cesium.JulianDate())
  property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.251461, 31.856011, 50))

  //The second target point to move to
  tempTime = Cesium.JulianDate.addSeconds(tempTime, 120, new Cesium.JulianDate())
  property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.265321, 31.876336, 50))

  tempTime = Cesium.JulianDate.addSeconds(tempTime, 600, new Cesium.JulianDate())
  property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.160215, 31.890639, 50))

  const graphic = new mars3d.graphic.PathEntity({
    position: property,
    style: {
      width: 2,
      color: "#ffff00",
      opacity: 1.0,

      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        type: mars3d.EventType.click,
        color: "#ff0000"
      }
    },
    label: {
      text: "Mars 1",
      font_size: 19,
      font_family: "楷体",
      color: Cesium.Color.AZURE,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(10, -25) // offset
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 0.5,
      minimumPixelSize: 40
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PathEntity({
    // maxCacheCount: -1,
    style: {
      width: 2,
      color: "#00ffff",
      opacity: 1.0,
      leadTime: 0, // The route ahead is not displayed

      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        type: mars3d.EventType.click,
        color: "#ff0000"
      }
    },
    label: {
      text: "Mars Rover",
      font_size: 18,
      font_family: "楷体",
      color: Cesium.Color.AZURE,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(10, -25) // offset
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.5,
      minimumPixelSize: 30
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)

  //Set dynamic position
  changePosition(graphic, 0)

  // Update dynamic position regularly (setInterval is a demonstration)
  const interval = 20
  changePosition(graphic, interval)
  setInterval(() => {
    if (graphic.isDestroy) {
      return
    }
    changePosition(graphic, interval)
  }, interval * 1000)
}

// change position
function changePosition(graphic, time) {
  graphic.addDynamicPosition(randomPoint(), time) // Move to the specified position in time seconds
}

// Get random points in the area
function randomPoint() {
  const jd = random(117.207666 * 1000, 117.287241 * 1000) / 1000
  const wd = random(31.817099 * 1000, 31.876848 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd, 30)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  let tempTime

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const property = new Cesium.SampledPositionProperty()
    property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

    // starting point
    tempTime = map.clock.currentTime // Flight start time
    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    property.addSample(tempTime, pt1)

    //The first target point to move to
    tempTime = Cesium.JulianDate.addSeconds(tempTime, 60, new Cesium.JulianDate())
    property.addSample(tempTime, mars3d.LngLatPoint.toCartesian(position))

    //The second target point to move to
    tempTime = Cesium.JulianDate.addSeconds(tempTime, 60, new Cesium.JulianDate())
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, result.radius)
    property.addSample(tempTime, pt2)

    const graphic = new mars3d.graphic.PathEntity({
      position: property,
      style: {
        width: 2,
        color: "#ffff00",
        opacity: 1.0,

        // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
        highlight: {
          type: mars3d.EventType.click,
          color: "#ff0000"
        }
      },
      model: {
        url: "//data.mars3d.cn/gltf/mars/wrj.glb",
        scale: 0.5,
        minimumPixelSize: 40
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
