// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 21.004037, lng: 107.525781, alt: 10103609, heading: 0, pitch: -83 }
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/weibo2.json" })
    .then(function (json) {
      // Create Mapv
      createMapvLayer(json)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })

  globalNotify("Known Problem Tips", `Some effects (such as the flickering of points) are not integrated when the field of view changes. You can decide whether to use this effect according to the actual project.`)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function createMapvLayer(rs) {
  const data = []
  for (let i = 0; i < rs[0].length; i++) {
    const geoCoord = rs[0][i].geoCoord
    data.push({
      geometry: {
        type: "Point",
        coordinates: geoCoord
      },
      time: Math.random() * 10
    })
  }

  const options = {
    fillStyle: "rgba(255, 250, 50, 0.6)",
    // shadowColor: 'rgba(255, 250, 50, 0.5)',
    // shadowBlur: 3,
    updateCallback: function (time) {
      time = time.toFixed(2)
      // $('#time').html('time' + time)
    },
    size: 3,
    draw: "simple",
    animation: {
      type: "time",
      stepsRange: {
        start: 0,
        end: 10
      },
      trails: 1,
      duration: 6
    },

    data // data
  }

  //Create MapV layer
  const mapVLayer = new mars3d.layer.MapVLayer(options)
  map.addLayer(mapVLayer)
}
