// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tiles3dLayer
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option = {
    scene: {
      center: { lat: 33.597401, lng: 119.031399, alt: 514, heading: 0, pitch: -46 },
      showSun: false,
      showMoon: false,
      showSkyBox: false,
      showSkyAtmosphere: false,
      fog: false,
      backgroundColor: "rgba(0,0,0,0)",
      backgroundImage: "url(/img/tietu/backGroundImg.jpg)",
      orderIndependentTranslucency: false,
      globe: {
        show: false, // Do not display the earth
        showGroundAtmosphere: false,
        enableLighting: false
      },
      clock: {
        currentTime: "2023-11-01 12:00:00" // Fixed light time
      },
      cameraController: {
        zoomFactor: 1.5,
        minimumZoomDistance: 0.1,
        maximumZoomDistance: 200000,
        enableCollisionDetection: false // Allow underground access
      }
    },
    control: {
      baseLayerPicker: false,
      sceneModePicker: false,
      locationBar: {
        fps: true,
        template: "<div>Longitude:{lng}</div> <div>Latitude:{lat}</div><div>Direction: {heading}°</div> <div>Pitch angle: {pitch}° </div>"
      }
    }
  }
  delete option.terrain
  delete option.basemaps
  delete option.layers

  return option
}

const storageName = "layer-tileset-manager-oneself"

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  // If there is a "+" symbol in the model address, you can add the following method for customized processing
  Cesium.Resource.ReplaceUrl = function (url) {
    if (url.endsWith(".json") || url.endsWith(".b3dm")) {
      return url.replace(/\+/gm, "%2B") // Escape the "+" symbol in 3dtiles
    } else {
      return url
    }
  }

  //Read localStorage value
  localforage.getItem(storageName).then(function (lastUrl) {
    eventTarget.fire("historyUrl", { url: lastUrl })
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function removeLayer() {
  if (tiles3dLayer) {
    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}

// Current page business related
function showModel(url) {
  removeLayer()
  if (!url) {
    return
  }

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: url,
    maximumScreenSpaceError: 1,
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // click event
  tiles3dLayer.on(mars3d.EventType.load, function (event) {
    console.log("Model loading completed", event)
    localforage.setItem(storageName, url) //Record historical values

    //Limit zoom level
    map.scene.screenSpaceCameraController.maximumZoomDistance = tiles3dLayer.boundingSphere.radius * 5

    // The model cannot be dragged and moved, but can be zoomed in, zoomed out, and rotated.
    // const center = tiles3dLayer.center.toCartesian()
    // const offset = new Cesium.HeadingPitchRange(0, 0, tiles3dLayer.boundingSphere.radius)
    // map.camera.lookAt(center, offset)

    // Automatic ground processing
    tiles3dLayer.clampToGround(10)
  })
}

function flyTo() {
  tiles3dLayer.flyTo()
}
