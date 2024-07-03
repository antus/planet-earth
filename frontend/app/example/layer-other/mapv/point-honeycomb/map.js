// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: -24.347273, lng: 140.716348, alt: 5849790, heading: 337, pitch: -64 }
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

  //Create mapv layer
  createMapvLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function createMapvLayer() {
  // Construct data
  const positions = []
  const geojson = []
  let randomCount = 300
  while (randomCount--) {
    // Get random points in the area
    const point = [random(113 * 1000, 119 * 1000) / 1000, random(28 * 1000, 35 * 1000) / 1000]
    positions.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]))

    geojson.push({
      geometry: {
        type: "Point",
        coordinates: point
      },
      count: 30 * Math.random()
    })
  }
  map.camera.flyTo({
    destination: Cesium.Rectangle.fromCartesianArray(positions)
  })

  // mapv layer parameters
  const options = {
    fillStyle: "rgba(55, 50, 250, 0.8)",
    shadowColor: "rgba(255, 250, 50, 1)",
    shadowBlur: 20,
    max: 100,
    size: 50,
    label: {
      show: true,
      fillStyle: "white"
    },
    globalAlpha: 0.5,
    gradient: {
      0.25: "rgb(0,0,255)",
      0.55: "rgb(0,255,0)",
      0.85: "yellow",
      1.0: "rgb(255,0,0)"
    },
    draw: "honeycomb",
    data: geojson // data
  }

  //Create MapV layer
  const mapVLayer = new mars3d.layer.MapVLayer(options)
  map.addLayer(mapVLayer)

  mapVLayer.on("click", function (event) {
    console.log("Layer clicked", event)
  })
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
