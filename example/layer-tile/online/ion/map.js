// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 25.229785, lng: 113.226084, alt: 3339440, heading: 0, pitch: -81 },
    highDynamicRange: false
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "Ion Image Map",
      icon: "img/basemaps/bingAerial.png",
      type: "ion",
      assetId: 2,
      accessToken: mars3d.Token.ion,
      show: true
    },
    {
      name: "Ion electronic map",
      icon: "img/basemaps/bingmap.png",
      type: "ion",
      assetId: 4,
      accessToken: mars3d.Token.ion
    }
  ]
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  globalNotify(
    "Known Issue Tips",
    `For example, if the layer is not displayed or the service URL access times out, it is because the national surveying and mapping authorities currently block foreign map services that have not been reviewed and approved.
     You can use it if you need to circumvent the firewall or refer to the sample code to replace the local service address. `
  )
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// overlaid layers
let tileLayer
function addTileLayer() {
  removeTileLayer()

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  tileLayer = new mars3d.layer.IonLayer({
    layer: "Ion electronic map",
    minimumTerrainLevel: 4,
    minimumLevel: 4,
    assetId: 4,
    accessToken: mars3d.Token.ion
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
