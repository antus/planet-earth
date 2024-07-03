// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -89 },
    scene3DOnly: true,
    contextOptions: {
      requestWebgl1: true
    }
  },
  control: {
    sceneModePicker: false
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
  map.basemap = 2017 // blue basemap

  map.mouseEvent.enabledMoveTarget = false // Whether to enable picking vector data for mouse move events

  // map.scene.globe.showGroundAtmosphere = false// Turn off the atmosphere
  // map.scene.skyAtmosphere.show = true
  // map.scene.fog.enabled = true
  // map.scene.fog.density = 0.00005 // Ground 0.00005 Seabed 0.00008
  // map.scene.fog.minimumBrightness = 0.03 // 0.03

  // map.scene.skyAtmosphere.hueShift = 0.0
  // map.scene.skyAtmosphere.saturationShift = 0.1
  // map.scene.skyAtmosphere.brightnessShift = 0.08 // Ground 0.08 Seabed

  globalNotify("Known Issue Tips", `(1) The current example only supports WebGL1 rendering, and does not support WebGL2 yet.`)

  addLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let windLayer
function addLayer() {
  windLayer = new mars3d.layer.WindLayer({
    particlesNumber: 9000,
    fadeOpacity: 0.996,
    dropRate: 0.003,
    dropRateBump: 0.01,
    speedFactor: 0.2,
    lineWidth: 4.0,
    // Ribbon configuration
    colors: [
      "rgb(4,14,216)",
      "rgb(32,80,255)",
      "rgb(65,150,255)",
      "rgb(109,193,255)",
      "rgb(134,217,255)",
      "rgb(156,238,255)",
      "rgb(175,245,255)",
      "rgb(206,255,255)",
      "rgb(255,254,71)",
      "rgb(255,235,0)",
      "rgb(255,196,0)",
      "rgb(255,144,0)",
      "rgb(255,72,0)",
      "rgb(255,0,0)",
      "rgb(213,0,0)",
      "rgb(158,0,0)"
    ]
  })
  map.addLayer(windLayer)

  loadNetCDF("//data.mars3d.cn/file/apidemo/wind.nc").then((data) => {
    windLayer.setData(data)
  })
}

let canrefresh

// Parameter adjustment panel
function onParticleSystemOptionsChange(options) {
  clearTimeout(canrefresh)
  canrefresh = setTimeout(() => {
    windLayer.setOptions(options)
  }, 500)
}

//Load and parse NC data
function loadNetCDF(filePath) {
  return new Promise(function (resolve) {
    const request = new XMLHttpRequest()
    request.open("GET", filePath)
    request.responseType = "arraybuffer"

    request.onload = function () {
      const arrayToMap = function (array) {
        return array.reduce(function (map, object) {
          map[object.name] = object
          return map
        }, {})
      }

      // eslint-disable-next-line new-cap
      const NetCDF = new netcdfjs(request.response)
      const variables = arrayToMap(NetCDF.variables)
      const uAttributes = arrayToMap(variables.U.attributes)
      const vAttributes = arrayToMap(variables.V.attributes)

      const arrLon = NetCDF.getDataVariable("lon").flat()
      const arrLat = NetCDF.getDataVariable("lat").flat()
      const arrU = NetCDF.getDataVariable("U").flat()
      const maxU = uAttributes.max.value
      const minU = uAttributes.min.value
      const arrV = NetCDF.getDataVariable("V").flat()
      const maxV = vAttributes.max.value
      const minV = vAttributes.min.value

      //Construct the format data required by the WindLayer class
      const result = {
        xmin: Math.min(...arrLon),
        xmax: Math.max(...arrLon),
        ymin: Math.min(...arrLat),
        ymax: Math.max(...arrLat),
        rows: arrLat.length,
        cols: arrLon.length,
        udata: arrU, // cross wind speed
        vdata: arrV, // Longitudinal wind speed
        umin: minU,
        umax: maxU,
        vmin: minV,
        vmax: maxV
      }
      resolve(result)
    }
    request.send()
  })
}

// change color
function changeColor(color) {
  windLayer.colors = [color]
}
