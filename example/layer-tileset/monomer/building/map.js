// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let geoJsonLayerDTH

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 43.821193, lng: 125.143124, alt: 990, heading: 342, pitch: -50 }
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

  // 3D model
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    type: "3dtiles",
    name: "campus",
    url: "//data.mars3d.cn/3dtiles/qx-xuexiao/tileset.json",
    position: { alt: 279.0 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tilesetLayer)

  //Single layer
  geoJsonLayerDTH = new mars3d.layer.GeoJsonLayer({
    name: "School-Single",
    url: "//data.mars3d.cn/file/geojson/dth-xuexiao-fd.json",
    symbol: {
      type: "polygonP",
      styleOptions: {
        //Single default display style
        color: "#00ffff",
        opacity: 0.2,
        clampToGround: true,
        classification: true,
        // buffer: 1,
        // Singletify the style highlighted after the mouse is moved or clicked
        highlight: {
          type: mars3d.EventType.click,
          color: "#ffff00",
          opacity: 0.6
        },

        label: {
          text: "{name}",
          height: 240, // The singleton surface has no height, so the center point text needs to specify a height value.
          opacity: 1,
          font_size: 30,
          color: "#ffffff",
          font_family: "楷体",
          outline: true,
          outlineColor: "#000000",
          outlineWidth: 3,
          background: false,
          backgroundColor: "#000000",
          backgroundOpacity: 0.1,
          scaleByDistance: true,
          scaleByDistance_far: 1000,
          scaleByDistance_farValue: 0.3,
          scaleByDistance_near: 10,
          scaleByDistance_nearValue: 1
        }
      }
    },
    popup: [
      { field: "name", name: "school place" },
      { field: "sfkf", name: "Is it open" },
      { field: "remark", name: "Remarks information" }
    ]
  })
  map.addLayer(geoJsonLayerDTH)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Whether to display the color of each building
function chkShowColor(val) {
  geoJsonLayerDTH.closePopup()

  if (val) {
    geoJsonLayerDTH.eachGraphic((graphic, index) => {
      graphic.setStyle({
        opacity: 0.2
      })
    })
  } else {
    geoJsonLayerDTH.eachGraphic((graphic) => {
      graphic.setStyle({
        opacity: 0.01
      })
    })
  }
}
