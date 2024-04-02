// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 11.135847, lng: 127.745201, alt: 24250944, heading: 53, pitch: -90 },
    clock: {
      currentTime: "2021-01-01T11:55:00Z",
      multiplier: 150 // speed
    },
    cameraController: {
      maximumZoomDistance: 9000000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
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
  map = mapInstance // Record map map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

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
  // Get data
  const property = getDynamicProperty()
  const orientation = new Cesium.VelocityOrientationProperty(property)

  // draw track
  const graphic = new mars3d.graphic.PathEntity({
    position: property,
    orientation,
    style: {
      leadTime: 0,
      resolution: 1,
      materialType: mars3d.MaterialType.PolylineGlow,
      materialOptions: {
        glowPower: 0.1,
        color: Cesium.Color.GREEN
      },
      width: 10
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90
    }
  })
  graphicLayer.addGraphic(graphic)

  // View frustum display
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: property,
    orientation,
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 20,
      angle2: 10,
      pitch: 0,
      roll: 0,
      color: "rgba(110,245,0,0.5)"
    }
  })
  graphicLayer.addGraphic(satelliteSensor)
}

function getDynamicProperty() {
  // This data is the orbit information returned by the backend calculation
  const wxdata = [
    {
      time: "2021-01-01T11:55:00Z",
      x: -134.648939681369,
      y: -16.7002098082909,
      z: 1116015.99646736
    },
    {
      time: "2021-01-01T11:58:20Z",
      x: -136.899721614564,
      y: -5.57109779324382,
      z: 1114660.42260167
    },
    {
      time: "2021-01-01T12:01:40Z",
      x: -139.097755346946,
      y: 5.5661675014342,
      z: 1114652.53771041
    },
    {
      time: "2021-01-01T12:05:00Z",
      x: -141.348494748721,
      y: 16.6953271278176,
      z: 1115992.62270236
    },
    {
      time: "2021-01-01T12:08:20Z",
      x: -143.774623333805,
      y: 27.7998266828718,
      z: 1118477.29262629
    },
    {
      time: "2021-01-01T12:11:40Z",
      x: -146.56364947549,
      y: 38.8612791867078,
      z: 1121731.48352323
    },
    {
      time: "2021-01-01T12:15:00Z",
      x: -150.074587947037,
      y: 49.8538696199919,
      z: 1125266.75027392
    },
    {
      time: "2021-01-01T12:18:20Z",
      x: -155.164247872234,
      y: 60.7243205344318,
      z: 1128555.88185048
    },
    {
      time: "2021-01-01T12:21:40Z",
      x: -164.565295557077,
      y: 71.3021698947674,
      z: 1131111.78312013
    },
    {
      time: "2021-01-01T12:25:00Z",
      x: 168.08311253827,
      y: 80.6216347342535,
      z: 1132558.81749868
    },
    {
      time: "2021-01-01T12:28:20Z",
      x: 90.2490230895946,
      y: 81.5572161531476,
      z: 1132686.79200749
    },
    {
      time: "2021-01-01T12:31:40Z",
      x: 57.1447486006726,
      y: 72.6931112200722,
      z: 1131480.71852334
    },
    {
      time: "2021-01-01T12:35:00Z",
      x: 46.6265974503472,
      y: 62.1897990251119,
      z: 1129122.78290078
    },
    {
      time: "2021-01-01T12:38:20Z",
      x: 41.1892143509244,
      y: 51.3446936437554,
      z: 1125966.29999715
    },
    {
      time: "2021-01-01T12:41:40Z",
      x: 37.5323471372029,
      y: 40.3652635518961,
      z: 1122484.77649625
    }
  ]

  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  for (let z = 0; z < wxdata.length; z++) {
    const item = wxdata[z]

    const thisTime = Cesium.JulianDate.fromIso8601(item.time)
    const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)

    //Add information about each link point, arrival time and coordinate location
    property.addSample(thisTime, position)
  }
  property.setInterpolationOptions({
    interpolationDegree: 2,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  })

  return property
}
