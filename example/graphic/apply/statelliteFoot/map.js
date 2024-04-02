// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    // The parameters here will overwrite the corresponding configuration in config.json
    center: { lat: 40, lng: 111.833884, alt: 20000000, heading: 0, pitch: -90 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 300000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    }
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

  showLoading()

  const czml = Cesium.CzmlDataSource.load("//data.mars3d.cn/file/czml/satellite-one.czml")
  czml
    .then(function (dataSource) {
      hideLoading()

      map.dataSources.add(dataSource)

      const satelliteEntity = dataSource.entities.values[0]

      const swathWidth = swathWidthDict[satelliteEntity.id]
      satelliteFoot.start(satelliteEntity, swathWidth)
    })
    .catch(function (error) {
      globalAlert(error, "Error loading data")
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Configurable for multiple satellites [satellite ground projection circle radius, footprint width]
const swathWidthDict = {
  "Satellite/CBERS 4": 650000.0
}

// Orbit prediction for earth observation, including the function of drawing the footprint of satellites to the earth.
const satelliteFoot = {
  start: function (entity, instrumentFOV) {
    if (!instrumentFOV) {
      // default value;
      instrumentFOV = 2000 * 1000
    }

    const secondMultiplier = instrumentFOV / 250000.0 // How many kilometers apart will the footprints be displayed.
    const intervalBetweenFootPrints = 40 * secondMultiplier // setInterval interval foot print duration
    const numberOfFootPrintsAtAtime = parseInt(90 / Math.ceil(secondMultiplier)) * 5 // Keep the number of footprints

    const point = mars3d.LngLatPoint.fromCartesian(entity.position, map.clock.currentTime)
    this.drawOneFoot(point, instrumentFOV)

    let timeLast = map.clock.currentTime.secondsOfDay + intervalBetweenFootPrints

    map.on(mars3d.EventType.clockTick, (event) => {
      const sxTimes = Math.abs(map.clock.currentTime.secondsOfDay - timeLast) // remaining time

      if (sxTimes < 1 || sxTimes > intervalBetweenFootPrints) {
        timeLast = map.clock.currentTime.secondsOfDay + intervalBetweenFootPrints

        if (graphicLayer.length >= numberOfFootPrintsAtAtime) {
          graphicLayer.clear()
        }

        const point = mars3d.LngLatPoint.fromCartesian(entity.position, map.clock.currentTime)
        this.drawOneFoot(point, instrumentFOV)
      }
    })
  },

  // draw a footprint
  drawOneFoot: function (point, instrumentFOV) {
    if (!point || !point.valid()) {
      return
    }

    //Vertical line from satellite to ground
    this._drawLineGroundToSatellite(point)

    // Projection cone
    this._drawInstrumentFootPrintSwathWidth(instrumentFOV, point)

    // Draw a visible footprint ellipse on the Earth's surface
    this._drawVisibleFootPrint(point)
  },

  // The vertical line from the satellite to the ground, point: the position of the satellite in the sky
  _drawLineGroundToSatellite: function (point) {
    const groundPoint = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, 0.0)

    const point1 = new mars3d.graphic.PointPrimitive({
      position: point,
      style: {
        pixelSize: 2,
        color: Cesium.Color.RED
      }
    })
    graphicLayer.addGraphic(point1)

    const point2 = new mars3d.graphic.PointPrimitive({
      position: groundPoint,
      style: {
        pixelSize: 2,
        color: Cesium.Color.RED
      }
    })
    graphicLayer.addGraphic(point2)

    // const primitiveLine = new mars3d.graphic.PolylinePrimitive({
    //   positions: [point, groundPoint],
    //   style: {
    //     width: 1,
    //     color: Cesium.Color.YELLOW
    //   }
    // })
    // graphicLayer.addGraphic(primitiveLine)
  },
  // Projection cone
  _drawInstrumentFootPrintSwathWidth: function (instrumentFOV, point) {
    const graphic = new mars3d.graphic.CylinderPrimitive({
      name: "View frustum",
      position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt / 2),
      style: {
        length: point.alt,
        topRadius: 0.0,
        bottomRadius: instrumentFOV,
        color: Cesium.Color.GREEN.withAlpha(0.3),
        outline: true,
        outlineColor: Cesium.Color.RED.withAlpha(0.5)
      }
    })
    graphicLayer.addGraphic(graphic)
  },
  // Draw a visible footprint ellipse on the Earth's surface (red outer circle line)
  _drawVisibleFootPrint: function (point) {
    const groundPoint = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, 0.0)

    const radiusOfEarth = Cesium.Cartesian3.distance(new Cesium.Cartesian3(0, 0, 0), groundPoint)
    const satToOrignEarth = radiusOfEarth + point.alt // point to origin of earth
    const groundPointToSatPointToTangentAngle = Cesium.Math.toDegrees(Math.asin(radiusOfEarth / satToOrignEarth))
    const groundPointToOriginToTangentAngle = 90.0 - groundPointToSatPointToTangentAngle
    const distanceAlongGround = Cesium.Math.TWO_PI * radiusOfEarth * (groundPointToOriginToTangentAngle / 360.0)

    const graphic = new mars3d.graphic.CirclePrimitive({
      name: "Visible satellite range (45 degrees)",
      position: groundPoint,
      style: {
        radius: distanceAlongGround,
        color: "#ff0000",
        opacity: 0.1,
        outline: true,
        outlineColor: "#ff0000"
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}
