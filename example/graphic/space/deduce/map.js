// import * as mars3d from "mars3d"
// import "./index.css"

var map // mars3d.Map three-dimensional map object
var graphicLayer
var lineLayer
var satelliteLayer


/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
var mapOptions = {
  scene: {
    center: { lat: 42.126999, lng: 98.685654, alt: 16560060, heading: 5.6, pitch: -89 }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true // Whether to display the timeline control
  }
}

function onMounted(mapInstance) {
  map = mapInstance // Record map map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Line vector data layer
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)

  // Satellite vector data layer
  satelliteLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(satelliteLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
const posArr = [
  {
    name: "China Resources Satellite Application Center",
    pos: [116.240032464881, 40.0797910765005, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },

  {
    name: "Ministry of Natural Resources",
    pos: [116.364862, 39.922346, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "Ministry of Ecology and Environment",
    pos: [116.352146287861, 39.9315519489232, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "Ministry of Agriculture and Rural Affairs",
    pos: [116.457555, 39.932756, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "Ministry of Water Resources",
    pos: [116.352155, 39.884728, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "National Development and Reform Commission",
    pos: [116.331546, 39.912456, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },

  {
    name: "Ministry of Housing and Urban-Rural Development",
    pos: [116.326609, 39.930379, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "National Forestry and Grassland Administration",
    pos: [116.419465, 39.954384, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "Ministry of Transport",
    pos: [116.419109, 39.908169, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "China Earthquake Administration",
    pos: [116.284736, 39.906494, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "Xi'an Satellite Measurement and Control Center",
    pos: [109.023912, 34.250872, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "Institute of Remote Sensing and Digital Earth, Chinese Academy of Sciences",
    pos: [116.276306422658, 40.0706289383518, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },

  {
    name: "Miyun Station",
    pos: [116.858716105082, 40.452385253501, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "Kashgar Station",
    pos: [75.93105, 39.505111, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "Arctic Station",
    pos: [20.186391, 67.8537518, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "Sanya Station",
    pos: [109.311472012774, 18.312718489265, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "Kunming Station",
    pos: [102.372779, 25.532377, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  }
]

//Initialize scene
function initScene() {
  for (let index = 0; index < posArr.length; index++) {
    const scenePos = posArr[index]
    //Add model
    const graphic = new mars3d.graphic.ModelEntity({
      name: "Ground station model",
      position: scenePos.pos,
      style: {
        url: scenePos.model,
        scale: 1,
        minimumPixelSize: 40,
        clampToGround: true,
        label: {
          text: scenePos.name,
          font_size: 40,
          scale: 0.5,
          font_family: "楷体",
          color: "#e5fcff",
          outline: true,
          outlineColor: "#3565a3",
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          visibleDepth: false
        }
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}

//Demand acceptance

function acceptance() {
  satelliteLayer.clear() // Clear satellite data
  map.setCameraView(
    { lat: 39.869944, lng: 115.884115, alt: 17452.2, heading: 65, pitch: -28.3 },
    {
      complete: () => accepAction()
    }
  )
}

function accepAction() {
  // Wire
  for (let i = 1; i <= 9; i++) {
    const startPoint = Cesium.Cartesian3.fromDegrees(posArr[i].pos[0], posArr[i].pos[1])
    const endPoint = Cesium.Cartesian3.fromDegrees(116.240032464881, 40.0797910765005)
    const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 2000, 50) // Calculate curve points
    const graphic = new mars3d.graphic.PolylineEntity({
      positions,
      style: {
        width: 4,
        materialType: mars3d.MaterialType.LineFlowColor,
        materialOptions: {
          color: "#ff0000",
          speed: 8,
          percent: 0.15,
          alpha: 0.2
        }
      }
    })
    lineLayer.addGraphic(graphic)
  }
}

//Task arrangement
function task() {
  satelliteLayer.clear() // Clear satellite data
  const cameraView = { lat: 40.051583, lng: 116.238469, alt: 1672.4, heading: 7.8, pitch: -27.7 }
  const html = `<div class="info">
              <div class="working title">Task arrangement</div>
               <h3 style="padding:0 10px">Padding...</h3>
              <br><p style="padding:0 10px; line-height:30px;">China Resources Satellite Application Center receives task requests from various departments, and then performs data processing to analyze and organize the tasks, and integrates appropriate solutions. . . . </p>
           </div>`

  addDivGraphic(cameraView, html)
}

// Note on task
function startTask() {
  map.setCameraView({ lat: 23.644034, lng: 66.747739, alt: 4865177.6, heading: 358, pitch: -63 }, { complete: () => addTask() })
}

function addTask() {
  const weixin = addSatelliteGrahic()
  satelliteLayer.addGraphic(weixin)
  const propertyQC = getSampledPositionProperty([[75.93105, 39.505111, 0]])

  // Cone tracking body (dynamic position=>dynamic targetPosition)
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: propertyQC,
    targetPosition: weixin.property,
    style: {
      angle: 5, // half-court angle
      // Custom diffuse ripple texture
      materialType: mars3d.MaterialType.CylinderWave,
      materialOptions: {
        color: "#ffff00",
        repeat: 30.0
      }
    }
  })
  satelliteLayer.addGraphic(coneTrack)

  setTimeout(() => {
    satelliteLayer.removeGraphic(coneTrack)
  }, 5000)
}

// satellite observation
function satelliteLook() {
  map.setCameraView({ lat: 30.560391, lng: 58.246962, alt: 4113469.4, heading: 358, pitch: -63 }, { complete: () => lookAction() })
}

function lookAction() {
  const weixin = addSatelliteGrahic()

  // View frustum display
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: weixin.property,
    orientation: new Cesium.VelocityOrientationProperty(weixin.property),
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 20,
      angle2: 10,
      color: "rgba(110,245,0,0.5)"
    }
  })
  satelliteLayer.addGraphic(satelliteSensor)

  setTimeout(() => {
    satelliteLayer.removeGraphic(satelliteSensor)
  }, 10000)
}

//Data reception
function sendDataAction() {
  map.setCameraView({ lat: 23.644034, lng: 66.747739, alt: 4865177.6, heading: 358, pitch: -63 }, { complete: () => sendData() })
}

function sendData() {
  const weixin = addSatelliteGrahic()
  const propertyQC = getSampledPositionProperty([[75.93105, 39.505111, 0]])

  // Cone tracking body (dynamic position=>dynamic targetPosition)
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: weixin.property,
    targetPosition: propertyQC,
    style: {
      angle: 5, // half-court angle
      // Custom diffuse ripple texture
      materialType: mars3d.MaterialType.CylinderWave,
      materialOptions: {
        color: "#ffff00",
        repeat: 30.0
      },
      faceForward: false, // When the normal direction of the drawn triangular patch cannot face the viewpoint, the normal direction will be automatically flipped to avoid problems such as blackening after normal calculation.
      closed: true // Whether it is a closed body, what is actually performed is whether to perform back cropping
    }
  })
  satelliteLayer.addGraphic(coneTrack)

  setTimeout(() => {
    satelliteLayer.removeGraphic(coneTrack)
  }, 5000)
}

// data transmission
function transferringData() {
  satelliteLayer.clear() // Clear satellite data

  // scene perspective
  map.setCameraView({ lat: 39.647456, lng: 116.234526, alt: 61145.4, heading: 17.5, pitch: -42.8 }, { complete: () => transferringAction() })
}

function transferringAction() {
  const startPoint = Cesium.Cartesian3.fromDegrees(116.858716105082, 40.452385253501)
  const endPoint = Cesium.Cartesian3.fromDegrees(116.240032464881, 40.0797910765005)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 2000, 50) // Calculate curve points
  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      width: 4,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#ff0000",
        speed: 6,
        percent: 0.15,
        alpha: 0.2
      }
    }
  })
  lineLayer.addGraphic(graphic)
}

// product production
function production() {
  const cameraView = { lat: 40.070515, lng: 116.23878, alt: 2213.5, heading: 3, pitch: -68.8 }

  const html = ` <div class="info">
  <div class="working title">Product production</div>
  <h3 style="padding:0 10px">Product in production...</h3>
  <br><p style="padding:0 10px;line-height:30px;">China Resources Satellite Application Center receives the information transmitted from Miyun Station and begins to process the data and generate products...</p>
</div>`
  addDivGraphic(cameraView, html)
}

// product distribution
function distribution() {
  clearGraphicLayer()
  map.setCameraView({ lat: 39.869944, lng: 115.884115, alt: 17452.2, heading: 65, pitch: -28.3 }) // Change camera perspective
  // Wire
  for (let i = 1; i <= 9; i++) {
    const startPoint = Cesium.Cartesian3.fromDegrees(116.240032464881, 40.0797910765005)
    const endPoint = Cesium.Cartesian3.fromDegrees(posArr[i].pos[0], posArr[i].pos[1])
    const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 2000, 50) // Calculate curve points
    const graphic = new mars3d.graphic.PolylineEntity({
      positions,
      style: {
        width: 4,
        materialType: mars3d.MaterialType.LineFlowColor,
        materialOptions: {
          color: "#ff0000",
          speed: 6,
          percent: 0.15,
          alpha: 0.2
        }
      }
    })
    lineLayer.addGraphic(graphic)
  }
}

function addDivGraphic(cameraView, divhtml) {
  clearGraphicLayer()
  map.setCameraView(cameraView, {
    complete: () => {
      const divGraphic = new mars3d.graphic.DivGraphic({
        position: [116.240032464881, 40.0797910765005],
        style: {
          html: divhtml,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // Display according to viewing distance
          scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 200000, 0.2),
          clampToGround: true
        }
      })
      graphicLayer.addGraphic(divGraphic)
      setTimeout(() => {
        graphicLayer.removeGraphic(divGraphic)
      }, 3000)
    }
  })
}

let weixin
function addSatelliteGrahic() {
  if (!weixin) {
    map.clock.currentTime = Cesium.JulianDate.fromIso8601("2019-07-15T18:48:48.36721000009856652Z")
    map.clock.multiplier = 2 // speed
    weixin = new mars3d.graphic.Satellite({
      name: "GF-1",
      tle1: "1 39150U 13018A   19351.75901006  .00000041  00000-0  13118-4 0  9991",
      tle2: "2 39150  97.8876  68.0565 0018875 352.9713   7.1223 14.76542863358056",
      model: {
        url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
        scale: 1,
        minimumPixelSize: 90
      },
      label: {
        text: "GF-1",
        color: "#ffffff"
      },
      path: {
        color: "#00ff00",
        opacity: 0.5,
        width: 1
      }
    })

    satelliteLayer.addGraphic(weixin)
  }
  // target satellite
  return weixin
}

// Calculate the SampledPositionProperty trajectory of the demonstration
function getSampledPositionProperty(points) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const start = map.clock.currentTime
  const positions = mars3d.LngLatArray.toCartesians(points)
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, i * 20, new Cesium.JulianDate())
    const position = positions[i]
    property.addSample(time, position)
  }
  return property
}

function clearGraphicLayer() {
  if (lineLayer) {
    lineLayer.clear() // Line vector data
  }

  if (satelliteLayer) {
    satelliteLayer.clear() // Clear satellite data
  }
}

function clearAll() {
  lineLayer.clear() // Line vector data
  satelliteLayer.clear() // Clear satellite data
  graphicLayer.clear()
}
