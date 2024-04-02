// import * as mars3d from "mars3d"

{ mars3d }

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
  graphicLayer = new mars3d.layer.GraphicLayer({
    allowDrillPick: true // If there is an icon point with exactly the same coordinates, you can turn on this attribute, and the click event is judged through graphics.
  })
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
  // addDemoGraphic12(graphicLayer)
  addDemoGraphic13(graphicLayer)
  addDemoGraphic14(graphicLayer)
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
  const graphic = new mars3d.graphic.BillboardEntity({
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

  //Test color flash
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // Flashing duration (seconds)
      maxAlpha: 0.5,
      setp: 5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // Callback after completion
      }
    })
  }
}

//
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardEntity({
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
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)
}

function addDemoGraphic3(graphicLayer) {
  // Demonstrate overlapping icons
  const graphic0 = new mars3d.graphic.BillboardEntity({
    position: new mars3d.LngLatPoint(116.307258, 30.999546, 1239.2),
    style: {
      image: "img/marker/lace-red.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -6), // offset
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000) //Display according to viewing distance
    },
    attr: { remark: "Example 3-Overlap 1" }
  })
  graphicLayer.addGraphic(graphic0) // There is another way to write it: graphic.addTo(graphicLayer)

  const graphic = new mars3d.graphic.BillboardEntity({
    position: new mars3d.LngLatPoint(116.307258, 30.999546, 1239.2),
    style: {
      image: "img/marker/lace-yellow.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -6), // offset
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000) //Display according to viewing distance
    },
    attr: { remark: "Example 3-Overlap 2" }
  })
  graphicLayer.addGraphic(graphic)
}

