// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.353044, lng: 117.230763, alt: 58544, heading: 1, pitch: -51 }
  },
  terrain: {
    show: false
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
  map = mapInstance // record map

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    // const attr = event.graphic.attr
    console.log("The single value in the merged object was clicked", pickedItem)
  })

  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.

  //Add demo data
  addRandomGraphicByCount(10000)
  graphicLayer.flyTo()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  const arrData = []
  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, result.radius)

    arrData.push({
      positions: [pt1, position, pt2],
      style: {
        diffHeight: result.radius,
        color: Cesium.Color.fromRandom({ alpha: 0.6 })
      },
      attr: { index }
    })
  }

  // Combined rendering of multiple area objects.
  const graphic = new mars3d.graphic.WallCombine({
    instances: arrData,
    // style: {
    //   outline: true,
    //   outlineWidth: 1,
    //   outlineColor: "#ffffff",
    // },
    // Style when highlighted
    highlight: {
      type: mars3d.EventType.click,
      color: Cesium.Color.YELLOW.withAlpha(0.9)
    }
  })
  graphicLayer.addGraphic(graphic)

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
