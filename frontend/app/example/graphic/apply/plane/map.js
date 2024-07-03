// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.scene.center = { lat: 31.265081, lng: 116.103599, alt: 6178, heading: 348, pitch: -54 }
  delete option.terrain
  return option
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

  //Flight area boundary line
  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [116.069898, 31.303655],
      [116.098708, 31.322126],
      [116.108063, 31.311256],
      [116.079317, 31.292959],
      [116.069898, 31.303655]
    ],
    style: {
      color: "#ffff00",
      outline: true,
      outlineWidth: 3,
      outlineColor: "#00ff00"
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.startFlicker({
    time: 3, // Flashing duration (seconds)
    onEnd: function () {
      // Automatically remove after completion
      graphic.style = { fill: false }
      startRoam()
    }
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const arrColor = [new Cesium.Color(1.0, 0.0, 0.0, 0.3), new Cesium.Color(0.0, 1.0, 0, 0.3), new Cesium.Color(0.0, 0.0, 1, 0.3)]

function startRoam() {
  // Perspective switching (step-by-step execution)
  map.setCameraViewList([
    {
      lat: 31.261244,
      lng: 116.087805,
      alt: 4571.19,
      heading: 2.3,
      pitch: -45.4,
      roll: 357.6,
      stop: 4
    },
    {
      lat: 31.299649,
      lng: 116.129938,
      alt: 2725.83,
      heading: 290.2,
      pitch: -34,
      roll: 358.1,
      stop: 4
    },
    {
      lat: 31.288891,
      lng: 116.106146,
      alt: 4268.26,
      heading: 325.4,
      pitch: -55.7,
      roll: 357.5
    }
  ])

  // flight route
  const fixedRoute = new mars3d.graphic.FixedRoute({
    name: "Drone aerial photography",
    speed: 600,
    positions: [
      [116.077374, 31.294215, 1000],
      [116.107153, 31.312963, 1000],
      [116.103816, 31.316868, 1000],
      [116.074092, 31.297972, 1000],
      [116.07068, 31.301908, 1000],
      [116.100465, 31.320893, 1000]
    ],
    autoStop: true,
    model: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 0.02,
      minimumPixelSize: 50
    },
    path: {
      color: "#ffff00",
      width: 3,
      leadTime: 0
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  fixedRoute.start()

  let frameNum = -1
  let graphicFrustum

  fixedRoute.on(mars3d.EventType.change, function () {
    if (!map.clock.shouldAnimate) {
      return
    }

    //Points in the current route
    const currIndex = fixedRoute.currIndex
    if (currIndex % 2 === 1) {
      return
    }

    frameNum = ++frameNum % 100 //Adjust the interval between shots
    if (frameNum !== 0) {
      if (frameNum === 10 && graphicFrustum) {
        graphicLayer.removeGraphic(graphicFrustum)
        graphicFrustum = null
      }
      return
    }

    //Add a four-sided pyramid line
    graphicFrustum = new mars3d.graphic.FrustumPrimitive({
      position: fixedRoute.position,
      style: {
        angle: 15,
        angle2: 12,
        heading: fixedRoute.heading,
        pitch: -180, // top view

        length: Cesium.Cartographic.fromCartesian(fixedRoute.position).height,
        fill: false,
        outline: true,
        outlineColor: "#ffffff",
        outlineOpacity: 1.0
      },
      asynchronous: false,
      flat: true
    })
    graphicLayer.addGraphic(graphicFrustum)

    // 4 vertex coordinates of the ground
    const positions = graphicFrustum.getRayEarthPositions()

    //Add ground rectangle
    const graphic = new mars3d.graphic.PolygonPrimitive({
      positions,
      style: {
        color: arrColor[graphicLayer.length % arrColor.length],
        // image: "img/tietu/gugong.jpg",
        // stRotationDegree: fixedRoute.model.heading,
        zIndex: graphicLayer.length
      }
    })
    graphicLayer.addGraphic(graphic)
  })
}
