// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 26.520735, lng: 99.609792, alt: 23891502.7, heading: 93.3, pitch: -80.8, roll: 266.7 },
    clock: {
      multiplier: 200 // speed
    }
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

  // Press shift key + left mouse button to drag the earth to the appropriate area, obtain the perspective parameters through the following code, and copy them to the center parameter of mapOptions.
  const center = JSON.stringify(map.getCameraView({ simplify: false }))
  console.log("center perspective is: ", center)

  startRotate()

  getGeojsonStart()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let previousTime

function startRotate() {
  stopRotate()
  previousTime = map.clock.currentTime.secondsOfDay
  map.on(mars3d.EventType.clockTick, map_onClockTick)
}
function stopRotate() {
  map.off(mars3d.EventType.clockTick, map_onClockTick)
}
// Earth rotates
function map_onClockTick() {
  const spinRate = 1

  const currentTime = map.clock.currentTime.secondsOfDay
  const delta = (currentTime - previousTime) / 1000
  previousTime = currentTime
  map.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta)
}

//Load demo data
function getGeojsonStart() {
  startRotate()
  // Get demo data and load it
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/areas/100000_full.json" })
    .then(function (json) {
      addDemoGraphics(json)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

function addDemoGraphics(geojson) {
  const center = Cesium.Cartesian3.fromDegrees(117.203932, 31.856794, 31.8)
  // Company location vector object tag
  const lightCone = new mars3d.graphic.LightCone({
    position: center,
    style: {
      color: "rgba(0,255,255,0.9)",
      radius: 80000, // bottom radius
      height: 1000000 // vertebral body height
    },
    show: true
  })
  map.graphicLayer.addGraphic(lightCone)

  const arr = mars3d.Util.geoJsonToGraphics(geojson) // Parse geojson
  const lineMaterial = mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
    image: "img/textures/line-color-yellow.png",
    color: new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 0.5),
    speed: 9
  })
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i].attr
    if (item.name) {
      const thisPoint = Cesium.Cartesian3.fromDegrees(item.center[0], item.center[1])
      const positions = mars3d.PolyUtil.getLinkedPointList(center, thisPoint, 40000, 100) // Calculate curve points
      const graphic = new mars3d.graphic.PolylinePrimitive({
        positions,
        style: {
          width: 2,
          material: lineMaterial // animation line material
        },
        attr: item
      })
      graphic.bindTooltip(`Hefei - ${item.name}`)
      map.graphicLayer.addGraphic(graphic)
    }
  }
}
