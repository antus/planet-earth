// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
let pathEntity = null

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 32.550222, lng: 117.366824, alt: 2696, heading: 273, pitch: -67 }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true // Whether to display the timeline control
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/flypath.json" })
    .then(function (res) {
      initPath(res)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Change perspective tracking, top and side
function viewAircraft() {
  map.trackedEntity = pathEntity.entity

  pathEntity.flyToPoint({
    radius: 500, // distance from the target point
    heading: 40,
    pitch: -50,
    duration: 0.01
  })
}
function viewTopDown() {
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity.positionShow, {
    radius: 2000,
    heading: -90,
    pitch: -89
  })
}
function viewSide() {
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity.positionShow, {
    radius: 3000,
    heading: -90,
    pitch: -25
  })
}

function initPath(data) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  let start
  let stop
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    const lng = Number(item.x.toFixed(6)) // Longitude
    const lat = Number(item.y.toFixed(6)) // Latitude
    const height = item.z // height
    const time = item.time // time

    let position = null
    if (lng && lat) {
      position = Cesium.Cartesian3.fromDegrees(lng, lat, height)
    }
    let juliaDate = null
    if (time) {
      juliaDate = Cesium.JulianDate.fromIso8601(time)
    }
    if (position && juliaDate) {
      property.addSample(juliaDate, position)
    }

    if (i === 0) {
      start = juliaDate
    } else if (i === len - 1) {
      stop = juliaDate
    }

    const graphic = new mars3d.graphic.PointPrimitive({
      position,
      style: {
        pixelSize: 4,
        color: "#cccccc"
      },
      popup: "Number:" + item.id + "<br/>Time:" + time
    })
    graphicLayer.addGraphic(graphic)
  }

  //Set clock properties
  map.clock.startTime = start.clone()
  map.clock.stopTime = stop.clone()
  map.clock.currentTime = start.clone()
  map.clock.clockRange = Cesium.ClockRange.LOOP_STOP
  map.clock.multiplier = 5

  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(start, stop)
  }

  //Create path object
  pathEntity = new mars3d.graphic.PathEntity({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      resolution: 1,
      leadTime: 0,
      trailTime: 3600,
      color: "#ff0000",
      width: 3
    },
    label: {
      text: "Plane No. 1",
      font_size: 19,
      font_family: "楷体",
      color: Cesium.Color.AZURE,
      outline: true,
      visibleDepth: false,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(10, -25) // offset
    },
    // billboard: {
    //   image: "img/marker/lace-blue.png",
    //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //   visibleDepth: false
    // },
    model: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 0.1,
      minimumPixelSize: 20
    },
    popup: "Flying No. 1"
  })
  graphicLayer.addGraphic(pathEntity)

  //Cone tracking body
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: property,
    style: {
      length: 100,
      angle: 12, // half-court angle
      color: "#ff0000",
      opacity: 0.5
    }
  })
  graphicLayer.addGraphic(coneTrack)
}
