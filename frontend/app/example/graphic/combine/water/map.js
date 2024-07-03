// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.674602, lng: 117.236871, alt: 15562, heading: 360, pitch: -44 }
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
  map = mapInstance // record map

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    // let attr = event.graphic.attr
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

    let pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    let pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 72, result.radius)
    let pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 144, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 216, result.radius)
    const pt5 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 288, result.radius)

    pt1 = mars3d.PointUtil.setPositionsHeight(pt1, 200)
    pt2 = mars3d.PointUtil.setPositionsHeight(pt2, 100)
    pt3 = mars3d.PointUtil.setPositionsHeight(pt3, 100)

    arrData.push({
      positions: [pt1, pt2, pt3, pt4, pt5],
      style: {
        normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
        frequency: 8000.0, // Number that controls the wave number.
        animationSpeed: 0.02, // Number that controls the animation speed of water.
        amplitude: 5.0, // Number that controls the amplitude of the water wave.
        specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
        baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
        blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
        opacity: 0.6, // transparency

        offsetAttribute: Cesium.GeometryOffsetAttribute.ALL, // required
        offsetHeight: Math.random() * 1000
      },
      attr: { index }
    })
  }

  // Combined rendering of multiple area objects.
  const graphic = new mars3d.graphic.WaterCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(graphic)

  // Demo: Smoothly move height
  // let height = 0
  // setInterval(() => {
  //   if (height > 10000 || graphic.isDestroy) {
  //     return
  //   }
  //   height += 1
  // graphic.offsetHeight = height // Update all
  // // graphic.setOffsetHeight(height, 0) // Update the 0th data
  // }, 10)

  // setInterval(() => {
  //   if (graphic.isDestroy) {
  //     return
  //   }
  //   graphic.eachInstances((item, index) => {
  // // The following is just for the convenience of demonstration, the generated interval height value
  //     if (!Cesium.defined(item.isUp)) {
  //       item.isUp = Math.random() > 0.5 ? -1 : 1
  //     }
  //     if (item.style.offsetHeight > 1000) {
  //       item.isUp = -1
  //     }
  //     if (item.style.offsetHeight < 0) {
  //       item.isUp = 1
  //     }

  //     item.style.offsetHeight += item.isUp
  //   })
  //   graphic.setOffsetHeight()
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
