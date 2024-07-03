// import * as mars3d from "mars3d"
// import * as mapv from "mapv"

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
  let randomCount = 1000
  const data = []
  const citys = [
    "Beijing",
    "Tianjin",
    "Shanghai",
    "Chongqing",
    "Shijiazhuang",
    "Taiyuan",
    "Hohhot",
    "Harbin",
    "Changchun",
    "Shenyang",
    "Jinan",
    "Nanjing",
    "Hefei",
    "Hangzhou",
    "Nanchang",
    "Fuzhou",
    "Zhengzhou",
    "Wuhan",
    "Changsha",
    "Guangzhou",
    "Nanning",
    "Xi'an",
    "Yinchuan",
    "Lanzhou",
    "Xining",
    "Urumqi",
    "Chengdu",
    "Guiyang",
    "Kunming",
    "Lhasa",
    "Haikou"
  ]

  //custom data
  while (randomCount--) {
    const cityCenter1 = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)])
    const cityCenter2 = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)])
    data.push({
      geometry: {
        type: "LineString",
        coordinates: [
          [cityCenter1.lng - 1 + Math.random() * 1, cityCenter1.lat - 1 + Math.random() * 1],
          [cityCenter2.lng - 1 + Math.random() * 1, cityCenter2.lat - 1 + Math.random() * 1]
        ]
      },
      count: 30 * Math.random()
    })
  }

  const options = {
    strokeStyle: "rgba(255, 250, 50, 0.3)",
    shadowColor: "rgba(255, 250, 50, 1)",
    shadowBlur: 20,
    lineWidth: 0.7,
    draw: "simple",
    data // data
  }

  //Create MapV layer
  const mapVLayer = new mars3d.layer.MapVLayer(options)
  map.addLayer(mapVLayer)
}
