// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  control: {
    mouseDownView: {
      rightDrag: true
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

  map.scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 150000

  //Limit the pitch angle: max, min (default -90)
  map.setPitchRange(-10)

  //Set mouse operating habits and change the middle button and right button
  map.changeMouseModel(true)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function shadingMaterials(val) {
  if (val === 1) {
    //Set mouse operating habits and change the middle button and right button
    map.changeMouseModel(true)
  } else {
    map.changeMouseModel(false)
  }
}

//Release the operation of ALT key
// const getInputAction_old = Cesium.ScreenSpaceEventHandler.prototype.getInputAction
// Cesium.ScreenSpaceEventHandler.prototype.getInputAction = function (type, modifier) {
//   if (modifier === Cesium.KeyboardEventModifier.ALT) {
//     modifier = undefined
//   }
//   return getInputAction_old.bind(this)(type, modifier)
// }
