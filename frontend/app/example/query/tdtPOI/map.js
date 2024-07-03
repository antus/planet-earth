// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

let poiLayer
let queryTdtPOI
let drawGraphic //Limited area
let resultList = [] // Query results
let lastQueryOptions //Last request parameters, used for next page
let graphic

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
    const address = String(item.address).trim()
    if (address) {
      inHtml += "<div><label>Address</label>" + address + "</div>"
    }
    inHtml += "</div>"
    return inHtml
  })

  queryTdtPOI = new mars3d.query.TdtPOI()

  // right-click menu
  const defaultContextmenuItems = map.getDefaultContextMenu()
  defaultContextmenuItems.push({
    text: "View address here",
    icon: "fa fa-eye",
    show: function (e) {
      return Cesium.defined(e.cartesian)
    },
    callback: (e) => {
      queryTdtPOI.getAddress({
        location: e.cartesian,
        success: (result) => {
          console.log("Get address based on latitude and longitude coordinates, reverse geocoding", result)
          globalAlert(result.address)
        }
      })
    }
  })
  map.bindContextMenu(defaultContextmenuItems)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Inquire
 *
 * @export
 * @param {string} radioFanwei range selection
 * @param {string} cityShi city
 * @param {string} text keyword
 * @returns {void}
 */
function query(radioFanwei, cityShi, text) {
  resultList = []
  switch (radioFanwei) {
    case "2": {
      //Current viewing angle range
      const extent = map.getExtent()
      loadData(
        {
          page: 0,
          polygon: [
            [extent.xmin, extent.ymin],
            [extent.xmax, extent.ymax]
          ],
          limit: true
        },
        text
      )
      break
    }
    case "3": // by range
      if (!drawGraphic) {
        globalMsg("Please draw a limited range!")
        return
      }
      loadData(
        {
          page: 0,
          graphic: drawGraphic,
          limit: true
        },
        text
      )
      break
    default: {
      const dmmc = cityShi
      loadData(
        {
          page: 0,
          city: dmmc,
          citylimit: true
        },
        text
      )
      break
    }
  }
}

function loadData(queryOptions, text) {
  if (!text) {
    globalMsg("Please enter name keyword to filter data!")
    return
  }
  showLoading()

  lastQueryOptions = {
    ...queryOptions,
    count: 25, // count number per page
    text,
    success: function (res) {
      const data = res.list
      if (data.length <= 1) {
        globalMsg("No relevant data found!")
      }
      resultList = resultList.concat(data)
      addDemoGraphics(data)

      eventTarget.fire("tableData", { data }) // Throw data to the component

      hideLoading()
    },
    error: function (msg) {
      hideLoading()
      globalAlert(msg)
    }
  }
  queryTdtPOI.query(lastQueryOptions)
}

function clearAll(noClearDraw) {
  lastQueryOptions = null
  resultList = []
  poiLayer.clear()

  if (!noClearDraw) {
    drawGraphic = null
    map.graphicLayer.clear()
  }
}

function addDemoGraphics(arr) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    graphic = new mars3d.graphic.BillboardEntity({
      position: Cesium.Cartesian3.fromDegrees(item.lng, item.lat),
      style: {
        image: "img/marker/mark-blue.png",
        scale: 1,
        scaleByDistance: true,
        scaleByDistance_far: 20000,
        scaleByDistance_farValue: 0.5,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        clampToGround: true, // close to the ground
        highlight: { type: "click", image: "img/marker/mark-red.png" },
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

    item.graphic = graphic
  }
}

// Frame selection query rectangle
function drawRectangle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic

      console.log("rectangle:", drawGraphic.toGeoJSON({ outline: true }))
    }
  })
}

// Frame selection query circle
function drawCircle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
      console.log("circle:", drawGraphic.toGeoJSON({ outline: true }))
    }
  })
}

// Frame selection query multi-row
function drawPolygon() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00FF00",
      opacity: 0.3,
      outline: true,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
      console.log("Polyline:", drawGraphic.toGeoJSON())
    }
  })
}

function flyToGraphic(graphic) {
  graphic.openHighlight()
  graphic.flyTo({
    radius: 1000, // Point data: radius controls the sight distance
    scale: 1.5, // Line and surface data: scale controls the amplification ratio of the boundary
    complete: () => {
      graphic.openPopup()
    }
  })
}
