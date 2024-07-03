// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

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
    draw: "grid",
    fillStyle: "rgba(55, 50, 250, 0.8)",
    shadowColor: "rgba(255, 250, 50, 1)",
    shadowBlur: 20,
    size: 40,
    globalAlpha: 0.5,
    label: {
      show: true,
      fillStyle: "white"
      // shadowColor: 'yellow',
      // font: '20px Arial',
      // shadowBlur: 10,
    },
    gradient: {
      0.25: "rgb(0,0,255)",
      0.55: "rgb(0,255,0)",
      0.85: "yellow",
      1.0: "rgb(255,0,0)"
    },
    data: geojson // data
  }

  //Create MapV layer
  const mapVLayer = new mars3d.layer.MapVLayer(options)
  map.addLayer(mapVLayer)
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
