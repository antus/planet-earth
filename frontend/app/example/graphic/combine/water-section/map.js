// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // layer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 41.065687, lng: 123.791582, alt: 5276.9, heading: 207.3, pitch: -22.5 },
    globe: {
      depthTestAgainstTerrain: true
    }
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

  bindLayerPopup()

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

let polygonGraphic
function addDemoGraphic1() {
  const waterJson = window.waterJson // in ./water-data.js

  const arrData = []

  for (let index = 1, len = waterJson.length; index < len; index++) {
    const item1 = waterJson[index - 1]
    const item2 = waterJson[index]

    const arrPoints = []

    const height1 = item1.height + 15
    for (let j = 0; j < item1.points.length; j++) {
      const point = item1.points[j]
      arrPoints.push([...point, height1])
    }

    const height2 = item2.height + 15
    for (let j = item2.points.length - 1; j >= 0; j--) {
      const point = item2.points[j]
      arrPoints.push([...point, height2])
    }

    arrData.push({
      positions: arrPoints,
      style: {
        normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
        frequency: 8000.0, // Number that controls the wave number.
        animationSpeed: 0.02, // Number that controls the animation speed of water.
        amplitude: 5.0, // Number that controls the amplitude of the water wave.
        specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
        baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
        blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
        opacity: 0.6, // transparency

        offsetAttribute: Cesium.GeometryOffsetAttribute.ALL, // required
        offsetHeight: 0
      },
      attr: { index, height1, height2 }
    })
  }

  // Combined rendering of multiple area objects.
  polygonGraphic = new mars3d.graphic.WaterCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(polygonGraphic)

  globalMsg(`A total of ${arrData.length} section data has been loaded`)

  setInterval(() => {
    if (polygonGraphic.isDestroy) {
      return
    }
    polygonGraphic.eachInstances((item, index) => {
      item.style.offsetHeight += 0.1
    })
    polygonGraphic.setOffsetHeight()
  }, 10)
}

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr })
  })
}
