// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 0.590681, lng: -105.909459, alt: 18992377.9, heading: 3.5, pitch: -89.9 },
    contextOptions: { webgl: { alpha: true } }, // Allow transparency, only Map initialization can be passed in [key code]
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    ellipsoid: new Cesium.Ellipsoid(1737400, 1737400, 1737400),
    cameraController: {
      constrainedAxis: false
    }
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "Moon Map",
      icon: "img/basemaps/google_vec.png",
      type: "xyz",
      url: "https://moon.bao.ac.cn/gis3globleMarsMoon/tiles/getTiles/MoonTile/2000/jpg/{z}/{reverseY}/{x}",
      crs: "EPSG:4326",
      show: true
    }
  ],
  terrain: {
    url: "https://moon.bao.ac.cn/gis3globleMarsMoon/tilesets/MoonTerrain/2000/",
    show: true
  },
  control: {
    baseLayerPicker: false,
    locationBar: {
      fps: true,
      template:
        "<div>Altitude: {alt} meters</div> <div class='hide700'>Level: {level}</div><div>Direction: {heading}°</div> <div>Pitch angle: {pitch}°</div><div class='hide700'>View height: {cameraHeight} meters</div>"
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
