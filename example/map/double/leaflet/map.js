// import * as mars3d from "mars3d"

let map3d
let map2d

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map3d = mapInstance // record map
  map3d.camera.percentageChanged = 0.001

  globalNotify("Known Problem Tips", `The current monitoring of 3D events is not sensitive, and the perspective synchronization is not smooth enough. `)

  creatMap2D()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  unbind3dEvent()
  unbind2dEvent()

  map3d = null

  map2d.destroy()
  map2d = null
}

function creatMap2D() {
  showLoading()

  const mapDiv = mars3d.DomUtil.create("div", "", document.body)
  mapDiv.setAttribute("id", "centerDiv2D")

  const map2dDiv = mars3d.DomUtil.create("div", "", mapDiv)
  map2dDiv.setAttribute("id", "map2d")
  map2dDiv.setAttribute("class", "mars2d-container")

  const configUrl = "http://mars2d.cn/config/config.json"
  mars2d.Util.fetchJson({ url: configUrl })
    .then(function (data) {
      // Build the map
      map2d = new mars2d.Map("map2d", data.mars2d)
      bind2dEvent(map2d)
      bind3dEvent()

      _map2d_extentChangeHandler()

      viewTo23D() //Default

      hideLoading()
    })
    .catch(function (error) {
      hideLoading()

      console.log("Build map error", error)
      globalMsg(error && error.message, "error")
    })
}

// 2D map change event
function bind2dEvent() {
  map2d.on("drag", _map2d_extentChangeHandler, this)
  map2d.on("zoomend", _map2d_extentChangeHandler, this)
}

function unbind2dEvent() {
  map2d.off("drag", _map2d_extentChangeHandler, this)
  map2d.off("zoomend", _map2d_extentChangeHandler, this)
}

function _map2d_extentChangeHandler(e) {
  const bounds = map2d.getBounds()
  const extent = {
    xmin: bounds.getWest(),
    xmax: bounds.getEast(),
    ymin: bounds.getSouth(),
    ymax: bounds.getNorth()
  }
  console.log(`The two-dimensional map has changed, area: ${JSON.stringify(extent)}`)

  unbind3dEvent()
  map3d.camera.setView({
    destination: Cesium.Rectangle.fromDegrees(extent.xmin, extent.ymin, extent.xmax, extent.ymax)
  })

  bind3dEvent()
}

// 3D map camera movement end event
function bind3dEvent() {
  map3d.on(mars3d.EventType.cameraChanged, camera_moveEndHandler, this)
}

function unbind3dEvent() {
  map3d.off(mars3d.EventType.cameraChanged, camera_moveEndHandler, this)
}

function camera_moveEndHandler(e) {
  const point = map3d.getCenter() // range object
  const level = map3d.level
  console.log(`'The three-dimensional map has changed, location: ${point.toString()}, level ${level} `)

  unbind2dEvent()

  map2d.setView([point.lat, point.lng], level, { animate: false })

  bind2dEvent()
}

function viewTo3d() {
  const to3dDom = document.getElementById("centerDiv3D")
  const to2dDom = document.getElementById("centerDiv2D")
  to2dDom.style.display = "none"
  to3dDom.style.display = "block"
  to3dDom.style.left = "0"
  to3dDom.style.width = "100%"
}

function viewTo2d() {
  const to3dDom = document.getElementById("centerDiv3D")
  const to2dDom = document.getElementById("centerDiv2D")
  to3dDom.style.display = "none"
  to2dDom.style.display = "block"
  to2dDom.style.width = "100%"

  if (map2d) {
    map2d.invalidateSize(false)
  }
}

function viewTo23D() {
  const to3dDom = document.getElementById("centerDiv3D")
  const to2dDom = document.getElementById("centerDiv2D")
  to3dDom.style.width = "50%"
  to2dDom.style.width = "50%"
  to3dDom.style.left = "50%"
  to3dDom.style.display = "block"
  to2dDom.style.display = "block"

  if (map2d) {
    map2d.invalidateSize(false)
  }
}
