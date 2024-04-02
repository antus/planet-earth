// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

const creditHtml = `©2023 Zhongke Star Map- <span>Plan approval number: GS (2023) No. 1924</span>
- Jiatestizizi11111577 - <a href="https://geovisearth.com/declaration#/user" target="_blank" trace="tos">Terms of Service</a> `

//Official address of star map: https://datacloud.geovisearth.com/support/map/summary

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.675177, lng: 117.323257, alt: 81193, heading: 0, pitch: -79 },
    highDynamicRange: false
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      pid: 10,
      name: "Star Map Image",
      icon: "/img/basemaps/tdt_img.png",
      type: "group",
      layers: [
        {
          name: "basemap",
          type: "xyz",
          url: "https://tiles{s}.geovisearth.com/base/v1/img/{z}/{x}/{y}?token=82455ef06c72bb3a35bbb4d7d05fd9eceb96a94dc942a056b8feb0e5928ed96f",
          subdomains: "123"
        },
        {
          name: "note",
          type: "xyz",
          url: "https://tiles{s}.geovisearth.com/base/v1/cia/{z}/{x}/{y}?token=82455ef06c72bb3a35bbb4d7d05fd9eceb96a94dc942a056b8feb0e5928ed96f",
          subdomains: "123"
        }
      ],
      show: true,
      credit: creditHtml
    },
    {
      pid: 10,
      name: "Star Map Electronics",
      icon: "/img/basemaps/tdt_vec.png",
      type: "xyz",
      url: "https://tiles{s}.geovisearth.com/base/v1/vec/{z}/{x}/{y}?token=82455ef06c72bb3a35bbb4d7d05fd9eceb96a94dc942a056b8feb0e5928ed96f",
      subdomains: "123",
      credit: creditHtml
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
  tileLayer = new mars3d.layer.XyzLayer({
    name: "Terrain Shading",
    url: "https://tiles{s}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?token=82455ef06c72bb3a35bbb4d7d05fd9eceb96a94dc942a056b8feb0e5928ed96f",
    subdomains: "123",
    maximumLevel: 9
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
