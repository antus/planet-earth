// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

var mapOptions = {
  scene: {
    center: { lat: 31.826361, lng: 117.223374, alt: 805, heading: 206, pitch: -38 }
  }
}

let tilesetLayer

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  globalNotify("Known Issue Tips", `(1) Currently all types of 3dtile data are not supported, please replace the url for self-test`)

  showTehDemo()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// true: Precise mode, directly stores the range, but when the number of passed range vertices is large, it will cause a certain degree of lag;
// false: Mask mode, rasterization range, efficiency has nothing to do with the number of range vertices, but aliasing is serious after zooming in
const precise = false

function showDytDemo() {
  removeLayer()

  //Add model
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Big Wild Goose Pagoda",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { alt: -27 },
    maximumScreenSpaceError: 1, // The TilesetFlat construction parameter can be passed in. The following is a demonstration flattening area.
    clip: {
      precise: precise,
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.clip is a TilesetClip object. Because it has a 1-to-1 relationship with the model, it has been built in.
  tilesetLayer.clip.on(mars3d.EventType.addItem, onAddClipArea)
}

function showTehDemo() {
  removeLayer()

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei Swan Lake",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    flyTo: true,

    //TilesetClip construction parameters can be passed in. The following is the demo flattening area.
    clip: {
      precise: precise,
      area: [
        {
          positions: [
            [117.217219, 31.81957, 33.1],
            [117.220855, 31.818821, 31.8],
            [117.220938, 31.817249, 30.6],
            [117.21743, 31.816218, 31.7]
          ]
        }
      ],
      enabled: true
    }
  })
  map.addLayer(tilesetLayer)

  // Will be executed multiple times, and will be called back after reloading.
  // tilesetLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
  // console.log("Trigger allTilesLoaded event", event)
  // })

  // tilesetLayer.clip is a TilesetClip object. Because it has a 1-to-1 relationship with the model, it has been built in.
  tilesetLayer.clip.on(mars3d.EventType.addItem, onAddClipArea)
}

function showXianDemo() {
  removeLayer()

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "County Community",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    skipLevelOfDetail: true,
    preferLeaves: true,
    cullWithChildrenBounds: false,
    center: { lat: 28.440675, lng: 119.487735, alt: 639, heading: 269, pitch: -38 },
    clip: {
      precise: precise,
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // Will be executed multiple times, and will be called back after reloading.
  // tilesetLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
  // console.log("Trigger allTilesLoaded event", event)
  // })

  // tilesetLayer.clip is a TilesetClip object. Because it has a 1-to-1 relationship with the model, it has been built in.
  tilesetLayer.clip.on(mars3d.EventType.addItem, onAddClipArea)
}

function removeLayer() {
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

// Added callback event after flattening area
function onAddClipArea(event) {
  eventTarget.fire("addItem", event)
}

// draw rectangle
function btnDrawExtent() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      tilesetLayer.clip.addArea(positions)
    }
  })
}
//Draw the cropping area
function btnDraw() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      tilesetLayer.clip.addArea(positions)
    }
  })
}
// clear
function removeAll() {
  map.graphicLayer.clear()
  tilesetLayer.clip.clear()
}

// Locate the model
function flyToGraphic(item) {
  const graphic = tilesetLayer.clip.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

//delete model
function deletedGraphic(item) {
  tilesetLayer.clip.removeArea(item)
}

function showHideArea(id, selected) {
  if (selected) {
    tilesetLayer.clip.showArea(id)
  } else {
    tilesetLayer.clip.hideArea(id)
  }
}
