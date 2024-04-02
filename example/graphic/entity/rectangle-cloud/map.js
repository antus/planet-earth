// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 12.845055, lng: 112.931363, alt: 24286797, heading: 3, pitch: -90 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
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

  const graphic = new mars3d.graphic.RectangleEntity({
    coordinates: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
    style: {
      height: 6000,
      materialType: mars3d.MaterialType.RectSlide,
      materialOptions: {
        image: "img/tietu/cloud.png",
        color: Cesium.Color.WHITE.withAlpha(0.6),
        speed: 0.5,
        pure: true
      },
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(3000000, 100000000)
    }
  })
  map.graphicLayer.addGraphic(graphic)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
