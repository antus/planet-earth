// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tilesetLayer
let tilesetBoxClip


var mapOptions = {
  scene: {
    center: { lat: 31.842844, lng: 117.251112, alt: 125, heading: 6, pitch: -36 }
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

  // Model
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Teaching Building",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
    maximumScreenSpaceError: 16,
    flyTo: true
  })
  map.addLayer(tilesetLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function drawExtent() {
  tilesetBoxClip.clear()
  map.graphicLayer.clear()

  map.graphicLayer.startDraw({
    type: "box",
    style: {
      color: "#ffffff",
      opacity: 0.2,
      dimensions: new Cesium.Cartesian3(10, 10, 10)
    },
    success: function (graphic) {
      const point = graphic.point
      map.graphicLayer.clear()

      tilesetBoxClip.position = point
      eventTarget.fire("hasDraw", { point })
    }
  })
}

//Demo data
function tilesetBoxClipDemo(point) {
  tilesetBoxClip = new mars3d.thing.TilesetBoxClip({
    layer: tilesetLayer,
    position: point,
    dimensions: new Cesium.Cartesian3(20, 10, 15),
    showBox: true,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0,
    clipOutSide: false
  })
  map.addThing(tilesetBoxClip)
}

// Whether to display the box
function showModelMatrix(val) {
  tilesetBoxClip.showBox = val
}

//X length changes
function onChangeDimensionsX(newValue) {
  tilesetBoxClip.dimensions.x = newValue
  tilesetBoxClip.redraw()
}

// Y length changes
function onChangeDimensionsY(newValue) {
  tilesetBoxClip.dimensions.y = newValue
  tilesetBoxClip.redraw()
}

// Z length changes
function onChangeDimensionsZ(newValue) {
  tilesetBoxClip.dimensions.z = newValue
  tilesetBoxClip.redraw()
}

//The coordinates change
function onChangePosition(point) {
  tilesetBoxClip.position = point
}

// clear
function clear() {
  tilesetBoxClip.clear()
}
