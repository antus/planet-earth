// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.769641, lng: 116.318889, alt: 7432.2, heading: 1, pitch: -19.6 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  globalNotify("Known Issue Tips", `(1) There will be a DIV jitter problem when the viewing angle changes when the viewing angle is very close.`)

  map.on(mars3d.EventType.click, function (event) {
    console.log("Listening to the map, a vector object was clicked", event)
  })

  //Create DIV data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    // event.stopPropagation()
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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// A black panel pointing to the yellow line in the lower left corner
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.29854, 30.937322, 568.1],
    style: {
      html: `<div class="marsBlackPanel  animation-spaceInDown">
              <div class="marsBlackPanel-text">Great Lake City, Innovation Highland</div>
          </div>`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 400000), // Display according to sight distance
      clampToGround: true,
      // Style when highlighted
      highlight: {
        // type: mars3d.EventType.click,
        className: "marsBlackPanel-highlight"
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)
}

// A gradient text panel with a vertical line in the middle
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.266763, 30.9272, 905.9],
    style: {
      html: `<div class="marsBlueGradientPnl">
              <div>Hefei Mars Technology Co., Ltd.</div>
          </div>`,
      scale: 10,
      heading: -80,

      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      offsetY: -89,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 400000), // Display according to sight distance

      // Style when highlighted
      highlight: {
        type: mars3d.EventType.click,
        className: "marsBlueGradientPnl-highlight"
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

//
function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.322645, 30.890187, 403.7],
    style: {
      html: `<div class="marsGreenGradientPnl" >Anhui welcomes you</div>`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM

      // Style when highlighted
      // highlight: {
      //   type: mars3d.EventType.click,
      //   className: "marsGreenGradientPnl-highlight"
      // }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)

  //Display objects in the specified time range 0-10, 20-30, 40-max
  const now = map.clock.currentTime
  graphic.availability = [
    { start: now, stop: Cesium.JulianDate.addSeconds(now, 10, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 20, new Cesium.JulianDate()), stop: Cesium.JulianDate.addSeconds(now, 30, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 40, new Cesium.JulianDate()), stop: "2999-01-01 00:00:00" }
  ]
}

//Add GIF icon, DIV method
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.29569, 30.905512, 583.8],
    style: {
      html: '<img src="img/icon/tf.gif" style="width:50px;height:50px;" ></img>',
      scale: 10,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // Display according to viewing distance
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    },
    attr: { remark: "Example 4" },
    pointerEvents: false // When false, no mouse events are allowed to be picked up and triggered, but the earth can be zoomed through the div.
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.311175, 30.99863, 1300],
    style: {
      html: `<iframe style="width: 2000px; height: 1200px; border: none; "src="http://mars3d.cn/dev/guide/"></iframe> `,
      scale: 3,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "Example 5" },
    testPoint: true
  })
  graphicLayer.addGraphic(graphic)
}

//Panel style tilted to the lower left corner
function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.257574, 30.868632, 1142.2],
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-red">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">Mars Water Plant</div>
                      <div class="label-content">
                          <div class="data-li">
                              <div class="data-label">Real-time traffic:</div>
                              <div class="data-value"><span id="lablLiuliang" class="label-num">39</span><span class="label-unit">m³/s</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Sink level:</div>
                              <div class="data-value"><span id="lablYeWei"  class="label-num">10.22</span><span class="label-unit">m</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Water pump status:</div>
                              <div class="data-value">
                                <span id="lablSBZT1" class="label-tag data-value-status-1" title="Intermediate status">No. 1</span>
                                <span id="lablSBZT2" class="label-tag data-value-status-0" title="Close status">No. 2</span>
                                </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Water outlet valve:</div>
                              <div class="data-value">
                                <span id="lablCSFM1" class="label-tag data-value-status-1" title="Intermediate status">No. 1</span>
                                <span id="lablCSFM2" class="label-tag data-value-status-2" title="Open status">No. 2</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // Display according to viewing distance
      clampToGround: true
    },
    attr: { remark: "Example 6" },
    pointerEvents: false // When false, no mouse events are allowed to be picked up and triggered, but the earth can be zoomed through the div.
  })
  graphicLayer.addGraphic(graphic)

  // Refresh the local DOM without affecting the operation of other controls on the panel
  // [It is recommended to actively modify the DOM after reading the back-end interface data, which is more efficient than the real-time refresh demonstrated below]
  graphic.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // DOM corresponding to popup

    const lablLiuliang = container.querySelector("#lablLiuliang")
    if (lablLiuliang) {
      lablLiuliang.innerHTML = (Math.random() * 100).toFixed(0) // Random number for testing
    }

    const lablYeWei = container.querySelector("#lablYeWei")
    if (lablYeWei) {
      lablYeWei.innerHTML = mars3d.Util.formatDate(new Date(), "ss.S") // Random number for testing
    }
  })
}