//
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardEntity({
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
  delete json.id // Prevent id conflicts, modify as needed in actual business
  console.log("Converted json", json)

  json.position = [116.5, 31.0, 1000] // New coordinates
  json.style.image = "img/marker/route-end.png"
  json.style.label = json.style.label || {}
  json.style.label.text = "I generated it after conversion"
  graphicLayer.addGraphic(json) //Supports adding json directly and converting it to graphic internally
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardEntity({
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
  const graphic = new mars3d.graphic.BillboardEntity({
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
  const graphic = new mars3d.graphic.BillboardEntity({
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
  const graphic = new mars3d.graphic.BillboardEntity({
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
  const graphic = new mars3d.graphic.BillboardEntity({
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
  const graphic = new mars3d.graphic.BillboardEntity({
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
  const graphic = new mars3d.graphic.BillboardEntity({
    position: new mars3d.LngLatPoint(116.2, 30.8, 1000),
    style: {
      // Support base64
      image:
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzRweCIgaGVpZ2h0PSI4MnB4IiB2aWV3Qm94PSIwIDAgNzQgODIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+56m6PC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMTAwJSIgeTE9IjUwJSIgeDI9IjMzLjYyOTE0ODglIiB5Mj0iNTcuNzg0Njc0MyUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzdCNzk3OSIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMC44MTk4MjA4MDQiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGZpbHRlciB4PSItOS4xJSIgeT0iLTE1LjclIiB3aWR0aD0iMTE4LjIlIiBoZWlnaHQ9IjEzMS40JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTIiPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxLjEyIiBpbj0iU291cmNlR3JhcGhpYyI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICA8L2ZpbHRlcj4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjUwJSIgeTE9IjEwMCUiIHgyPSI1MCUiIHkyPSIzLjA2MTYxN2UtMTUlIiBpZD0ibGluZWFyR3JhZGllbnQtMyI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGRkU2NTEiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZGQzgyRCIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8cGF0aCBkPSJNMzAuOTk3OTc4OSw2Ny4yMjAyOTE3IEMzMy42ODgyMDAzLDYyLjE3NzMwOTYgMzUuNzA2MDI5Niw1OS40OTQzMzI0IDM3LjA1MTQ2NjgsNTkuMTcxMzYwMSBDNTAuMjM0NjM4OCw1Ni4wMDY3Mzg1IDYwLjAzMiw0NC4xNDY5MDc1IDYwLjAzMiwzMCBDNjAuMDMyLDEzLjQzMTQ1NzUgNDYuNTkzMzc5LDAgMzAuMDE2LDAgQzEzLjQzODYyMSwwIDAsMTMuNDMxNDU3NSAwLDMwIEMwLDQ0LjExMzQwOTQgOS43NTEwMTgzMyw1NS45NTA1NjA1IDIyLjg4Njk0Miw1OS4xNDg3MzM2IEMyNC4yNDk5NDEsNTkuNDgwNTc5OCAyNi4yOTU3NDA0LDYyLjE3Mjc4NDUgMjkuMDI0MzQwMyw2Ny4yMjUzNDc2IEwyOS4wMjQzNjIsNjcuMjI1MzM1OSBDMjkuMzE4MjgxMSw2Ny43Njk1ODc1IDI5Ljk5Nzc1MjcsNjcuOTcyNTIyMSAzMC41NDIwMDQzLDY3LjY3ODYwMjkgQzMwLjczNTc0Myw2Ny41NzM5NzU4IDMwLjg5NDM0MzQsNjcuNDE0NTYyNiAzMC45OTc5Nzg5LDY3LjIyMDI5MTcgWiIgaWQ9InBhdGgtNCI+PC9wYXRoPgogICAgICAgIDxmaWx0ZXIgeD0iLTEyLjUlIiB5PSItMTAuOSUiIHdpZHRoPSIxMjUuMCUiIGhlaWdodD0iMTE5LjglIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItNSI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9IjAiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIuNSIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgMCAwIDAgMC41IDAiIHR5cGU9Im1hdHJpeCIgaW49InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb2xvck1hdHJpeD4KICAgICAgICA8L2ZpbHRlcj4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjUwJSIgeTE9Ii0yLjQ4OTQ5ODEzZS0xNSUiIHgyPSI1MCUiIHkyPSIxMDAlIiBpZD0ibGluZWFyR3JhZGllbnQtNiI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGRkZERkIiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0Y3QjUxRCIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLmkJzntKIiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJpY29u5LiO6aKc6ImyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTIwOS4wMDAwMDAsIC01MTIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLnqboiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMTQuMDAwMDAwLCA1MTcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0i6Lev5b6ELTIiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMSkiIGZpbHRlcj0idXJsKCNmaWx0ZXItMikiIHBvaW50cz0iMzAuMDE2IDY5LjEwNzE0MjkgNjcgNTMuNTcxNDI4NiA2NyA3NSI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0xNCI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IuakreWchuW9oiI+CiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci01KSIgeGxpbms6aHJlZj0iI3BhdGgtNCI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0zKSIgZmlsbC1ydWxlPSJldmVub2RkIiB4bGluazpocmVmPSIjcGF0aC00Ij48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPGVsbGlwc2UgaWQ9IuakreWchuW9oiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIuNCIgZmlsbC1vcGFjaXR5PSIwLjUxIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTYpIiBjeD0iMzAuMTI1IiBjeT0iMzAuMTExNjA3MSIgcng9IjIzLjkyNSIgcnk9IjIzLjkxMTYwNzEiPjwvZWxsaXBzZT4KICAgICAgICAgICAgICAgICAgICA8dGV4dCBpZD0iNiIgeD0nMzAnIHk9JzM0JyAgIHN0eWxlPSdkb21pbmFudC1iYXNlbGluZTptaWRkbGU7dGV4dC1hbmNob3I6bWlkZGxlOycgZm9udC1mYW1pbHk9IlBpbmdGYW5nU0MtU2VtaWJvbGQsIFBpbmdGYW5nIFNDIiBmb250LXNpemU9IjQwIiBmb250LXdlaWdodD0iNTAwIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgICAgICAgICAgICAgMQogICAgICAgICAgICAgICAgICAgIDwvdGV4dD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+",
      scale: 0.5,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    },
    attr: { remark: "Example 11" }
  })
  graphicLayer.addGraphic(graphic)
}

//Use the third-party library (gifler.js) to load gif
function addDemoGraphic12(graphicLayer) {
  let gifImgBuffer
  const graphic = new mars3d.graphic.BillboardEntity({
    position: new mars3d.LngLatPoint(116.3, 30.8, 1000),
    style: {
      image: new Cesium.CallbackProperty(() => {
        return gifImgBuffer
      }, false),
      scale: 0.1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    },
    attr: { remark: "Example 12" }
  })
  graphicLayer.addGraphic(graphic)

  // eslint-disable-next-line no-undef
  const gif = gifler("img/icon/tf.gif")
  gif.frames(document.createElement("canvas"), function (ctx, frame) {
    gifImgBuffer = frame.buffer.toDataURL()
  })
}

function addDemoGraphic13(graphicLayer) {
  const graphic = new mars3d.graphic.BillboardEntity({
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

  const graphic = new mars3d.graphic.BillboardEntity({
    position: propertyFJ,
    orientation: new Cesium.VelocityOrientationProperty(propertyFJ),
    style: {
      image: "img/icon/huojian.svg",
      scale: 0.5,
      alignedAxis: new Cesium.VelocityVectorProperty(propertyFJ, true)
    },
    attr: { remark: "Example 14" },
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

    const graphic = new mars3d.graphic.BillboardEntity({
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
    type: "billboard",
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

function btnStartBounce() {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.startBounce) {
      graphic.startBounce()
    }
  })
}

function btnStartBounce2() {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.startBounce) {
      graphic.startBounce({
        autoStop: true,
        step: 2,
        maxHeight: 90
      })
    }
  })
}

function btnStopBounce() {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.stopBounce) {
      graphic.stopBounce()
    }
  })
}

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    if (event.graphics?.length > 1) {
      return `You clicked the overlapping icon, and there are ${event.graphics.length} objects in the area` // If there are icon points with exactly the same coordinates
    }

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
