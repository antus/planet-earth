// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.81456, lng: 117.231868, alt: 275.7, heading: 268.2, pitch: -12.5 }
  }
}

var graphicLayer

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

  //Add some demo data
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// fountain effect
function addDemoGraphic1(graphicLayer) {
  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: Cesium.Cartesian3.fromDegrees(117.224855, 31.815135, 28.05), // position
    style: {
      image: "./img/particle/penquan.png",
      particleSize: 8, // particle size (unit: pixel)
      emissionRate: 100.0, // Emission rate (unit: times/second)
      heading: 290, // heading angle
      pitch: 40, // pitch angle
      gravity: -3.5, // Gravity factor, which modifies the velocity vector to change direction or speed (physics-based effect)
      transZ: 5, // Height above the ground (unit: meters)
      maxHeight: 5000, // No particle effect will be displayed after exceeding this height

      startColor: new Cesium.Color(1, 1, 1, 0.6), // start color
      endColor: new Cesium.Color(0.8, 0.86, 1, 0.4), // End color
      startScale: 1.0, //Start scale (unit: multiple of imageSize size)
      endScale: 4.0, // End scale (unit: multiple of imageSize size)
      minimumParticleLife: 6, // Minimum life time (seconds)
      maximumParticleLife: 7, // Maximum life time (seconds)
      minimumSpeed: 9.0, // minimum speed (m/s)
      maximumSpeed: 9.5 // Maximum speed (m/s)
    },
    attr: { remark: "Water column particle effect" }
  })

  graphicLayer.addGraphic(particleSystem)
}

//Torch effect
function addDemoGraphic2(graphicLayer) {
  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: Cesium.Cartesian3.fromDegrees(117.225518, 31.815549, 28.28), // position
    style: {
      image: "./img/particle/fire2.png",
      particleSize: 5, // particle size (unit: pixel)
      emissionRate: 100, // Emission rate (unit: times/second)
      maxHeight: 5000, // No particle effect will be displayed after exceeding this height

      startColor: new Cesium.Color(1, 1, 1, 1), // start color
      endColor: new Cesium.Color(0.5, 0, 0, 0), // End color
      startScale: 3.0, //Start scale (unit: multiple of imageSize size)
      endScale: 1.5, // End scale (unit: multiple of imageSize size)
      minimumSpeed: 7.0, // Minimum speed (unit: meters/second)
      maximumSpeed: 9.0 // Maximum speed (unit: meters/second)
    },
    attr: { remark: "Fire particle effect" }
  })
  graphicLayer.addGraphic(particleSystem)
}

// Fireworks effect
function addDemoGraphic3(graphicLayer) {
  const position = Cesium.Cartesian3.fromDegrees(117.22104, 31.813759, 80) // position

  const minimumExplosionSize = 30.0
  const maximumExplosionSize = 100.0
  const particlePixelSize = new Cesium.Cartesian2(7.0, 7.0)
  const burstSize = 400.0
  const lifetime = 10.0
  const numberOfFireworks = 20.0
  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
  const emitterInitialLocation = new Cesium.Cartesian3(0.0, 0.0, 100.0)
  const emitterModelMatrixScratch = new Cesium.Matrix4()

  let particleCanvas
  function getImage() {
    if (!Cesium.defined(particleCanvas)) {
      particleCanvas = document.createElement("canvas")
      particleCanvas.width = 20
      particleCanvas.height = 20
      const context2D = particleCanvas.getContext("2d")
      context2D.beginPath()
      context2D.arc(8, 8, 8, 0, Cesium.Math.TWO_PI, true)
      context2D.closePath()
      context2D.fillStyle = "rgb(255, 255, 255)"
      context2D.fill()
    }
    return particleCanvas
  }

  function createFirework(offset, color, bursts) {
    const position = Cesium.Cartesian3.add(emitterInitialLocation, offset, new Cesium.Cartesian3())
    const emitterModelMatrix = Cesium.Matrix4.fromTranslation(position, emitterModelMatrixScratch)
    const particleToWorld = Cesium.Matrix4.multiply(modelMatrix, emitterModelMatrix, new Cesium.Matrix4())
    const worldToParticle = Cesium.Matrix4.inverseTransformation(particleToWorld, particleToWorld)

    const size = Cesium.Math.randomBetween(minimumExplosionSize, maximumExplosionSize)
    const particlePositionScratch = new Cesium.Cartesian3()
    const force = function (particle) {
      const position = Cesium.Matrix4.multiplyByPoint(worldToParticle, particle.position, particlePositionScratch)
      if (Cesium.Cartesian3.magnitudeSquared(position) >= size * size) {
        Cesium.Cartesian3.clone(Cesium.Cartesian3.ZERO, particle.velocity)
      }
    }

    const normalSize = (size - minimumExplosionSize) / (maximumExplosionSize - minimumExplosionSize)
    const minLife = 0.3
    const maxLife = 1.0
    const life = normalSize * (maxLife - minLife) + minLife

    const particleSystem = new mars3d.graphic.ParticleSystem({
      modelMatrix,
      emitterModelMatrix,
      updateCallback: force,
      style: {
        image: getImage(),
        startColor: color,
        endColor: color.withAlpha(0.0),
        particleLife: life,
        speed: 100.0,
        imageSize: particlePixelSize,
        emissionRate: 0,
        emitter: new Cesium.SphereEmitter(0.1),
        bursts,
        lifetime
      },
      attr: { remark: "Firework particle effect" }
    })
    graphicLayer.addGraphic(particleSystem)
  }

  const xMin = -100.0
  const xMax = 100.0
  const yMin = -80.0
  const yMax = 100.0
  const zMin = -50.0
  const zMax = 50.0

  const colorOptions = [
    {
      minimumRed: 0.75,
      green: 0.0,
      minimumBlue: 0.8,
      alpha: 1.0
    },
    {
      red: 0.0,
      minimumGreen: 0.75,
      minimumBlue: 0.8,
      alpha: 1.0
    },
    {
      red: 0.0,
      green: 0.0,
      minimumBlue: 0.8,
      alpha: 1.0
    },
    {
      minimumRed: 0.75,
      minimumGreen: 0.75,
      blue: 0.0,
      alpha: 1.0
    }
  ]

  for (let i = 0; i < numberOfFireworks; ++i) {
    const x = Cesium.Math.randomBetween(xMin, xMax)
    const y = Cesium.Math.randomBetween(yMin, yMax)
    const z = Cesium.Math.randomBetween(zMin, zMax)
    const offset = new Cesium.Cartesian3(x, y, z)
    const color = Cesium.Color.fromRandom(colorOptions[i % colorOptions.length])

    const bursts = []
    for (let j = 0; j < 3; ++j) {
      bursts.push(
        new Cesium.ParticleBurst({
          time: Cesium.Math.nextRandomNumber() * lifetime,
          minimum: burstSize,
          maximum: burstSize
        })
      )
    }

    createFirework(offset, color, bursts)
  }
}

