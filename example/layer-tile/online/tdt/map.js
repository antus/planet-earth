// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

const creditHtml = `Ministry of Natural Resources - <span>Plan Approval Number: GS(2023) No. 336</span>
 - A test qualification number 1100471 - <a href="https://www.tianditu.gov.cn/about/contact.html?type=2" target="_blank" trace="tos">Terms of Service</a > `

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.675177, lng: 117.323257, alt: 81193, heading: 359, pitch: -79 },
    highDynamicRange: false
  },
  // Method 1: Configure in the parameters before creating the earth
  basemaps: [
    {
      name: "Heaven Map Image(EPSG:3857)",
      icon: "img/basemaps/tdt_img.png",
      type: "tdt",
      layer: "img_d",
      key: mars3d.Token.tiandituArr,
      show: true,
      credit: creditHtml
    },
    {
      name: "Tiantu Electronics (EPSG:3857)",
      icon: "img/basemaps/tdt_vec.png",
      type: "group",
      layers: [
        { name: "basemap", type: "tdt", layer: "vec_d", key: mars3d.Token.tiandituArr },
        { name: "note", type: "tdt", layer: "vec_z", key: mars3d.Token.tiandituArr }
      ],
      credit: creditHtml
    },
    {
      name: "Tiantu Terrain (EPSG:3857)",
      icon: "img/basemaps/tdt_ter.png",
      type: "group",
      layers: [
        { name: "basemap", type: "tdt", layer: "ter_d", key: mars3d.Token.tiandituArr },
        {
          name: "note",
          type: "tdt",
          layer: "ter_z",
          key: mars3d.Token.tiandituArr,
          // Represents the filtering method for reducing and enlarging tile data. The default value is LINEAR linear structure. Adjusting most maps to nearest filtering can effectively improve map clarity.
          minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
          magnificationFilter: Cesium.TextureMinificationFilter.NEAREST
        }
      ],
      credit: creditHtml
    },
    {
      name: "Heaven Map Image(EPSG:4326)",
      icon: "img/basemaps/tdt_img.png",
      type: "group",
      layers: [
        {
          name: "basemap",
          type: "tdt",
          layer: "img_d",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        },
        {
          name: "note",
          type: "tdt",
          layer: "img_z",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        }
      ],
      credit: creditHtml
    },
    {
      name: "Tiantu Electronics (EPSG:4326)",
      icon: "img/basemaps/tdt_vec.png",
      type: "group",
      layers: [
        {
          name: "basemap",
          type: "tdt",
          layer: "vec_d",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        },
        {
          name: "note",
          type: "tdt",
          layer: "vec_z",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        }
      ],
      credit: creditHtml
    },
    {
      name: "Topography of the sky (EPSG:4326)",
      icon: "img/basemaps/tdt_ter.png",
      type: "group",
      layers: [
        {
          name: "basemap",
          type: "tdt",
          layer: "ter_d",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        },
        {
          name: "note",
          type: "tdt",
          layer: "ter_z",
          crs: "EPSG:4326",
          key: mars3d.Token.tiandituArr
        }
      ],
      credit: creditHtml
    },

    {
      name: "Heavenly Map Image (English)",
      icon: "img/basemaps/tdt_img.png",
      type: "group",
      layers: [
        { name: "basemap", type: "tdt", layer: "img_d", key: mars3d.Token.tiandituArr },
        { name: "basemap", type: "tdt", layer: "img_e", key: mars3d.Token.tiandituArr }
      ],
      credit: creditHtml
    },
    {
      name: "Tiantu Electronics (English)",
      icon: "img/basemaps/tdt_vec.png",
      type: "group",
      layers: [
        { name: "basemap", type: "tdt", layer: "vec_d", key: mars3d.Token.tiandituArr },
        { name: "basemap", type: "tdt", layer: "vec_e", key: mars3d.Token.tiandituArr }
      ],
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

  //The reason why the three-dimensional text annotation is not clear: https://zhuanlan.zhihu.com/p/389945647

  // The higher the number, the better the performance, but the worse the visual quality. The default value is 2.
  // For different map data sources, the value between 0.66~1.33 has the highest map clarity.
  map.scene.globe.maximumScreenSpaceError = 4 / 3
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
  tileLayer = new mars3d.layer.TdtLayer({
    name: "Tiantu Image Annotation",
    layer: "img_z",
    key: mars3d.Token.tiandituArr
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
