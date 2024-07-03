// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

const creditHtml = `©2023 Tencent - <span>Plan approval number: GS(2023) No. 1</span>
- <a target="_blank" href="https://lbs.qq.com/terms.html">Terms of Service</a>`

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.82034, lng: 117.411297, alt: 56459, heading: 0, pitch: -87 },
    highDynamicRange: false
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "Tencent Electronics",
      icon: "img/basemaps/gaode_vec.png",
      type: "tencent",
      layer: "vec",
      show: true,
      credit: creditHtml
    },
    {
      name: "Tencent Image",
      icon: "img/basemaps/gaode_img.png",
      type: "group",
      layers: [
        { name: "basemap", type: "tencent", layer: "img_d" },
        { name: "note", type: "tencent", layer: "img_z" }
      ],
      credit: creditHtml
    },
    {
      name: "Tencent Dark Blue",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "tencent",
      layer: "custom",
      style: "4",
      credit: creditHtml
    }
  ]
}

var eventTarget = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  addCreditDOM()
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
  tileLayer = new mars3d.layer.TencentLayer({
    layer: "custom",
    style: "4"
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
