// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let sightline

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.715648, lng: 116.300527, alt: 10727, heading: 3, pitch: -25 }
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

  globalNotify(
    "Known Issue Tips",
    `(1) Relies on the underlying interface of cesium, which is not accurate enough in a few cases
(2) The points to be analyzed can only be analyzed if they are within the field of view.
  )

  sightline = new mars3d.thing.Sightline({
    visibleColor: new Cesium.Color(0, 1, 0, 0.4),
    hiddenColor: new Cesium.Color(1, 0, 0, 0.4)
    // depthFailColor: Cesium.Color.fromCssColorString("#db2c8f"),
  })
  map.addThing(sightline)

  sightline.on(mars3d.EventType.end, function (e) {
    console.log("Analysis completed", e)
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function drawCircle() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    },
    success: function (graphic) {
      // Callback after successful drawing

      let center = graphic.positionShow
      center = mars3d.PointUtil.addPositionsHeight(center, 1.5) // Add factors such as the person's height and raise it slightly

      const targetPoints = graphic.getOutlinePositions(false, 45)

      map.graphicLayer.clear()
      map.scene.globe.depthTestAgainstTerrain = true

      for (let i = 0; i < targetPoints.length; i++) {
        let targetPoint = targetPoints[i]
        targetPoint = mars3d.PointUtil.getSurfacePosition(map.scene, targetPoint)
        sightline.add(center, targetPoint)
      }

      createPoint(center, true)

      map.scene.globe.depthTestAgainstTerrain = false
    }
  })
}

function drawLine() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polyline",
    maxPointNum: 2,
    style: {
      color: "#55ff33",
      width: 3
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()
      map.scene.globe.depthTestAgainstTerrain = true

      const center = positions[0]
      const targetPoint = positions[1]
      sightline.add(center, targetPoint, { offsetHeight: 1.5 }) // 1.5 is to add factors such as the person's height, which is slightly higher

      createPoint(center, true)
      createPoint(targetPoint, false)

      map.scene.globe.depthTestAgainstTerrain = false
    }
  })
}

function clearAll() {
  sightline.clear()
  map.graphicLayer.clear()
}

/**
 * Create points after successful drawing
 *
 * @param {Array} position coordinate point
 * @param {boolean} isFirst point text
 * @return {object} Returns the pixel Entity object
 */
function createPoint(position, isFirst) {
  const graphic = new mars3d.graphic.PointEntity({
    position,
    style: {
      color: Cesium.Color.fromCssColorString("#3388ff"),
      pixelSize: 6,
      outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
      outlineWidth: 2,
      scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
      label: {
        text: isFirst ? "Observation position" : "Target point",
        font_size: 17,
        font_family: "楷体",
        color: Cesium.Color.AZURE,
        outline: true,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -20), // offset
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2000000)
      }
    }
  })
  map.graphicLayer.addGraphic(graphic)

  return graphic
}
