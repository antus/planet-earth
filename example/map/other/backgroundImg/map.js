// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 36.873519, lng: 106.863496, alt: 19999205, heading: 354, pitch: -89 },
    orderIndependentTranslucency: false,
    // showMoon: false,
    // showSkyBox: false,
    // showSkyAtmosphere: false,
    // fog: false,
    // contextOptions: { webgl: { alpha: true } }, // Allow transparency, only Map initialization can be passed in [key code]
    backgroundImage: "url(/img/tietu/backGroundImg.jpg)",
    globe: {
      baseColor: "rgba(0,0,0,0)",
      showGroundAtmosphere: false,
      enableLighting: false
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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function show() {
  // map.container.style.backgroundImage = "none"
  map.setOptions({
    scene: {
      backgroundImage: "none"
    }
  })
}

function show1() {
  // map.container.style.backgroundImage = "url(/img/tietu/backGroundImg.jpg)"
  map.setOptions({
    scene: {
      backgroundImage: "url(/img/tietu/backGroundImg.jpg)"
    }
  })
}

function show2() {
  // map.container.style.backgroundImage = "url(//data.mars3d.cn/file/img/world/world.jpg)"
  map.setOptions({
    scene: {
      backgroundImage: "url(//data.mars3d.cn/file/img/world/world.jpg)"
    }
  })
}

function show3() {
  // map.container.style.backgroundImage = "url(/img/tietu/bg4.jpg)"
  map.setOptions({
    scene: {
      backgroundImage: "url(/img/tietu/bg4.jpg)"
    }
  })
}
