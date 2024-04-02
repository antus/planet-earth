// // // // import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.794987, lng: 117.22661, alt: 4142.1, heading: 356.4, pitch: -60.8 }
  },
  // Method 1: Configure in the parameters before creating the earth
  layers: [
    {
      name: "Vector Tile Layer",
      icon: "img/basemaps/osm.png",
      type: "arcgis-pbf", // Type defined in \lib\mars3d\thirdParty\pbf-protomaps\ArcGISPbfLayer.js
      url: "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
      styleUrl: "https://jsapi.maps.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db/resources/styles/root.json",
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
  map.basemap = 2023
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
