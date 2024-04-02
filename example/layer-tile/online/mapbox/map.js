// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.675177, lng: 117.323257, alt: 81193, heading: 0, pitch: -79 }
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "mapbox image",
      icon: "img/basemaps/mapboxSatellite.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki0adkar2b0e19mv9tpiewld",
      token: mars3d.Token.mapbox,
      tilesize: 256,
      scaleFactor: false,
      show: true
    },
    {
      name: "mapbox street map",
      icon: "img/basemaps/mapboxStreets.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki0a0ire3jvh19r92vwfau1e",
      token: mars3d.Token.mapbox
    },
    {
      name: "mapbox base map",
      icon: "img/basemaps/mapboxTerrain.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki09kw472a8j19mvog00aoe0",
      token: mars3d.Token.mapbox
    },
    {
      name: "mapbox black basemap",
      icon: "img/basemaps/bd-c-dark.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki0a2mtc2vyo1bqu76p8ks8m",
      token: mars3d.Token.mapbox
    },
    {
      name: "mapbox gray basemap",
      icon: "img/basemaps/bd-c-grayscale.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki0a92b123qo1aluk0e5v7sb",
      token: mars3d.Token.mapbox
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

  globalNotify("Known Issue Tips", `(1) The mapbox token has expired, please apply for a replacement by yourself mars3d.Token.updateMapbox("key value").`)
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
  tileLayer = new mars3d.layer.MapboxLayer({
    username: "marsgis",
    styleId: "cki0a92b123qo1aluk0e5v7sb",
    token: mars3d.Token.mapbox
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
