// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.805326, lng: 117.241767, alt: 2281, heading: 357, pitch: -42 }
  },
  terrain: {
    show: false
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map // create vector data layer

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer) // Bind listening events on the layer

  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    console.log("The single value in the merged object was clicked", pickedItem)
  })

  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer // Add some demonstration data
  addDemoGraphic1()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
  graphicLayer.remove()
}

function addDemoGraphic1() {
  const startTime = new Date().getTime()

  const url = "//data.mars3d.cn/file/geojson/buildings-hf.json"
  mars3d.Util.fetchJson({ url }).then((data) => {
    console.log("1.geojson data request completed", data)

    const arr = mars3d.Util.geoJsonToGraphics(data, {
      symbol: {
        callback: function (attr) {
          const diffHeight = (attr.floor || 1) * 5

          return {
            height: 0,
            diffHeight,
            color: Cesium.Color.fromRandom({ alpha: 0.4 }) // Random color
          }
        }
      }
    })

    console.log("2. Start rendering PolygonCombine object", arr)

    const graphic = new mars3d.graphic.PolygonCombine({
      instances: arr, // public style
      style: {
        outline: true,
        outlineColor: "#ffffff",
        flat: true
      },
      // Style when highlighted
      highlight: {
        type: mars3d.EventType.click,
        color: Cesium.Color.YELLOW.withAlpha(0.9)
      }
    })
    graphicLayer.addGraphic(graphic)

    graphic.readyPromise.then(() => {
      console.log("3.PolygonCombine rendering completed")

      const endTime = new Date().getTime()
      const usedTime = (endTime - startTime) / 1000 // The number of milliseconds between the two timestamps
      globalMsg(`Generating ${arr.length} pieces of data, taking a total of ${usedTime.toFixed(2)} seconds`) // Combined rendering of multiple area objects.
    })
  })
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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 72, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 144, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 216, result.radius)
    const pt5 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 288, result.radius)
    arrData.push({
      positions: [pt1, pt2, pt3, pt4, pt5],
      style: {
        color: Cesium.Color.fromRandom({ alpha: 0.6 })
      },
      attr: { index }
    })
  } // Combined rendering of multiple area objects.

  const graphic = new mars3d.graphic.PolygonCombine({
    instances: arrData, // style when highlighted
    highlight: {
      type: mars3d.EventType.click,
      color: Cesium.Color.YELLOW.withAlpha(0.9)
    }
  })
  graphicLayer.addGraphic(graphic)

  // Demo: Smoothly move height
  // let height = 0
  // setInterval(() => {
  //   if (height > 10000 || graphic.isDestroy) {
  //     return
  //   }
  //   height += 1
  //   graphic.offsetHeight = height
  // }, 10)

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

// Get random points in the area
function randomPoint() {
  const jd = random(115.955684 * 1000, 117.474003 * 1000) / 1000
  const wd = random(30.7576 * 1000, 32.008782 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
