// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 29.808307, lng: 110.597446, alt: 7852846, heading: 353, pitch: -86 }
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
  map.basemap = 2017 // blue basemap

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/weibo.json" })
    .then(function (json) {
      // Create Mapv
      createMapvLayer(json)
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

function createMapvLayer(rs) {
  const data1 = []
  const data2 = []
  const data3 = []
  for (let i = 0; i < rs[0].length; i++) {
    const geoCoord = rs[0][i].geoCoord

    if (i % 10 !== 0) {
      continue
    } // Reduce data

    data1.push({
      geometry: {
        type: "Point",
        coordinates: geoCoord
      }
    })
  }

  for (let i = 0; i < rs[1].length; i++) {
    const geoCoord = rs[1][i].geoCoord

    if (i % 10 !== 0) {
      continue
    } // Reduce data

    data2.push({
      geometry: {
        type: "Point",
        coordinates: geoCoord
      },
      time: Math.random() * 10
    })
  }

  for (let i = 0; i < rs[2].length; i++) {
    const geoCoord = rs[2][i].geoCoord
    data3.push({
      geometry: {
        type: "Point",
        coordinates: geoCoord
      }
    })
  }

  const animation = {
    animation: {
      stepsRange: {
        start: 0,
        end: 10
      },
      trails: 1,
      duration: 6
    }
  }
  addMapvLayer(data1, "rgba(200, 200, 0, 0.8)", 0.7)
  // addMapvLayer(data2, "rgba(255, 250, 0, 0.8)", 0.7)
  // addMapvLayer(data3, "rgba(255, 250, 250, 0.6)", 0.7)
  addMapvLayer(data2, "rgba(255, 250, 250, 0.9)", 1.1, animation)
}

function addMapvLayer(data, color, size, animation) {
  const options1 = {
    fillStyle: color,
    bigData: "Point",
    size,
    draw: "simple",
    depthTest: false,
    ...animation,
    data // data
  }
  //Create MapV layer
  const mapVLayer = new mars3d.layer.MapVLayer(options1)
  map.addLayer(mapVLayer)
}