// Exhaust particle effects of dynamically running vehicles
function addDemoGraphic4(graphicLayer) {
  const fixedRoute = new mars3d.graphic.FixedRoute({
    speed: 120,
    positions: [
      [117.226585, 31.818437, 32.41],
      [117.226838, 31.811681, 28.23]
    ],
    clockLoop: true, // Whether to loop playback
    model: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.2
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  fixedRoute.start() // Start roaming

  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: fixedRoute.property,
    style: {
      image: "./img/particle/smoke.png",
      particleSize: 12, // particle size (unit: pixel)
      emissionRate: 20.0, // Emission rate (unit: times/second)
      pitch: 40, // pitch angle
      // gravity: -1, // Gravity factor, which modifies the velocity vector to change direction or speed (physics-based effect)
      // transY: 8.0, // Offset value Y, exhaust gas is behind the vehicle
      maxHeight: 1000, // No particle effect will be displayed after exceeding this height

      startColor: Cesium.Color.GREY.withAlpha(0.7), // start color
      endColor: Cesium.Color.WHITE.withAlpha(0.0), //End color
      startScale: 1.0, //Start scale (unit: multiple of imageSize size)
      endScale: 5.0, // End scale (unit: multiple of imageSize size)
      minimumSpeed: 1.0, // minimum speed (m/s)
      maximumSpeed: 4.0 // Maximum speed (m/s)
    },
    attr: { remark: "Vehicle exhaust" }
  })
  graphicLayer.addGraphic(particleSystem)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.ParticleSystem({
      position,
      style: {
        image: "./img/particle/fire2.png",
        particleSize: 5, // particle size (unit: pixel)
        emissionRate: 200, // The emission rate of the particle emitter (unit: times/second)

        startColor: new Cesium.Color(1, 1, 1, 1), // The color of the particle when it is born
        endColor: new Cesium.Color(0.5, 0, 0, 0), // Color when the particle dies
        startScale: 3.0, //Start scale (unit: multiple of imageSize size)
        endScale: 1.5, // End scale (unit: multiple of imageSize size)
        minimumSpeed: 7.0, // Minimum speed (unit: meters/second)
        maximumSpeed: 9.0 // Maximum speed (unit: meters/second)
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "particleSystem",
    style: {
      image: "./img/particle/smoke.png",
      particleSize: 8, // particle size (unit: pixel)
      emissionRate: 100.0, // Emission rate (unit: times/second)
      heading: 290, // heading angle
      pitch: 40, // pitch angle
      gravity: -3.5, // Gravity factor, which modifies the velocity vector to change direction or speed (physics-based effect)
      transZ: 5, // Height above the ground (unit: meters)

      startColor: Cesium.Color.LIGHTCYAN.withAlpha(0.3), // start color
      endColor: Cesium.Color.WHITE.withAlpha(0.0), //End color
      startScale: 2.0, //Start scale (unit: multiple of imageSize size)
      endScale: 4.0, // End scale (unit: multiple of imageSize size)
      minimumParticleLife: 1.0, // Minimum life time (seconds)
      maximumParticleLife: 3.0 // Maximum life time (seconds)
    }
  })
}

function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "particleSystem",
    style: {
      image: "./img/particle/fire2.png",
      particleSize: 5, // particle size (unit: pixel)
      emissionRate: 200, // Emission rate (unit: times/second)

      startColor: new Cesium.Color(1, 1, 1, 1), // The color of the particle when it is born
      endColor: new Cesium.Color(0.5, 0, 0, 0), // Color when the particle dies
      startScale: 3.0, //Start scale (unit: multiple of imageSize size)
      endScale: 1.5, // End scale (unit: multiple of imageSize size)
      minimumParticleLife: 1.5, // Minimum life time (seconds)
      maximumParticleLife: 1.8, // Maximum life time (seconds)
      minimumSpeed: 7.0, // Minimum speed (unit: meters/second)
      maximumSpeed: 9.0 // Maximum speed (unit: meters/second)
    }
  })
}

let particleGraphic
function getGraphic(graphicId) {
  particleGraphic = graphicLayer.getGraphicById(graphicId)
  return particleGraphic
}

//Modify style
function setStylyToGraphic(style) {
  particleGraphic.setStyle(style)
}

//Modify position
let particlePosition
function btnSelectPosition() {
  map.graphicLayer.startDraw({
    type: "point",
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      particlePosition = positions[0]
      map.graphicLayer.clear()

      particleGraphic.position = particlePosition
    }
  })
}
