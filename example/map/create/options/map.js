// import * as mars3d from "mars3d"

function initMap(mapOptions) {

  var options = mars3d.Util.merge(mapOptions, {
    scene: {
      center: { lat: 30.054604, lng: 108.885436, alt: 17036414, heading: 0, pitch: -90 },
      showSun: true,
      showMoon: true,
      showSkyBox: true,
      showSkyAtmosphere: false, // Turn off the white outline around the ball map.scene.skyAtmosphere = false
      fog: true,
      fxaa: true,
      globe: {
        showGroundAtmosphere: false, // Turn off the atmosphere (white effect on the ball surface)
        depthTestAgainstTerrain: false,
        baseColor: "#546a53"
      },
      cameraController: {
        zoomFactor: 3.0,
        minimumZoomDistance: 1,
        maximumZoomDistance: 50000000,
        enableRotate: true,
        enableZoom: true
      },
      mapProjection: mars3d.CRS.EPSG3857, // Display Mercator projection in 2D
      mapMode2D: Cesium.MapMode2D.INFINITE_SCROLL// The world map can be scrolled left and right in 2D
    },
    control: {
      baseLayerPicker: true, // basemaps basemap switching button
      homeButton: true, //View reset button
      sceneModePicker: true, // 2D and 3D switching button
      navigationHelpButton: true, // Help button
      fullscreenButton: true, // full screen button
      contextmenu: { hasDefault: true } // Right-click menu
    },
    terrain: {
      url: "//data.mars3d.cn/terrain",
      show: true
    },
    basemaps: [
      {
        name: "Heaven Map Image",
        icon: "img/basemaps/tdt_img.png",
        type: "tdt",
        layer: "img_d",
        show: true
      }
    ]
  })

  //Create a 3D earth scene
  const map = new mars3d.Map("mars3dContainer", options)

  //Print test information
  console.log("Mars3d's Map main object construction completed", map)
  console.log("The native Cesium.Viewer of Cesium is ", map.viewer)


  console.log("Does the current computer support webgl2", Cesium.FeatureDetection.supportsWebgl2(map.scene))

  return map
}
