// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let rainEffect

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.789209, lng: 117.214049, alt: 603, heading: 10, pitch: -11 }
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

  // Aperture outside the atmosphere
  map.scene.skyAtmosphere.hueShift = -0.8
  map.scene.skyAtmosphere.saturationShift = -0.7
  map.scene.skyAtmosphere.brightnessShift = -0.33
  //Atomization effect
  map.scene.fog.density = 0.001
  map.scene.fog.minimumBrightness = 0.8

  // rain effect
  rainEffect = new mars3d.effect.RainEffect({
    speed: 10,
    size: 20,
    direction: 10
  })
  map.addEffect(rainEffect)

  //Display objects in the specified time range 0-10, 20-30, 40-max
  // const now = map.clock.currentTime
  // rainEffect.availability = [
  //   { start: now, stop: Cesium.JulianDate.addSeconds(now, 10, new Cesium.JulianDate()) },
  //   { start: Cesium.JulianDate.addSeconds(now, 20, new Cesium.JulianDate()), stop: Cesium.JulianDate.addSeconds(now, 30, new Cesium.JulianDate()) },
  //   { start: Cesium.JulianDate.addSeconds(now, 40, new Cesium.JulianDate()), stop: "2999-01-01 00:00:00" }
  // ]
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Whether to enable special effects
function setEffect(val) {
  rainEffect.enabled = val
}

// particle speed
function setSpeed(value) {
  rainEffect.speed = value
}

// particle size
function setSize(value) {
  rainEffect.size = value
}

//Particle direction
function setDirection(value) {
  rainEffect.direction = value
}
