// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 29.968111, lng: 106.437663, alt: 8098707, heading: 5, pitch: -88 }
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "Electronic Map",
      icon: "img/basemaps/google_vec.png",
      type: "xyz",
      url: "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      subdomains: "1234",
      chinaCRS: mars3d.ChinaCRS.GCJ02,
      show: true
    },
    {
      name: "image map",
      icon: "img/basemaps/gaode_img.png",
      type: "xyz",
      url: "//data.mars3d.cn/tile/googleImg/{z}/{x}/{y}.jpg",
      maximumLevel: 12
    },
    {
      name: "EPSG4490 image",
      icon: "img/basemaps/tdt_img.png",
      type: "xyz",
      url: "http://t3.tianditu.gov.cn/img_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={z}&layer=img&style=default&tilerow={y}&tilecol={x}&tilematrixset=c&format=tiles&tk=6c99c7793f41fccc4bd595b03711913e",
      crs: "EPSG:4490" //Identification coordinate system
    }
  ]
}

//String template supported by xyz layer url:
// {z}: The level of slicing in the tiling scheme. Level zero is the root of the quadtree pyramid.
// {x}: X coordinate of the tile in the tiling scheme, where 0 is the westernmost tile.
// {y}: Y coordinate of the tile in the tiling scheme, where 0 is the northernmost tile.
// {s}: One of the available subdomains, used to overcome the browser's limit on the number of concurrent requests per host.
// {reverseX}: X coordinate of the tile in the tiling scheme, where 0 is the easternmost tile.
// {reverseY}: Y coordinate of the tile in the tiling scheme, where 0 is the southernmost tile.
// {reverseZ}: The level of slicing in the tiling scheme, where level 0 is the maximum level of the quadtree pyramid. In order to use reverseZ, maximumLevel must be defined.
// {westDegrees}: The geodesic west edge of the tile.
// {southDegrees}: The geodesic south edge of the tile.
// {eastDegrees}: The east edge of the tile in geodetic degrees.
// {northDegrees}: The geodesic north edge of the tile.
// {westProjected}: The west edge of the tile in the Mercator projection coordinates of the tile scheme.
// {southProjected}: The south edge of the tile in the Mercator projection coordinates of the tile scheme.
// {eastProjected}: :The east edge of the tile in the Mercator projection coordinates of the tile scheme.
// {northProjected}: The north edge of the tile in the Mercator projection coordinates of the tile scheme.
// {width}: The width of each tile in pixels.
// {height}: The height of each tile in pixels.

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
  addTileLayer()
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
  tileLayer = new mars3d.layer.XyzLayer({
    url: "//data.mars3d.cn/tile/dizhiChina/{z}/{x}/{y}.png",
    minimumLevel: 0,
    maximumLevel: 10,
    rectangle: { xmin: 69.706929, xmax: 136.560941, ymin: 15.831038, ymax: 52.558005 },
    opacity: 0.7,
    center: { lat: 22.43392, lng: 113.23887, alt: 8157553, heading: 354, pitch: -82 },
    flyTo: true
  })
  map.addLayer(tileLayer)

  // This method demonstrates how to load the map when the offset needs to be set internally.
  // tileLayer = new mars3d.layer.XyzLayer({
  //   url: "'url'&z={z_2}&y={y}&x={x}",
  //   customTags: {
  //     z_2: function (imageryProvider, x, y, level) {
  //       return level - 2
  //     }
  //   }
  // })
  // map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
