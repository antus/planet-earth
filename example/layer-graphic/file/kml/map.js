// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.614035, lng: 117.292184, alt: 25686, heading: 0, pitch: -44 }
  },
  layers: [
    {
      name: "Borderline",
      type: "kml",
      url: "//data.mars3d.cn/file/kml/countryboundary.kml",
      symbol: {
        styleOptions: {
          color: "#FED976",
          width: 2
        }
      },
      popup: "all",
      show: true
    },
    {
      name: "Provincial Boundary Line",
      type: "kml",
      url: "//data.mars3d.cn/file/kml/province.kml",
      symbol: {
        styleOptions: {
          color: "#00FF00",
          width: 2
        }
      },
      popup: "all",
      show: true
    }
  ]
}

var treeEvent = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
  shoRailway()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function removeLayer() {
  map.trackedEntity = null
  if (graphicLayer) {
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }
}
// flyTo to target
function flyToEntity(entity) {
  map.flyTo(entity)
}

// Example:
function shoRailway() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    url: "//data.mars3d.cn/file/kml/hftl.kml",
    symbol: {
      styleOptions: {
        color: "#00ffff",
        opacity: 0.8,
        width: 3,
        arcType: Cesium.ArcType.GEODESIC,
        clampToGround: true,
        // mark text
        label: {
          text: "{name}",
          opacity: 1,
          font_size: 30,
          color: "#ffffff",

          font_family: "楷体",
          outline: true,
          outlineColor: "#000000",
          outlineWidth: 3,

          scaleByDistance: true,
          scaleByDistance_far: 20000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 100,
          scaleByDistance_nearValue: 1,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 20000)
        }
      }
    },
    center: { lat: 31.653222, lng: 117.273592, alt: 35183, heading: 358, pitch: -63 },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // setTimeout(() => {
  //   graphicLayer.setOptions({
  //     symbol: {
  //       styleOptions: {
  //         color: "red"
  //       }
  //     }
  //   })
  // }, 10000)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example:
function showExpressway() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    name: "route",
    url: "//data.mars3d.cn/file/kml/bslx.kmz",
    symbol: {
      styleOptions: {
        font_family: "楷体",
        arcType: Cesium.ArcType.GEODESIC,
        clampToGround: true
      }
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example:
function showSafetyNotice() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    name: "Maritime Safety Warning",
    url: "//data.mars3d.cn/file/kml/NAVWARN.kmz",
    popup: "{description}",
    center: { lat: 3.851186, lng: 110.508244, alt: 3510625, heading: 7, pitch: -74 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example:
function showMeteorological() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    name: "Weather data",
    url: "//data.mars3d.cn/file/kml/dg8.kml",
    opacity: 0.7,
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example:
function showGDP() {
  removeLayer()

  graphicLayer = new mars3d.layer.KmlLayer({
    name: "GDP of all countries around the world",
    url: "//data.mars3d.cn/file/kml/gdpPerCapita2008.kmz",
    center: { lat: 5.723953, lng: 90.735755, alt: 24143420, heading: 359, pitch: -87 },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)

    const data = event.list
    treeEvent.fire("tree", { treeData: data })
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}
