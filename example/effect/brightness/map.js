// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.795863, lng: 117.212909, alt: 2113, heading: 25, pitch: -34 }
  },
  layers: [
    {
      pid: 2040,
      type: "3dtiles",
      name: "Hefei City",
      url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
      maximumScreenSpaceError: 1,
      style: {
        color: {
          conditions: [["true", "color('rgba(42, 160, 224, 1)')"]]
        }
      },
      marsJzwStyle: true,
      highlight: { type: "click", color: "#FFFF00" },
      popup: "all",
      show: true
    },
    {
      type: "geojson",
      name: "Road Line",
      url: "//data.mars3d.cn/file/geojson/hefei-road.json",
      symbol: {
        styleOptions: {
          width: 12,
          materialType: "PolylineGlow",
          materialOptions: {
            color: "#FF4500",
            opacity: 0.8,
            glowPower: 0.2
          }
        }
      },
      popup: "{name}",
      show: true
    },
    {
      type: "geojson",
      name: "River (surface)",
      url: "//data.mars3d.cn/file/geojson/hefei-water.json",
      symbol: {
        type: "waterC",
        styleOptions: {
          normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
          frequency: 5000.0, // Number that controls the wave number.
          animationSpeed: 0.05, // Number that controls the animation speed of water.
          amplitude: 9.0, // Number that controls the amplitude of the water wave.
          specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
          baseWaterColor: "#00baff", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
          blendColor: "#00baff" // The rgba color object used when blending from water to non-water.
        }
      },
      popup: "{name}",
      show: true
    }
  ]
}

let brightnessEffect

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = 2017 // switch to blue basemap

  //Construction effect
  brightnessEffect = new mars3d.effect.BrightnessEffect()
  map.addEffect(brightnessEffect)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//The brightness changes
function setBrightness(value) {
  brightnessEffect.brightness = value
}

function setBrightnessEffect(val) {
  brightnessEffect.enabled = val
}