//Panel style tilted to the lower left corner
function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.330711, 30.873722, 378.3],
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-green">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">Dabieshan Water Plant</div>
                      <div class="label-content">
                          <div class="data-li">
                              <div class="data-label">Real-time traffic:</div>
                              <div class="data-value"><span class="label-num">99</span><span class="label-unit">m³/s</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Sink level:</div>
                              <div class="data-value"><span class="label-num">20.02</span><span class="label-unit">m</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Water pump status:</div>
                              <div class="data-value"><span class="label-tag data-value-status-1" title="Intermediate status">No. 1</span><span
                                      class="label-tag data-value-status-0" title="Close status">No. 2</span></div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Water outlet valve:</div>
                              <div class="data-value"><span class="label-tag data-value-status-1" title="Intermediate status">No. 1</span><span
                                      class="label-tag data-value-status-2" title="Open status">No. 2</span></div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      scale: 10,
      heading: 60,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // Display according to viewing distance
      clampToGround: true
    },
    attr: { remark: "Example 7" },
    // Custom test point styles can be passed in
    // testPoint: {
    //   color: '#ff0000',
    //   pixelSize: 8,
    // },
    pointerEvents: false // When false, no mouse events are allowed to be picked up and triggered, but the earth can be zoomed through the div.
  })
  graphicLayer.addGraphic(graphic)

  graphic.testPoint = true //Open the test point and compare it with the DIV point to adjust the css position
}

//Panel style tilted to the lower left corner
function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: Cesium.Cartesian3.fromDegrees(116.166701, 31.029976, 1068.8),
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-blue">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">Yuexi Water Plant</div>
                      <div class="label-content">
                          <div class="data-li">
                              <div class="data-label">Real-time traffic:</div>
                              <div class="data-value"><span class="label-num">98</span><span class="label-unit">m³/s</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Sink level:</div>
                              <div class="data-value"><span class="label-num">13.14</span><span class="label-unit">m</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">Water pump status:</div>
                              <div class="data-value">
                                <span id="btn-status1" class="label-tag data-value-status-1" title="Intermediate status">No. 1</span>
                                <span id="btn-status2" class="label-tag data-value-status-0" title="Close status">No. 2</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1000, 200000) //Display according to sight distance
    },
    attr: { remark: "Example 8" }
  })
  graphic.on(mars3d.EventType.add, function (event) {
    const container = event.graphic.container // DOM corresponding to popup

    const btnStatus1 = container.querySelector("#btn-status1")
    if (btnStatus1) {
      btnStatus1.addEventListener("click", (e) => {
        e.stopPropagation()
        globalMsg("You clicked on water pump No. 1")
      })
    }

    const btnStatus2 = container.querySelector("#btn-status2")
    if (btnStatus2) {
      btnStatus2.addEventListener("click", (e) => {
        e.stopPropagation()
        globalMsg("You clicked on water pump No. 2")
      })
    }
  })
  graphicLayer.addGraphic(graphic)

  movePoint(graphic) // animated move example
}

//
function movePoint(graphic) {
  map.clock.shouldAnimate = true

  // animated movement
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const time = 20 // Duration of movement, seconds
  let tempTime

  // starting point
  const startPoint = Cesium.Cartesian3.fromDegrees(116.166701, 31.029976, 1068.8)
  tempTime = map.clock.currentTime // Flight start time
  property.addSample(tempTime, startPoint)

  //The first target point to move to
  const point1 = Cesium.Cartesian3.fromDegrees(116.282471, 31.097293, 806.7)
  tempTime = Cesium.JulianDate.addSeconds(tempTime, time, new Cesium.JulianDate())
  property.addSample(tempTime, point1)

  //The second target point to move to
  const point2 = Cesium.Cartesian3.fromDegrees(116.457842, 31.072601, 931.6)
  tempTime = Cesium.JulianDate.addSeconds(tempTime, time, new Cesium.JulianDate())
  property.addSample(tempTime, point2)

  //The third target point to move to
  const point3 = Cesium.Cartesian3.fromDegrees(116.166701, 31.029976, 1068.8)
  tempTime = Cesium.JulianDate.addSeconds(tempTime, time, new Cesium.JulianDate())
  property.addSample(tempTime, point3)

  graphic.position = property
  graphic.orientation = new Cesium.VelocityOrientationProperty(property)
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

    const graphic = new mars3d.graphic.DivPlane({
      position: position,
      style: {
        html: `<div class="marsGreenGradientPnl" >Anhui welcomes you</div>`,
        scale: 10,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      },
      attr: { index: index },
      depthTest: false,
      hasZIndex: false,
      frameRate: 1
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "divPlane",
    style: {
      html: `<div class="marsImgPanel2">
                    <div class="title">Test DIV point</div>
                    <div class="content">Any Html code and css effects can be bound here</div>
                </div >`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
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

    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr: attr })
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
        graphic.stopEditing()
        graphicLayer.removeGraphic(graphic)
      }
    }
  ])
}
