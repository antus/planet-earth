// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var eventTarget = new mars3d.BaseClass()

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
  addDemoGraphic13(graphicLayer)
  addDemoGraphic14(graphicLayer)
  addDemoGraphic15(graphicLayer)
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
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: [116.1, 31.0, 1000],
    style: {
      image: "img/marker/lace-blue.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
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
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.2, 31.0, 1000),
    style: {
      image: "img/marker/lace-red.png",
      scale: 1.0,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      clampToGround: true,

      label: { text: "Mousing the mouse will zoom in", pixelOffsetY: -50 },
      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        scale: 1.5
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)+

  //Display objects in the specified time range 0-10, 20-30, 40-max
  const now = map.clock.currentTime
  graphic.availability = [
    { start: now, stop: Cesium.JulianDate.addSeconds(now, 10, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 20, new Cesium.JulianDate()), stop: Cesium.JulianDate.addSeconds(now, 30, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 40, new Cesium.JulianDate()), stop: "2999-01-01 00:00:00" }
  ]
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.307258, 30.999546, 1239.2),
    style: {
      image: "img/marker/lace-yellow.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -6), // offset
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000) //Display according to viewing distance
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

//
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: [116.4, 31.0, 1000],
    style: {
      image: "img/marker/route-start.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        text: "I am original",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -50,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)

  //convert graphic to json, clone an object
  const json = graphic.toJSON()
  console.log("Converted json", json)

  json.position = [116.5, 31.0, 1000] // New coordinates
  json.style.image = "img/marker/route-end.png"
  json.style.label = json.style.label || {}
  json.style.label.text = "I generated it after conversion"
  graphicLayer.addGraphic(json) //Supports adding json directly and converting it to graphic internally
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: [116.1, 30.9, 1000],
    style: {
      image: "img/marker/mark-green.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.2, 30.9, 1000),
    style: {
      image: "img/marker/mark-red.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "Example 6" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.3, 30.9, 1000),
    style: {
      image: "img/marker/mark-blue.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "Example 7" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.4, 30.9, 1000),
    style: {
      image: "img/marker/point-red.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "Example 8" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic9(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.5, 30.9, 1000),
    style: {
      image: "img/marker/point-yellow.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "Example 9" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic10(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.1, 30.8, 1000),
    style: {
      image: "img/marker/point-orange.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "Example 10" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic11(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.2, 30.8, 1000),
    style: {
      image: "img/icon/redBaseCamp.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    },
    attr: { remark: "Example 11" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic12(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.3, 30.8, 1000),
    style: {
      image: "img/marker/square.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    },
    attr: { remark: "Example 12" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic13(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.4, 30.8, 1000),
    style: {
      image: "img/marker/street.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "Example 13" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic14(graphicLayer) {
  const propertyFJ = getSampledPositionProperty([
    [116.34591, 30.680609, 437],
    [116.477653, 30.802623, 202.1],
    [116.749545, 31.062176, 675.5]
  ])

  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: propertyFJ,
    orientation: new Cesium.VelocityOrientationProperty(propertyFJ),
    frameRate: 2,
    style: {
      image: "img/icon/huojian.svg",
      scale: 0.5,
      alignedAxis: new Cesium.VelocityVectorProperty(propertyFJ, true)
    },
    attr: { remark: "Example 4" },
    hasEdit: false
  })
  graphicLayer.addGraphic(graphic)
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

function addDemoGraphic15(graphicLayer) {
  const build = buildProgress(87, { color: "#2B3946" })

  const graphic = new mars3d.graphic.BillboardPrimitive({
    position: new mars3d.LngLatPoint(116.095828, 30.734919, 805),
    style: {
      image: "img/marker/street.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      ...build
    },
    attr: { remark: "Example 15" }
  })
  graphicLayer.addGraphic(graphic)
}

function buildProgress(progress, options) {
  options = {
    color: "#e3e3e3",
    unit: "%",
    fontSize: 24,
    fontFamily: "Gilroy-Bold",
    fontWeight: "bold",
    ...options
  }

  const width = Math.ceil(Math.max(getTextWidth(progress, options), 82))
  const halfWidth = width / 2
  const reduce = width - 82

  const height = 50
  const base64 = svgTobase64(`<svg width="${width * 2}px" height="${
    height * 2
  }px" viewBox="0 0 ${width} 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
      <path d="M8,0 L${74 + reduce},0 C${78.418278 + reduce},-8.11624501e-16 ${82 + reduce},3.581722 ${82 + reduce},8 L${82 + reduce},35 C${
    82 + reduce
  },39.418278 ${78.418278 + reduce},43 ${74 + reduce},43 L${49.6878172 + reduce},43 L${49.6878172 + reduce / 2},43 L${41 + reduce / 2},50 L${
    32.3121828 + reduce / 2
  },43 L8,43 C3.581722,43 5.41083001e-16,39.418278 0,35 L0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z" id="path-1"></path>
      <filter x="-7.9%" y="-13.0%" width="115.9%" height="126.0%" filterUnits="objectBoundingBox" id="filter-3">
          <feGaussianBlur stdDeviation="0.5" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur>
          <feOffset dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset>
          <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
          <feColorMatrix values="0 0 0 0 0.721568627   0 0 0 0 0.823529412   0 0 0 0 0.862745098  0 0 0 1 0" type="matrix" in="shadowInnerInner1" result="shadowMatrixInner1"></feColorMatrix>
          <feGaussianBlur stdDeviation="4" in="SourceAlpha" result="shadowBlurInner2"></feGaussianBlur>
          <feOffset dx="0" dy="-5" in="shadowBlurInner2" result="shadowOffsetInner2"></feOffset>
          <feComposite in="shadowOffsetInner2" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner2"></feComposite>
          <feColorMatrix values="0 0 0 0 0.639215686   0 0 0 0 0.752941176   0 0 0 0 0.807843137  0 0 0 1 0" type="matrix" in="shadowInnerInner2" result="shadowMatrixInner2"></feColorMatrix>
          <feMerge>
              <feMergeNode in="shadowMatrixInner1"></feMergeNode>
              <feMergeNode in="shadowMatrixInner2"></feMergeNode>
          </feMerge>
      </filter>
  </defs>
  <use fill="#E5F0F4" fill-rule="evenodd" xlink:href="#path-1"></use>
  <use fill="black" fill-opacity="1" filter="url(#filter-3)" xlink:href="#path-1"></use>
  <text font-family="Gilroy-Bold, Gilroy,Arial, Helvetica, sans-serif" style="font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill: ${
    options.color
  };font-size: ${options.fontSize}px; white-space: pre; text-anchor: middle" x="${halfWidth}" y="24">${progress}D</text>
</svg>`)

  return {
    image: base64,
    width,
    height
  }
}
function getTextWidth(text, options) {
  // Get the canvas element and context object
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  //Set font style
  const fontSize = `${options.fontSize}px`
  const fontFamily = options.fontFamily
  const fontWeight = options.fontWeight
  ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`
  // Calculate the width of the text
  const width = 28 + ctx.measureText(`${text}${options.unit}`).width
  return width
}

function svgTobase64(source) {
  const url = "data:image/svg+xml;base64," + window.btoa(decodeURIComponent(encodeURIComponent(source)))
  return url
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

    const graphic = new mars3d.graphic.BillboardPrimitive({
      position,
      style: {
        image: "img/marker/point-red.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
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
    type: "billboardP",
    style: {
      image: "img/marker/mark-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        // When text is not needed, just remove the label configuration
        text: "can support text at the same time",
        font_size: 30,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -50
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
    }
  ])
}
