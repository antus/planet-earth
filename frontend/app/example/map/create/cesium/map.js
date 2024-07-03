// import * as mars3d from "mars3d"

function initMap(mapOptions) {
  // Construct the earth (you can use native Cesium or third-party SDK to construct Viewer)
  const viewer = new Cesium.Viewer("mars3dContainer", {
    animation: false,
    timeline: false,
    baseLayerPicker: false, // Whether to display the layer selection control
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
      Cesium.TileMapServiceImageryProvider.fromUrl(Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"))
    )
  })
  console.log("Cesium native Cesium construction completed", viewer) // Print test information

  // mars3d.Map can also directly pass in the external viewer that has been constructed, and supports all parameters of config.json
  var options = mars3d.Util.merge(mapOptions, {
    scene: {
      center: { lat: 30.054604, lng: 108.885436, alt: 17036414, heading: 0, pitch: -90 },
      fxaa: true
    },
    control: {
      contextmenu: { hasDefault: true } // Right-click menu
    }
  })
  
  const map = new mars3d.Map(viewer, options)

  console.log("Mars3d's Map main object construction completed", map) // Print test information
}
