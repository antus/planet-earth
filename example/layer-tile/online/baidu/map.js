// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

const creditHtml = `© 2023 Baidu - <span>Planning approval number: GS(2023)3206</span>
- Jiachaizizi 11111342- <a target="_blank" href="https://map.baidu.com/zt/client/service/index.html">Terms of Service</a>`

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.667339, lng: 117.301893, alt: 40357, heading: 2, pitch: -68 },
    highDynamicRange: false
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "Baidu Electronics",
      icon: "img/basemaps/gaode_vec.png",
      type: "baidu",
      layer: "vec",
      credit: creditHtml,
      show: true
    },
    {
      name: "Baidu Image",
      icon: "img/basemaps/gaode_img.png",
      type: "group",
      layers: [
        { name: "basemap", type: "baidu", layer: "img_d" },
        { name: "note", type: "baidu", layer: "img_z" }
      ],
      credit: creditHtml
    },
    {
      name: "Baidu Dark Blue",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "baidu",
      layer: "custom",
      style: "midnight",
      credit: creditHtml
    },
    {
      name: "Baidu Black",
      icon: "img/basemaps/bd-c-dark.png",
      type: "baidu",
      layer: "custom",
      style: "dark",
      credit: creditHtml
    },
    {
      name: "Offline Baidu tiles (example)",
      icon: "img/basemaps/arcgis.png",
      type: "baidu",
      url: "//data.mars3d.cn/tile/baiduVec/{z}/{x}/{y}.jpg",
      maximumLevel: 12
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
  addCreditDOM()

  globalNotify("Known Issue Tips", `(1) After Baidu tile correction, text annotations are misaligned at the splicing of some tiles.`)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  removeCreditDOM()
  map = null
}

// overlaid layers
let tileLayer

function addTileLayer() {
  removeTileLayer()

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  tileLayer = new mars3d.layer.BaiduLayer({
    layer: "time"
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

//Add an additional div to the lower status bar to display layer copyright information
let creditDOM
function addCreditDOM() {
  const locationBar = map.controls.locationBar?.container
  if (locationBar) {
    creditDOM = mars3d.DomUtil.create("div", "mars3d-locationbar-content mars3d-locationbar-autohide", locationBar)
    creditDOM.style["pointer-events"] = "all"
    creditDOM.style.float = "left"
    creditDOM.style.marginLeft = "20px"

    creditDOM.innerHTML = map.basemap?.options?.credit || ""

    map.on(mars3d.EventType.changeBasemap, function (event) {
      creditDOM.innerHTML = event.layer?.options?.credit || ""
    })
  }
}
function removeCreditDOM() {
  if (creditDOM) {
    mars3d.DomUtil.remove(creditDOM)
    creditDOM = null
  }
}
