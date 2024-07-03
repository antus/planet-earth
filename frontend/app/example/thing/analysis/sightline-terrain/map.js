// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let sightline

let positionSXT
let positionDM
let positionJD //Intersection point with the ground

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.841574, lng: 116.18792, alt: 6828, heading: 215, pitch: -28 }
  }
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  creatTestData()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Create test data
function creatTestData() {
  sightline = new mars3d.thing.Sightline()
  map.addThing(sightline)

  sightline.on(mars3d.EventType.end, function (e) {
    positionJD = e.position
  })

  // Test Data
  positionSXT = Cesium.Cartesian3.fromDegrees(116.144485, 30.744249, 1060)

  const graphicSXT = new mars3d.graphic.PointEntity({
    position: positionSXT,
    style: {
      color: "#ffff00",
      pixelSize: 8,
      label: {
        text: "Camera",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    }
  })
  map.graphicLayer.addGraphic(graphicSXT)

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // ground point
  const TargetGraphic = new mars3d.graphic.PointEntity({
    position: new Cesium.CallbackProperty(() => {
      return positionDM
    }, false),
    style: {
      color: "#0000ff",
      pixelSize: 7,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      label: {
        text: "Target reference point",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    }
  })
  graphicLayer.addGraphic(TargetGraphic)

  const graphicJD = new mars3d.graphic.PointEntity({
    position: new Cesium.CallbackProperty(function (time) {
      return positionJD
    }, false),
    style: {
      color: "#00ff00",
      pixelSize: 8,
      outlineColor: "#ffffff",
      outlineWidth: 2
    }
  })
  graphicJD.bindTooltip("Intersection with terrain ground")
  graphicLayer.addGraphic(graphicJD)

  //The line connecting the ground points towards which the camera is facing
  const graphicLine = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      if (!positionSXT || !positionDM || positionJD != null) {
        return []
      }
      return [positionSXT, positionDM]
    }, false),
    style: {
      width: 2,
      arcType: Cesium.ArcType.NONE,
      color: "#ffff00"
    }
  })
  graphicLayer.addGraphic(graphicLine)

  map.on(mars3d.EventType.load, function (event) {
    analysisIntersection()
  })
}

// Calculation and ground focus
function analysisIntersection() {
  if (!positionSXT || !positionDM) {
    return []
  }

  sightline.clear()
  sightline.addAsync(positionSXT, positionDM)
}

//Set camera position
function sePoint() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 8,
      color: "#ffff00",
      label: {
        text: "Camera",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    },
    success: function (graphic) {
      positionSXT = graphic.positionShow
      positionSXT = mars3d.PointUtil.addPositionsHeight(positionSXT, 5.0) // Increase the height of the pole
    }
  })
}

function testTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
  if (val) {
    globalMsg("When depth monitoring is turned on, you will not be able to see objects underground or obscured by terrain")
  }
}

//Update model data
function updateModel(params) {
  if (!positionSXT) {
    return
  }

  const hpr = new Cesium.HeadingPitchRoll(
    Cesium.Math.toRadians(params.heading),
    Cesium.Math.toRadians(params.pitch),
    Cesium.Math.toRadians(params.roll)
  )
  positionDM = mars3d.PointUtil.getRayEarthPosition(positionSXT, hpr, true, map.scene.globe.ellipsoid)

  if (!positionDM) {
    // When there is no intersection with the ground
    positionDM = mars3d.PointUtil.getPositionByHprAndLen(positionSXT, hpr, 5000)
  }

  sightline.clear()

  positionJD = null
}
