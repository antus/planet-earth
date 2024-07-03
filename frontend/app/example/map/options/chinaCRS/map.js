// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

//The default is an unbiased coordinate system, which has been corrected internally. The current example demonstrates an offset coordinate system.

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  chinaCRS: mars3d.ChinaCRS.GCJ02, // Identification coordinate system
  scene: {
    center: { lat: 31.833439, lng: 117.212587, alt: 1237, heading: 0, pitch: -60 }
  },
  basemaps: [
    {
      name: "Heaven Map Image",
      icon: "/img/basemaps/tdt_img.png",
      type: "group",
      layers: [
        { name: "basemap", type: "tdt", layer: "img_d" },
        { name: "note", type: "tdt", layer: "img_z" }
      ]
    },
    {
      name: "Gaode Image",
      type: "group",
      icon: "/img/basemaps/gaode_img.png",
      layers: [
        { name: "basemap", type: "gaode", layer: "img_d" },
        { name: "note", type: "gaode", layer: "img_z" }
      ],
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
  map.hasTerrain = false

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei National University Science and Technology Park",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: 0 },
    maximumScreenSpaceError: 1,
    chinaCRS: mars3d.ChinaCRS.WGS84 // Identifies the coordinate system and automatically adds offsets
  })
  map.addLayer(tiles3dLayer)

  // Add Gaode offset coordinate points for comparison
  const graphic = new mars3d.graphic.PointEntity({
    position: [117.21343, 31.84052], // Picked up from https://lbs.amap.com/demo/jsapi-v2/example/geocoder/regeocoding
    style: {
      color: "#ff0000",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      clampToGround: true,
      label: {
        text: "I am the point of Gaode's offset coordinates",
        font_size: 18,
        color: "#ff0000",
        pixelOffsetY: -30,
        clampToGround: true
      }
    },
    popup: `I picked up Gaode from <a href="https://lbs.amap.com/demo/jsapi-v2/example/geocoder/regeocoding" target="_black" >Amap official website</a> Original offset coordinates`
  })
  map.graphicLayer.addGraphic(graphic)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
