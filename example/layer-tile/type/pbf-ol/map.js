// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 20.758452, lng: 108.198353, alt: 7733736, heading: 358, pitch: -82 },
    globe: {
      baseColor: "#ffffff"
    },
    highDynamicRange: false
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "OSM Open Source Map",
      icon: "img/basemaps/osm.png",
      type: "mvt", // Type defined in lib\mars3d\thirdParty\pbf-ol\PbfolLayer.js
      url: "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}",
      key: mars3d.Token.mapbox,
      style: "mapbox-streets-v6",
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
  map = mapInstance // record map

  globalNotify("Known Issue Tips", `(1) The mapbox token has expired, please apply for a replacement by yourself mars3d.Token.updateMapbox("key value").`)

  globalNotify("Known problem tips", `(1) All PBF style types are not supported. (2) If some PBF data is not displayed, the corresponding parsing style code needs to be expanded and developed.`)

  // Defined in lib\mars3d\thirdParty\pbf-ol\PbfolLayer.js
  // const pbfLayer = new mars3d.layer.PbfolLayer({
  //   url: "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}",
  //   key: mars3d.Token.mapbox,
  //   style: "mapbox-streets-v6"
  // })
  // map.addLayer(pbfLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
