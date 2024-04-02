// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let drawGraphic
let graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: -13.151771, lng: 55.60413, alt: 30233027, heading: 154, pitch: -89 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 300000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    },
    clock: {
      multiplier: 10 // speed
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    compass: { top: "10px", left: "5px" }
  }
}
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // Record map map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Satellite clicked", event)
  })
  // graphicLayer.on(mars3d.EventType.change, function (event) {
  // console.log("Satellite position change", event)
  // })

  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Satellite Layer", template: "all", attr })
  })

  creatSatellite()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function creatSatellite() {
  const weixin = new mars3d.graphic.Satellite({
    name: "GAOFEN 1",
    tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
    tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90
    },
    label: {
      text: "GAOFEN 1",
      font_family: "楷体",
      font_size: 30,
      color: "#ffffff",
      outline: true,
      outlineColor: "#000000",
      outlineWidth: 3,
      background: true,
      backgroundColor: "#000000",
      backgroundOpacity: 0.5,
      pixelOffsetY: -20,
      scaleByDistance: true,
      scaleByDistance_far: 10000000,
      scaleByDistance_farValue: 0.4,
      scaleByDistance_near: 100000,
      scaleByDistance_nearValue: 1
    },
    cone: {
      angle1: 40,
      angle2: 10,
      color: "rgba(255,0,0,0.5)",
      show: false
    },
    path: {
      color: "#36d9ec"
    }
  })

  graphicLayer.addGraphic(weixin)

  weixin._lastInPoly = false

  setTimeout(() => {
    const position = weixin.position
    if (position) {
      map.flyToPoint(position, {
        radius: 900000, // distance from the target point
        pitch: -60 // camera direction
      })
    }
  }, 3000)

  // Location change event
  weixin.on(mars3d.EventType.change, function (event) {
    // Determine whether the satellite is within the plane
    const weixin = event.graphic
    if (!drawGraphic) {
      weixin._lastInPoly = false
      weixin.coneShow = false // Turn off the view frustum
      return
    }

    const position = weixin.position
    if (!position) {
      return
    }
    let openVideo = false
    const thisIsInPoly = drawGraphic.isInPoly(position)
    if (thisIsInPoly !== weixin._lastInPoly) {
      if (thisIsInPoly) {
        // Start entering the area
        console.log("Satellite begins to enter the area", weixin.name)

        weixin.coneShow = true // Turn on the view frustum
        openVideo = true // Open the video panel
      } else {
        //Leave the area
        console.log("Satellite leaves the area", weixin.name)

        weixin.coneShow = false // Turn off the view frustum
        openVideo = false // Close the video panel
      }

      eventTarget.fire("video", { openVideo })
      weixin._lastInPoly = thisIsInPoly
    }
  })
}

// Frame selection query rectangle
function drawRectangle() {
  drawClear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// Frame selection query circle
function drawCircle() {
  drawClear()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// Frame selection query multi-edge
function drawPolygon() {
  drawClear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// clear
function drawClear() {
  map.graphicLayer.clear()
  drawGraphic = null
}
