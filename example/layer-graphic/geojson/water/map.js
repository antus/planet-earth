// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

let zmGraphic
let waterLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 29.791718, lng: 121.479859, alt: 29, heading: 187, pitch: -14 }
  },
  layers: [
    {
      type: "3dtiles",
      name: "Overall model",
      url: "//data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",
      position: { alt: 15.2 },
      maximumScreenSpaceError: 1,
      show: true
    },
    {
      type: "geojson",
      name: "River (surface)",
      url: "//data.mars3d.cn/file/geojson/hedao-nei.json",
      symbol: {
        type: "waterC",
        styleOptions: {
          height: 17, // water surface height
          normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
          frequency: 8000.0, // Number that controls the wave number.
          animationSpeed: 0.02, // Number that controls the animation speed of water.
          amplitude: 5.0, // Number that controls the amplitude of the water wave.
          specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
          baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
          blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
          opacity: 0.4, // transparency
          clampToGround: false // Whether to stick to the ground
        }
      },
      show: true
    }
  ]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  waterLayer = new mars3d.layer.GeoJsonLayer({
    name: "River (surface)",
    url: "//data.mars3d.cn/file/geojson/hedao-wai.json",
    symbol: {
      type: "waterC",
      styleOptions: {
        height: 16, // water surface height
        offsetHeight: 0,
        normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
        frequency: 8000.0, // Number that controls the wave number.
        animationSpeed: 0.02, // Number that controls the animation speed of water.
        amplitude: 5.0, // Number that controls the amplitude of the water wave.
        specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
        baseWaterColor: "#006ab4", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
        blendColor: "#006ab4", // The rgba color object used when blending from water to non-water.
        opacity: 0.4 // transparency
      }
    }
  })
  map.addLayer(waterLayer)

  //Bind event
  waterLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })
  waterLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })

  // Gate control
  zmGraphic = new mars3d.graphic.ModelEntity({
    name: "gate",
    position: [121.479813, 29.791278, 16],
    style: {
      url: "//data.mars3d.cn/gltf/mars/zhamen.glb",
      heading: 105
    }
  })
  map.graphicLayer.addGraphic(zmGraphic)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let timeInv
// height update
function updateHeight(height) {
  zmGraphic.height = 16 + height // Valve height

  waterLayer.eachGraphic((graphic) => {
    graphic.offsetHeight = height // Water height changes
  })
}

/**
 * Open the valve
 *
 * @export
 * @param {number} height Valve height Unit: m
 * @param {number} time //Time unit: s
 * @returns {void} None
 */
function openZm(height, time) {
  let thisHeight = 0 // current height
  const endHeight = height // end height

  const step = time / 0.1 // step size
  const stepHeight = (endHeight - thisHeight) / step // Each time the valve and water surface move upward

  //Open from the current location when "Open" is clicked again
  updateHeight(thisHeight)

  clearInterval(timeInv)
  timeInv = setInterval(() => {
    thisHeight += stepHeight //The current height after moving up, equivalent to real-time update

    if (thisHeight >= endHeight) {
      thisHeight = endHeight
      clearInterval(timeInv) // Clear the timer. When the height value of the current valve is equal to the height value of the valve at the end, stop moving upward and close the timer.
    }
    updateHeight(thisHeight)
  }, 100)
}

/**
 * Close valve
 *
 * @export
 * @param {number} height Valve height Unit: m
 * @param {number} time //Time unit: s
 * @returns {void} None
 */
function closeZm(height, time) {
  let thisHeight = height
  const endHeight = 0

  const step = time / 0.1
  const stepHeight = (endHeight - thisHeight) / step

  updateHeight(thisHeight)

  clearInterval(timeInv)
  timeInv = setInterval(() => {
    thisHeight += stepHeight

    if (thisHeight <= endHeight) {
      thisHeight = endHeight
      clearInterval(timeInv)
    }
    updateHeight(thisHeight)
  }, 100)
}
