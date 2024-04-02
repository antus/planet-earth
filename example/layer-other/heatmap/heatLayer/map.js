// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 25.873121, lng: 119.290515, alt: 51231, heading: 2, pitch: -71 }
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
  // map.basemap = 2017 // blue basemap

  // Problem solving ideas: https://zhuanlan.zhihu.com/p/361468247
  globalNotify("Known Problem Tips", `When the latitude span exceeds one city, there will be an offset (caused by Mercator projection, no suitable solution has been found yet).`)

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/heat-fuzhou.json" })
    .then(function (result) {
      const arrPoints = []
      for (let i = 0; i < result.Data.length; i++) {
        const item = result.Data[i]
        arrPoints.push({ lng: item.x, lat: item.y, value: item.t0 })
      }
      showHeatMap(arrPoints)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function showHeatMap(arrPoints) {
  //Heat map layer
  const heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    //The following are the style parameters of the heat map itself, please refer to the API: https://www.patrick-wied.at/static/heatmapjs/docs.html
    max: 20000,
    heatStyle: {
      radius: 20,
      minOpacity: 0,
      maxOpacity: 0.4,
      blur: 0.3,
      gradient: {
        0: "#e9ec36",
        0.25: "#ffdd2f",
        0.5: "#fa6c20",
        0.75: "#fe4a33",
        1: "#ff0000"
      }
    },
    //The following are the style parameters of the rectangular vector object
    style: {
      opacity: 1.0
      // clampToGround: true,
    },
    flyTo: true
  })
  map.addLayer(heatLayer)

  map.on(mars3d.EventType.mouseMove, (e) => {
    const point = mars3d.LngLatPoint.fromCartesian(e.cartesian)
    const data = heatLayer.getPointData(point)

    const inhtml = `
      Longitude: ${point.lng} <br />
      Latitude: ${point.lat} <br />
      X value: ${data.x} <br />
      Y value: ${data.y} <br />
      value: ${data.value} <br />
      Color:<span style="background-color: ${data.color};padding:2px 5px;">${data.color}</span>
      `
    map.openSmallTooltip(e.windowPosition, inhtml)
  })
}
