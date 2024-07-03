// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.178797, lng: 118.183551, alt: 210053, heading: 353, pitch: -49 },
    clock: {
      startTime: "2017/08/25 08:00:00",
      stopTime: "2017/08/25 08:01:30"
    }
  },
  control: {
    animation: true, // Whether to create animation widget, instrument in the lower left corner
    timeline: true // Whether to display the timeline control
  }
}

var eventTarget = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(map.clock.startTime, map.clock.stopTime)
  }

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // static data
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/exercise-fixed.json" }).then(function (json) {
    graphicLayer.loadGeoJSON(json)
  })

  // dynamic data
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/exercise-dynamic.json" }).then(function (arrData) {
    for (let i = 0; i < arrData.length; i++) {
      const data = arrData[i]

      //Dynamic coordinate properties
      const property = new Cesium.SampledPositionProperty()
      data.path.forEach((item, index) => {
        const startTime = item.time
        let tempTime = Cesium.JulianDate.fromDate(new Date(startTime))
        tempTime = Cesium.JulianDate.addSeconds(tempTime, 0, new Cesium.JulianDate())
        property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(...item.position))
      })

      switch (data.type) {
        case "plane":
          addPlane(property, data.team)
          break
        case "arrow":
          addAttackArrow(property, data.team)
          break
        case "missile":
          addMissile(property, data.team)
          break
        case "fire":
          addFire(property)
          break
        default:
          break
      }
    }
  })

  addWallPrimitive(
    [
      [118.67566, 32.349367],
      [119.291568, 31.835385],
      [118.374952, 31.373451]
    ],
    "#4755C9"
  )

  addWallPrimitive(
    [
      [116.44771, 31.324743],
      [116.553874, 32.231496],
      [117.649474, 32.017338]
    ],
    "#FF0004"
  )

  setMapView(22, () => {
    map.setCameraView({ lat: 31.252058, lng: 117.988745, alt: 95026, heading: 340, pitch: -49 })
  })
  setMapView(55, () => {
    globalMsg("Red team wins")
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addWallPrimitive(positions, color) {
  const Square = new mars3d.graphic.WallPrimitive({
    positions: mars3d.graphic.GatheringPlace.getOutlinePositions(positions),
    style: {
      diffHeight: 5000,
      closure: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/fence.png",
        color,
        speed: 10, // Speed, recommended value range 1-100
        axisY: true
      }
    }
  })
  graphicLayer.addGraphic(Square)
}

// [Dynamic] Aircraft flight route
function addPlane(property, team) {
  const feijiPath = new mars3d.graphic.PathEntity({
    position: property,
    style: {
      width: 6,
      leadTime: 0, // The route ahead is not displayed
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: getTeamColor(team),
        repeat: new Cesium.Cartesian2(2.0, 1.0),
        image: "img/textures/line-gradual.png",
        speed: 15
      }
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.01,
      minimumPixelSize: 50,
      show: true
    },
    billboard: {
      show: false,
      image: "img/icon/plane_blue.png",
      color: getTeamColor(team),
      scale: 0.2,
      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 90000,
      distanceDisplayCondition_far: Number.MAX_VALUE
    }
  })
  graphicLayer.addGraphic(feijiPath)
}

// [Dynamic] Attack arrow label
function addAttackArrow(property, team) {
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const graphicTriangle = new mars3d.graphic.AttackArrowPW({
    positions: new Cesium.CallbackProperty(function (time) {
      const result = mars3d.PointUtil.getPropertyIndex(property, time)
      const values = property._property._values.slice(0, result.index * 3)
      const positions = Cesium.Cartesian3.unpackArray(values)

      if (result.position) {
        return positions.concat(result.position)
      } else {
        return positions
      }
    }, false),
    style: {
      color: getTeamColor(team),
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff"
      // clampToGround: true,
    }
  })
  graphicLayer.addGraphic(graphicTriangle)
}

// [Dynamic] Missile flight path
function addMissile(property, team) {
  let missileImage
  if (team === "red") {
    missileImage = "img/icon/missile_red.png"
  } else {
    missileImage = "img/icon/missile_blue.png"
  }

  const graphic = new mars3d.graphic.BillboardEntity({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      image: missileImage,
      scale: 0.5,
      alignedAxis: new Cesium.VelocityVectorProperty(property, true)
    },
    hasEdit: false
  })
  graphicLayer.addGraphic(graphic)
}

// [Dynamic] Detention after missile explosion
function addFire(property) {
  const fireImage = new mars3d.graphic.BillboardEntity({
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    style: {
      image: "img/icon/fire.png",
      scale: 1.0,
      alignedAxis: new Cesium.VelocityVectorProperty(property, true)
    },
    hasEdit: false
  })
  graphicLayer.addGraphic(fireImage)
}

function getTeamColor(team) {
  if (team === "red") {
    return "#FF0000"
  } else {
    return "#0099FF"
  }
}

let num
function setMapView(time, callback) {
  map.on(mars3d.EventType.clockTick, function (event) {
    if (new Date(event.currentTime).getMinutes() === 0 && new Date(event.currentTime).getSeconds() === time) {
      clearTimeout(num)
      num = setTimeout(() => {
        callback()
      }, 2000)
    }
  })
}
