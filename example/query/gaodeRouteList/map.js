// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let routeLayer
let gaodeRoute

// Current page business related
let startGraphic
let endPointArr
let poiLayer
let queryGaodePOI

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.812769, lng: 117.250545, alt: 18500, heading: 358, pitch: -81 }
  }
}

// Custom event
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

  queryGaodePOI = new mars3d.query.GaodePOI({})

  //Create vector data layer
  poiLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(poiLayer)

  poiLayer.bindPopup(function (event) {
    const item = event.graphic.attr

    let inHtml = '<div class="mars3d-template-titile">' + item.name + '</div><div class="mars3d-template-content" >'

    const type = String(item.type).trim()
    if (type) {
      inHtml += "<div><label>Category</label>" + type + "</div>"
    }

    const xzqh = String(item.xzqh).trim()
    if (xzqh) {
      inHtml += "<div><label>area</label>" + xzqh + "</div>"
    }

    const tel = String(item.tel).trim()
    if (tel) {
      inHtml += "<div><label>Telephone</label>" + tel + "</div>"
    }

    if (item.address) {
      const address = item.address.trim()
      inHtml += "<div><label>Address</label>" + address + "</div>"
    }
    inHtml += "</div>"
    return inHtml
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// starting point
function startPoint() {
  if (startGraphic) {
    startGraphic.remove()
    startGraphic = null
  }
  routeLayer.clear()

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

      return point.lng + "," + point.lat
    })
}

//end point
function endPoint() {
  showLoading()
  routeLayer.clear()
  poiLayer.clear()
  endPointArr = null

  const extent = map.getExtent() // Within the current view area

  queryGaodePOI.queryPolygon({
    text: "enterprise",
    polygon: [
      [extent.xmin, extent.ymin],
      [extent.xmin, extent.ymax],
      [extent.xmax, extent.ymax],
      [extent.xmax, extent.ymin]
    ],
    page: 0,
    count: 10,
    success: function (res) {
      hideLoading()

      const count = res.count
      eventTarget.fire("end", { count })

      addEndPointEntity(res.list)
    },
    error: function (msg) {
      globalMsg(msg)
      hideLoading()
    }
  })
}

// Start analysis
function btnAnalyse(type, count) {
  if (!startGraphic || !endPointArr || endPointArr.length === 0) {
    globalMsg("Please set the starting point and query destination")
    return
  }
  showLoading()

  queryRoute(type)
}

function queryRoute(type) {
  const startPoint = startGraphic.coordinate
  const points = []

  endPointArr.forEach((item) => {
    points.push([startPoint, [item.lng, item.lat]])
  })

  gaodeRoute.queryArr({
    type: Number(type), // GaodeRouteType enumeration type
    points,
    success: function (data) {
      hideLoading()

      showRouteResult(data)
    },
    error: function (msg) {
      hideLoading()
      globalAlert(msg)
    }
  })
}

function showRouteResult(data) {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (!item) {
      continue
    }

    const lnglats = item.points
    if (!lnglats || lnglats.length < 1) {
      continue
    }

    const name = endPointArr[i].name

    const time = mars3d.Util.formatTime(item.allDuration)
    const distance = mars3d.MeasureUtil.formatDistance(item.allDistance)
    const html = "Destination:" + name + "<br/>Total distance:" + distance + "<br/>Time required:" + time + ""

    const graphic = new mars3d.graphic.PolylineEntity({
      positions: lnglats,
      style: {
        clampToGround: true,
        material: Cesium.Color.fromRandom({
          alpha: 0.7
        }),
        width: 4
      },
      popup: html
    })
    routeLayer.addGraphic(graphic)

    graphic.entityGraphic.material_old = graphic.entityGraphic.material
    graphic.entityGraphic.width_old = graphic.entityGraphic.width

    const id = graphic.id
    eventTarget.fire("analyse", { i, name, distance, time, id })
  }
}

// POI query of end point
function addEndPointEntity(arr) {
  console.log("query data results", arr)

  endPointArr = arr

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    const graphic = new mars3d.graphic.BillboardEntity({
      position: Cesium.Cartesian3.fromDegrees(item.lng, item.lat),
      style: {
        image: "img/marker/route-end.png",
        scale: 1,
        clampToGround: true, // close to the ground
        label: {
          text: item.name,
          font: "20px regular script",
          color: Cesium.Color.AZURE,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -30), // offset
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000),
          clampToGround: true // stick to the ground
        }
      },
      attr: item
    })
    poiLayer.addGraphic(graphic)
  }
}

let lastRoute
function centerAtRoute(id) {
  const graphic = routeLayer.getGraphicById(id)

  if (lastRoute) {
    lastRoute.entityGraphic.material = lastRoute.entityGraphic.material_old
    lastRoute.entityGraphic.width = lastRoute.entityGraphic.width_old
  }

  //Animation line material
  graphic.entityGraphic.width = 5
  graphic.entityGraphic.material = mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
    color: Cesium.Color.CHARTREUSE,
    image: "img/textures/line-color-yellow.png",
    speed: 20
  })

  map.flyToGraphic(graphic)

  lastRoute = graphic
}

// clear button
function removeAll() {
  if (startGraphic) {
    startGraphic.remove()
    startGraphic = null
  }
  routeLayer.clear()
  poiLayer.clear()
  endPointArr = null
}
