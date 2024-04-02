// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

let lineLayer // Vector layer object, used for graphic binding display
let tilesetLayer // 3dtiles model; add model selection

var mapOptions = {
  scene: {
    center: { lat: 34.215539, lng: 108.959582, alt: 817, heading: 2, pitch: -46 }
  }
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
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  globalNotify("Known Issue Tips", `(1) Currently all types of 3dtile data are not supported, please replace the url for self-test`)

  //Create vector data layer
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)

  showDytDemo()
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
    maximumScreenSpaceError: 1,

    //TilesetFlat construction parameters can be passed in. The following is the demonstration flattening area.
    flat: {
      precise,
      area: [
        {
          positions: [
            [108.959054, 34.219449, 405],
            [108.959821, 34.219449, 405],
            [108.959821, 34.220165, 405],
            [108.959054, 34.220165, 405]
          ]
        }
      ],
      editHeight: -24, // Relative height (unit: meters), based on the offset of the lowest point height of the flattened/submerged area
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat is a TilesetFlat object, because it has a 1-to-1 relationship with the model and has been built in
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}

function showTehDemo() {
  removeLayer()

  // The following data is processed by cesiumlab v3. Currently, its material has been offset. I don’t know the internal logic and specific values, so it cannot be flattened.
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei Swan Lake",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    center: { lat: 31.795308, lng: 117.21948, alt: 1820, heading: 0, pitch: -39 },

    editHeight: -140.0, // Relative height (unit: meters), based on the offset of the lowest point height of the flattened/submerged area
    flat: {
      precise,
      enabled: true
    },

    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat is a TilesetFlat object, because it has a 1-to-1 relationship with the model and has been built in
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
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

    editHeight: -18.0, // Relative height (unit: meters), based on the offset of the lowest point height of the flattened/submerged area
    flat: {
      precise,
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat is a TilesetFlat object, because it has a 1-to-1 relationship with the model and has been built in
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}

// Added callback event after flattening area
function onAddFlatArea(event) {
  const areaObj = event.area
  areaObj.lineId = addTestLine(areaObj.positions)

  // Trigger custom event addItem
  eventTarget.fire("addItem", event)
}

function removeLayer() {
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

// add rectangle
function btnDrawExtent(height) {
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

      tilesetLayer.flat.addArea(positions, { height })
    }
  })
}
// draw polygon
function btnDraw(height) {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5
    },
    success: function (graphic) {
      // Callback after successful drawing
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("The drawing coordinates are", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // Convenient for testing copy coordinates

      tilesetLayer.flat.addArea(positions, { height })
    }
  })
}
// clear
function removeAll() {
  tilesetLayer.flat.clear()

  map.graphicLayer.clear()
  lineLayer.clear()
}

//Change the flattening height
function changeFlatHeight(val) {
  tilesetLayer.flat.updateHeight(val)
}

// Whether to display the test boundary line
function chkShowLine(val) {
  lineLayer.show = val
}

function showHideArea(id, selected) {
  if (selected) {
    tilesetLayer.flat.showArea(id)
  } else {
    tilesetLayer.flat.hideArea(id)
  }
}

// Locate the model
function flyToGraphic(item) {
  const graphic = tilesetLayer.flat.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

//delete model
function deletedGraphic(areaId, lineId) {
  tilesetLayer.flat.removeArea(areaId)

  const graphicLine = lineLayer.getGraphicById(lineId)
  lineLayer.removeGraphic(graphicLine)
}

function addTestLine(positions) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      closure: true,
      color: "#ffffff",
      opacity: 0.8,
      width: 2,
      clampToGround: true
    }
  })
  lineLayer.addGraphic(graphic)

  // const graphic = new mars3d.graphic.PolygonEntity({
  //   positions: positions,
  //   style: {
  //     materialType: mars3d.MaterialType.Image,
  //     materialOptions: {
  //       image: "img/textures/poly-soil.jpg",
  // opacity: 0.8 // transparency
  //     },
  //     clampToGround: true
  //   }
  // })
  // lineLayer.addGraphic(graphic)

  return graphic.id
}
