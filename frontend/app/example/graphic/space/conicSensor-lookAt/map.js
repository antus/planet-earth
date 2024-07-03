// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: -7.606383, lng: 119.069383, alt: 10521145, heading: 0, pitch: -82 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    },
    clock: {
      multiplier: 5 // speed
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control,
    compass: { top: "10px", left: "5px" }
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
  map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  globalMsg("Not actual satellite orbit, randomly simulated coordinates, just to demonstrate tracking!")

  addGraphicLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addGraphicLayer() {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // ===========================================================
  // Get data
  const property = getDynamicProperty(function (timeInterval) {
    graphic.entity.availability = new Cesium.TimeIntervalCollection([new Cesium.TimeInterval(timeInterval)])
  })

  const times = property._property._times
  const startTime = times[0].clone()
  const stopTime = times[times.length - 1].clone()

  const graphic = new mars3d.graphic.PathEntity({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: startTime,
        stop: stopTime
      })
    ]),
    position: property, // point set
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      leadTime: 0,
      trailTime: 2800,
      resolution: 1,
      materialType: mars3d.MaterialType.PolylineGlow,
      materialOptions: {
        glowPower: 0.1,
        color: Cesium.Color.YELLOW
      },
      width: 10
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 150
    }
  })
  graphicLayer.addGraphic(graphic)

  // ===========================================================

  // View frustum display
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 20,
      angle2: 10,
      color: "rgba(110,245,0,0.5)"
    }
  })
  graphicLayer.addGraphic(satelliteSensor)

  // Ground station display
  const localStart = Cesium.Cartesian3.fromDegrees(109.51856, 18.258736, 2000)
  const conicSensor = new mars3d.graphic.ConicSensor({
    position: localStart,
    style: {
      angle: 5, // Minimum radar scanning elevation angle
      length: 2500000,
      color: Cesium.Color.fromBytes(255, 0, 0, 85),
      rayEllipsoid: true
    }
  })
  graphicLayer.addGraphic(conicSensor)

  conicSensor.lookAt = property // Tracking satellites

  //Test the connection line
  const testLine = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const localEnd = conicSensor.rayPosition
      if (!localEnd) {
        return []
      }
      return [localStart, localEnd]
    }, false),
    style: {
      arcType: Cesium.ArcType.NONE,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: "#ff0000"
      },
      width: 1
    }
  })
  graphicLayer.addGraphic(testLine)
}

// Construct simulated data, the actual project should be changed to service read return
function getDynamicProperty(callback) {
  const arr = dataWork.getTestData(Cesium.JulianDate.toIso8601(map.clock.currentTime), 2 * 60)

  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    const thisTime = Cesium.JulianDate.fromIso8601(item.time)
    const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)

    //Add information about each link point, arrival time and coordinate location
    property.addSample(thisTime, position)
  }

  const times = property._property._times
  const startTime = times[0].clone()
  let stopTime = times[times.length - 1].clone()

  const allTimes = Cesium.JulianDate.secondsDifference(stopTime, map.clock.currentTime) * 0.3 // Load the next data when determining how much time is left
  let loading = false
  map.on(mars3d.EventType.clockTick, function (clock) {
    const sxTimes = Cesium.JulianDate.secondsDifference(stopTime, map.clock.currentTime) // Remaining time

    if (!loading && sxTimes < allTimes) {
      loading = true
      const arr = dataWork.getTestData(Cesium.JulianDate.toIso8601(stopTime), 2 * 60)

      for (let i = 1; i < arr.length; i++) {
        const item = arr[i]

        const thisTime = Cesium.JulianDate.fromIso8601(item.time)
        const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)

        //Add information about each link point, arrival time and coordinate location
        property.addSample(thisTime, position)
      }

      const times = property._property._times
      stopTime = times[times.length - 1].clone()

      loading = false
      if (callback) {
        const result = { start: startTime, stop: stopTime }
        callback(result)
      }
    }
  })

  return property
}

//Simulation data production class
const dataWork = {
  thisPoint: {
    x: 100.245989,
    y: 0,
    z: 1000000
  },
  //data start time, seconds seconds
  getTestData: function (date, seconds) {
    const startTime = Cesium.JulianDate.fromIso8601(date) // Flight start time

    const arr = []

    let thisTime
    for (let i = 0; i <= seconds; i += 5) {
      thisTime = Cesium.JulianDate.addSeconds(startTime, i, new Cesium.JulianDate())

      // Generate random coordinates
      this.thisPoint.x += i * 0.01
      this.thisPoint.y += i * 0.01

      arr.push({
        time: Cesium.JulianDate.toIso8601(thisTime),
        x: this.thisPoint.x,
        y: this.thisPoint.y,
        z: this.thisPoint.z
      })
    }
    return arr
  }
}
