// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

var mapOptions = {
  scene: {
    center: { lat: 28.441881, lng: 119.482881, alt: 133, heading: 240, pitch: -2 },
    globe: {
      depthTestAgainstTerrain: true
    }
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

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false,
    luminanceAtZenith: 0.6
  })
  map.addLayer(tiles3dLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  setTimeout(() => {
    //Add some demo data
    addDemoGraphic1()
  }, 5000)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const viewShed = new mars3d.graphic.SkylineBody({
    position: [119.481595, 28.440286, 134.2],
    style: {
      heading: 262,
      pitch: -9.3,
      color: "#00ffff",
      opacity: 0.4
    }
  })
  graphicLayer.addGraphic(viewShed)

  viewShed.flyTo({ pitch: -45 })
}

function addGraphic() {
  const viewShed = new mars3d.graphic.SkylineBody({
    style: {
      color: "#00ffff",
      opacity: 0.4
    }
  })
  graphicLayer.addGraphic(viewShed)

  viewShed.flyTo({ pitch: -45 })
}

function clear() {
  graphicLayer.clear()
}
