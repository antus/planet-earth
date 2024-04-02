// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.628661, lng: 117.251952, alt: 46390, heading: 2, pitch: -68 }
  }
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

  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// add bookmark
function butAddTxtName(name) {
  // Get index dynamically
  const item = {
    name,
    center: map.getCameraView()
  }

  map
    .expImage({
      download: false,
      width: 300
    })
    .then((result) => {
      item.img = result.image
      eventTarget.fire("addImgObject", { item })
    })
}

//Fly to the perspective
function flytoView(center) {
  map.setCameraView(center)
}
