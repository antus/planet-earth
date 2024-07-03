// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 32.432718, lng: 115.602003, alt: 108, heading: 237, pitch: -31 },
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

  // show waters
  const waterLayer = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/wangjiaba.json",
    symbol: {
      type: "waterC",
      styleOptions: {
        height: 18, // water surface height
        normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
        frequency: 9000.0, // Number that controls the wave number.
        animationSpeed: 0.03, // Number that controls the animation speed of water.
        amplitude: 5.0, // Number that controls the amplitude of the water wave.
        specularIntensity: 0.2, // Number that controls the intensity of specular reflection.
        baseWaterColor: "#123e59", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
        blendColor: "#123e59" // The rgba color object used when blending from water to non-water.
      }
    }
  })
  map.addLayer(waterLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addWaterGate()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Add water column
function addWaterGate() {
  // water column position
  const posArr = [
    [115.600031, 32.43217, 28],
    [115.600104, 32.432121, 28],
    [115.600163, 32.432059, 28],
    [115.600246, 32.432014, 28],
    [115.600324, 32.431971, 28],
    [115.600404, 32.431927, 28],
    [115.600484, 32.431882, 28],
    [115.600563, 32.431839, 28],
    [115.600646, 32.431793, 28],
    [115.600727, 32.431749, 28],
    [115.600806, 32.431706, 28],
    [115.600886, 32.431661, 28],
    [115.600967, 32.431617, 28]
  ]

  for (let i = 0, len = posArr.length; i < len; i++) {
    const pos = posArr[i]

    const particleSystem = new mars3d.graphic.ParticleSystem({
      id: i + 1,
      position: pos, // position
      style: {
        image: "./img/particle/smoke.png",
        particleSize: 16, // particle size (unit: pixel)
        emissionRate: 100.0, // Emission rate (unit: times/second)
        heading: 120, // heading angle
        pitch: 45, // pitch angle
        gravity: -11, // Gravity factor, which modifies the velocity vector to change direction or speed (physics-based effect)
        transZ: 5, // Height above the ground (unit: meters)
        // maxHeight: 2000, // No particle effect will be displayed after exceeding this height

        startColor: Cesium.Color.LIGHTCYAN.withAlpha(0.3), // start color
        endColor: Cesium.Color.WHITE.withAlpha(0.0), //End color
        minimumParticleLife: 1, // Minimum life time (seconds)
        maximumParticleLife: 4, // Maximum life time (seconds)
        minimumSpeed: 10.0, // minimum speed (m/s)
        maximumSpeed: 14.0 // Maximum speed (m/s)
      }
    })
    graphicLayer.addGraphic(particleSystem)
  }
}

//Single gate control
function onChangeGate(id, checked) {
  const particleSystem = graphicLayer.getGraphicById(id)
  if (particleSystem) {
    particleSystem.show = !checked
  }
}
//Control of all gates
function bindShowAll(val) {
  graphicLayer.eachGraphic((graphic) => {
    graphic.show = val
  })
}
