// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let routeLayer // Vector data layer
let gaodeRoute // Gaode path planning

// Current page business related
let startGraphic, endGraphic

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.797919, lng: 117.281329, alt: 36236, heading: 358, pitch: -81 }
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

  //Create vector data layer
  routeLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(routeLayer)

  gaodeRoute = new mars3d.query.GaodeRoute({})
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Start analysis button
function btnAnalyse(type) {
  if (!startGraphic || !endGraphic) {
    globalMsg("Please set the starting point and end point")
    return
  }
  queryRoute(type)
}

// clear button
function removeAll() {
  if (startGraphic) {
    startGraphic.remove()
    startGraphic = null
  }
  if (endGraphic) {
    endGraphic.remove()
    endGraphic = null
  }

  routeLayer.clear()
}

/**
 * Start button
 *
 * @export
 * @param {number} type Route query in different ways
 * @returns {string}
 */
function startPoint(type) {
  if (startGraphic) {
    startGraphic.remove()
    startGraphic = null
  }

  return map.graphicLayer
    .startDraw({
      type: "billboard",
      style: {
        image: "img/marker/route-start.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    })
    .then((graphic) => {
      startGraphic = graphic
      const point = graphic.point
      point.format()
      // Trigger custom events and change the value of the input box
      queryRoute(type)

      return point.lng + "," + point.lat
    })
}

/**
 * End button
 *
 * @export
 * @param {number} type Route query in different ways
 * @returns {string}
 */
function endPoint(type) {
  if (endGraphic) {
    endGraphic.remove()
    endGraphic = null
  }

  return map.graphicLayer
    .startDraw({
      type: "billboard",
      style: {
        image: "img/marker/route-end.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    })
    .then((graphic) => {
      endGraphic = graphic
      const point = graphic.point
      point.format()
      queryRoute(type)

      return point.lng + "," + point.lat
    })
}

function queryRoute(type) {
  if (!startGraphic || !endGraphic) {
    return
  }

  routeLayer.clear()
  showLoading()

  gaodeRoute.query({
    type: Number(type),
    points: [startGraphic.coordinate, endGraphic.coordinate],
    success: function (data) {
      hideLoading()
      const firstItem = data.paths[0]
      const points = firstItem.points
      if (!points || points.length < 1) {
        return
      }

      const time = mars3d.Util.formatTime(firstItem.allDuration)
      const distance = mars3d.MeasureUtil.formatDistance(firstItem.allDistance)
      const html = "<div>Total distance:" + distance + "<br/>Time required:" + time + "</div>"

      const graphic = new mars3d.graphic.PolylineEntity({
        positions: points,
        style: {
          clampToGround: true,
          material: Cesium.Color.AQUA.withAlpha(0.8),
          width: 5
        },
        attr: firstItem,
        popup: html
      })
      routeLayer.addGraphic(graphic)

      const allTime = mars3d.Util.formatTime(firstItem.allDuration)
      const allDistance = mars3d.MeasureUtil.formatDistance(firstItem.allDistance)
      let dhHtml = ""
      for (let i = 0; i < firstItem.steps.length; i++) {
        const item = firstItem.steps[i]
        dhHtml += item.instruction + "；"
      }

      eventTarget.fire("analyse", { allTime, allDistance, dhHtml })
    },
    error: function (msg) {
      hideLoading()
      globalAlert(msg)
    }
  })
}

// Click to save GeoJSON
function saveGeoJSON() {
  if (routeLayer.length === 0) {
    globalMsg("No data is currently marked, no need to save!")
    return
  }
  const geojson = routeLayer.toGeoJSON()
  mars3d.Util.downloadFile("Navigation path.json", JSON.stringify(geojson))
}
