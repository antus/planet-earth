// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let linePositions
let graphicPath

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 20.803452, lng: 116.629014, alt: 1734203, heading: 3, pitch: -57 }
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

  addDemoGraphics()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphics() {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // hemisphere
  const graphicQiu = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(117.276726, 31.864175, -10000.0),
    style: {
      radii: new Cesium.Cartesian3(200000.0, 200000.0, 200000.0),
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.EllipsoidWave,
      materialOptions: {
        color: "#ff0000",
        speed: 5.0
      },
      outline: false
    }
  })
  graphicLayer.addGraphic(graphicQiu)

  // Calculate circle line
  linePositions = mars3d.PolyUtil.getEllipseOuterPositions({
    position: Cesium.Cartesian3.fromDegrees(117.276726, 31.864175),
    radius: 500000,
    count: 60 // Return count*4 points in total
  })
  linePositions = mars3d.PointUtil.setPositionsHeight(linePositions, 20000)
  linePositions.push(linePositions[0]) // Closed circle

  //circle line
  // const graphicLine = new mars3d.graphic.PolylineEntity({
  //   positions: linePositions,
  //   style: {
  //     width: 8,
  //     materialType: mars3d.MaterialType.PolylineGlow,
  //     materialOptions: {
  //       glowPower: 0.2,
  //       color: Cesium.Color.GREEN
  //     }
  //   }
  // })
  // graphicLayer.addGraphic(graphicLine)

  //Aircraft path path
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const start = map.clock.currentTime
  let alltimes = 0
  for (let i = 0, len = linePositions.length; i < len; i++) {
    alltimes += 1
    const time = Cesium.JulianDate.addSeconds(start, alltimes, new Cesium.JulianDate())
    property.addSample(time, linePositions[i])
  }
  const stop = Cesium.JulianDate.addSeconds(start, alltimes, new Cesium.JulianDate())

  // This is where it becomes a smooth path.
  property.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  })

  graphicPath = new mars3d.graphic.PathEntity({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      width: 2,
      color: "#ffff00",
      opacity: 0.9
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
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.1,
      minimumPixelSize: 90
    }
  })
  graphicLayer.addGraphic(graphicPath)

  // Make sure viewer is at the desired time.
  map.clock.startTime = start.clone()
  map.clock.stopTime = stop.clone()
  map.clock.currentTime = start.clone()
  map.clock.clockRange = Cesium.ClockRange.LOOP_STOP // Loop after reaching the end time
  map.clock.multiplier = 1
  map.clock.shouldAnimate = true
}

// top view
function viewSeeTop() {
  map.trackedEntity = undefined

  map.flyToPositions(linePositions, { pitch: -90 })
}
// side view
function viewSeeCe() {
  map.trackedEntity = graphicPath

  graphicPath.flyToPoint({
    radius: 5000,
    heading: 0,
    duration: 0
  })
}
// Main view
function viewSeeHome() {
  map.trackedEntity = graphicPath

  graphicPath.flyToPoint({
    radius: 5000,
    heading: 90,
    duration: 0
  })
}
