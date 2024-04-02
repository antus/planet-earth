// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

var mapOptions = {
  scene: {
    center: { lat: 31.82191, lng: 117.218956, alt: 442.2, heading: 168.9, pitch: -21.9 }
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

  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei Swan Lake",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add some demo data
  addDemoGraphic1()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const volumeCloud = new mars3d.graphic.ReflectionWater({
    positions: [
      [117.216386, 31.815376, 35.16],
      [117.222533, 31.81729, 29.21],
      [117.22642, 31.814983, 28.43],
      [117.22681, 31.810739, 28.55],
      [117.212868, 31.811302, 34.4],
      [117.212538, 31.81424, 31.87],
      [117.214681, 31.81402, 32.97]
    ],
    style: {
      normalMap: "/img/textures/waterNormals.jpg", // Normal map of normal water disturbance
      ripple: 100,
      reflectivity: 0.8
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(volumeCloud)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 72, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 144, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 216, result.radius)
    const pt5 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 288, result.radius)

    const graphic = new mars3d.graphic.ReflectionWater({
      positions: [pt1, pt2, pt3, pt4, pt5],
      style: {
        normalMap: "/img/textures/waterNormals.jpg", // Normal map of normal water disturbance
        ripple: 100,
        reflectivity: 0.8
      },
      frameRate: 2,
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "reflectionWater",
    style: {
      normalMap: "/img/textures/waterNormals.jpg", // Normal map of normal water disturbance
      ripple: 100,
      reflectivity: 0.9
    }
  })
}
