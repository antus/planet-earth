// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 27.390195, lng: 117.386057, alt: 550488, heading: 0, pitch: -49 }
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

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const center = Cesium.Cartesian3.fromDegrees(117.257436, 31.838742, 1)

  const graphic = new mars3d.graphic.CircleEntity({
    name: "Hefei City",
    position: center,
    style: {
      radius: 50000.0,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#ff0000",
        count: 1, // single circle
        speed: 20
      }
    }
  })
  graphicLayer.addGraphic(graphic)

  const cities = [
    { name: "Lu'an City", lon: 116.3123, lat: 31.8329 },
    { name: "Anqing City", lon: 116.7517, lat: 30.5255 },
    { name: "Chuzhou City", lon: 118.1909, lat: 32.536 },
    { name: "Xuancheng City", lon: 118.8062, lat: 30.6244 },
    { name: "Fuyang City", lon: 115.7629, lat: 32.9919 },
    { name: "Suzhou City", lon: 117.5208, lat: 33.6841 },
    { name: "Huangshan City", lon: 118.0481, lat: 29.9542 },
    { name: "Chaohu City", lon: 117.7734, lat: 31.4978 },
    { name: "Bozhou City", lon: 116.1914, lat: 33.4698 },
    { name: "Chizhou City", lon: 117.3889, lat: 30.2014 },
    { name: "Bengbu City", lon: 117.4109, lat: 33.1073 },
    { name: "Wuhu City", lon: 118.3557, lat: 31.0858 },
    { name: "Huaibei City", lon: 116.6968, lat: 33.6896 },
    { name: "Huainan City", lon: 116.7847, lat: 32.7722 },
    { name: "Ma'anshan City", lon: 118.6304, lat: 31.5363 },
    { name: "Tongling City", lon: 117.9382, lat: 30.9375 }
  ]

  const lineMaterial = mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
    image: "img/textures/line-color-yellow.png",
    color: new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1),
    speed: 10
  })
  for (let i = 0; i < cities.length; i++) {
    const item = cities[i]
    const thisPoint = Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 1)
    const positions = mars3d.PolyUtil.getLinkedPointList(center, thisPoint, 40000, 100) // Calculate curve points
    const graphic = new mars3d.graphic.PolylinePrimitive({
      positions,
      style: {
        width: 2,
        material: lineMaterial // animation line material
      }
    })
    graphic.bindPopup(`Hefei - ${item.name}`)
    graphicLayer.addGraphic(graphic)
  }
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

/**
 * Change the speed of migration
 *
 * @param {number} val value of the slider
 * @returns {void} None
 * @example
 * Update material
 * graphic.setStyle({
 *   material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
 *     image: "img/textures/line-color-yellow.png",
 *     color: new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1),
 *     speed: speed,
 *   }),
 * });
 */
function changeSlide(val) {
  if (!val) {
    return
  }

  graphicLayer.eachGraphic((graphic) => {
    if (graphic instanceof mars3d.graphic.PolylinePrimitive) {
      graphic.uniforms.speed = val // Only update speed (smooth transition)
    } else {
      // graphic.setStyle({})
    }
  })
}
