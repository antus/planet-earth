// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.73204, lng: 117.286568, alt: 50785, heading: 359, pitch: -76 }
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

  //Construct the eagle eye map
  const overviewMap = new mars3d.control.OverviewMap({
    basemap: {
      name: "Tiantu Electronics",
      type: "group",
      layers: [
        { name: "basemap", type: "tdt", layer: "vec_d" },
        { name: "note", type: "tdt", layer: "vec_z" }
      ]
    },
    rectangle: {
      color: "#fecd78",
      opacity: 0.2,
      outline: 1,
      outlineColor: "#ff7800"
    },
    style: {
      right: "5px",
      top: "5px",
      width: "200px",
      height: "150px"
    }
  })
  map.addControl(overviewMap)

  //Add a vector object to the Eagle Eye minimap
  addGraphicToOverviewMap(overviewMap)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addGraphicToOverviewMap(overviewMap) {
  const mapEx = overviewMap.smallMap // also a mars3d.Map object

  const graphic = new mars3d.graphic.BillboardEntity({
    position: new Cesium.CallbackProperty(() => {
      return overviewMap.center
    }, false),
    style: {
      image: "img/marker/street2.png",
      scale: 0.5,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      rotation: new Cesium.CallbackProperty(() => {
        return map.camera.heading
      }, false)
    }
  })
  mapEx.graphicLayer.addGraphic(graphic)
}
