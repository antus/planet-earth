// import * as mars3d from "mars3d"
// import * as mapv from "mapv"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 22.126801, lng: 119.173814, alt: 4100099, heading: 351, pitch: -74 }
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

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/mapvchina.json" })
    .then(function (data) {
      createMapvLayer(data)
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

//Create mapv layer
function createMapvLayer(geojson) {
  const geojsonDataSet = mapv.geojson.getDataSet(geojson)

  const to = "Beijing"
  const qianxi = new mapv.DataSet([
    {
      from: "Hebei",
      count: 354551,
      to
    },
    {
      from: "Tianjin",
      count: 97323,
      to
    },
    {
      from: "Shandong",
      count: 28664,
      to
    },
    {
      from: "Shanxi",
      count: 16650,
      to
    },
    {
      from: "Liaoning",
      count: 14379,
      to
    },
    {
      from: "Henan",
      count: 10980,
      to
    },
    {
      from: "Inner Mongolia Autonomous Region",
      count: 9603,
      to
    },
    {
      from: "Jiangsu",
      count: 4536,
      to
    },
    {
      from: "Shanghai",
      count: 3556,
      to
    },
    {
      from: "Guangdong",
      count: 2600,
      to
    }
  ])

  const lineData = []
  const pointData = []
  const textData = []
  const timeData = []

  const citys = {}

  const qianxiData = qianxi.get()
  for (let i = 0; i < qianxiData.length; i++) {
    const fromCenter = mapv.utilCityCenter.getCenterByCityName(qianxiData[i].from)
    const toCenter = mapv.utilCityCenter.getCenterByCityName(qianxiData[i].to)
    if (!fromCenter || !toCenter) {
      continue
    }
    citys[qianxiData[i].from] = qianxiData[i].count
    citys[qianxiData[i].to] = 100
    pointData.push({
      geometry: {
        type: "Point",
        coordinates: [fromCenter.lng, fromCenter.lat]
      }
    })
    pointData.push({
      geometry: {
        type: "Point",
        coordinates: [toCenter.lng, toCenter.lat]
      }
    })
    textData.push({
      geometry: {
        type: "Point",
        coordinates: [fromCenter.lng, fromCenter.lat]
      },
      text: qianxiData[i].from
    })
    textData.push({
      geometry: {
        type: "Point",
        coordinates: [toCenter.lng, toCenter.lat]
      },
      text: qianxiData[i].to
    })

    const curve = mapv.utilCurve.getPoints([fromCenter, toCenter])

    for (let j = 0; j < curve.length; j++) {
      timeData.push({
        geometry: {
          type: "Point",
          coordinates: curve[j]
        },
        count: 1,
        time: j
      })
    }

    lineData.push({
      geometry: {
        type: "LineString",
        coordinates: curve
        // coordinates: [[fromCenter.lng, fromCenter.lat], [toCenter.lng, toCenter.lat]]
      },
      count: 30 * Math.random()
    })
  }

  const data = geojsonDataSet.get({
    filter: function (item) {
      if (!citys[item.name]) {
        return false
      }

      item.count = citys[item.name]
      return true
    }
  })

  const geojsonOptions = {
    gradient: {
      0: "rgba(55, 50, 250, 0.4)",
      1: "rgba(55, 50, 250, 1)"
    },
    max: 354551,
    draw: "intensity",
    depthTest: false,
    data // data
  }
  const mapVLayer = new mars3d.layer.MapVLayer(geojsonOptions) // Create MapV layer
  map.addLayer(mapVLayer)

  const textOptions = {
    draw: "text",
    font: "14px Arial",
    fillStyle: "white",
    shadowColor: "yellow",
    shadowBlue: 10,
    zIndex: 11,
    shadowBlur: 10,
    data: textData // data
  }
  const textmapVLayer = new mars3d.layer.MapVLayer(textOptions) // Create a MapV layer
  map.addLayer(textmapVLayer)

  const lineOptions = {
    strokeStyle: "rgba(255, 250, 50, 0.8)",
    shadowColor: "rgba(255, 250, 50, 1)",
    shadowBlur: 20,
    lineWidth: 2,
    zIndex: 100,
    draw: "simple",
    data: lineData // data
  }
  const linemapVLayer = new mars3d.layer.MapVLayer(lineOptions) // Create a MapV layer
  map.addLayer(linemapVLayer)

  const pointOptions = {
    fillStyle: "rgba(254,175,3,0.7)",
    shadowColor: "rgba(55, 50, 250, 0.5)",
    shadowBlur: 10,
    size: 5,
    zIndex: 10,
    draw: "simple",
    data: pointData // data
  }
  const pointmapVLayer = new mars3d.layer.MapVLayer(pointOptions) // Create a MapV layer
  map.addLayer(pointmapVLayer)

  const timeOptions = {
    fillStyle: "rgba(255, 250, 250, 0.5)",
    zIndex: 200,
    size: 2.5,
    animation: {
      type: "time",
      stepsRange: {
        start: 0,
        end: 50
      },
      trails: 10,
      duration: 2
    },
    draw: "simple",
    data: timeData // data
  }
  const timemapVLayer = new mars3d.layer.MapVLayer(timeOptions) // Create a MapV layer
  map.addLayer(timemapVLayer)
}
