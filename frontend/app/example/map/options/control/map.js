// import * as mars3d from "mars3d"

function initMap() {
  // There are 2 ways to add controls:

  const map = new mars3d.Map("mars3dContainer", {
    scene: {
      center: { lat: 33.938752, lng: 103.753712, alt: 18401000, heading: 0, pitch: -90 }
    },
    // Method 1: Configure the control parameters in the parameters before creating the earth
    control: {
      //The following are options related to controls supported by Cesium.Viewer
      baseLayerPicker: true, // basemaps basemap switching button
      homeButton: true, //View reset button
      sceneModePicker: true, // 2D and 3D switching button
      navigationHelpButton: true, // Help button
      infoBox: false, // information box
      selectionIndicator: true, // selection box
      vrButton: true, // vr mode button
      fullscreenButton: true, // full screen button
      animation: true, // Animation widget button
      timeline: true, // timeline

      //The following are the controls defined by mars3d.control
      contextmenu: { hasDefault: true },
      mouseDownView: true,
      zoom: { insertIndex: 1 },
      compass: { top: "10px", left: "5px" },
      distanceLegend: { left: "180px", bottom: "27px" }
    },
    basemaps: [
      {
        name: "Single picture",
        icon: "img/basemaps/offline.png",
        type: "image",
        url: "//data.mars3d.cn/file/img/world/world.jpg",
        show: true
      }
    ]
  })
  map.toolbar.style.bottom = "120px" // Modify the style of the toolbar control

  // Method 2: After creating the earth, call addControl on demand (directly new the control corresponding to the type type)
  const locationBar = new mars3d.control.LocationBar({
    fps: true,
    template:
      "<div>Longitude: {lng}</div> <div>Latitude: {lat}</div> <div>Altitude: {alt} meters</div> <div>Level: {level}</div> <div>Direction: {heading} degrees</div> <div>Pitch angle: {pitch} degrees</div><div>View height: {cameraHeight} meters</div>"
  })
  map.addControl(locationBar)

  console.log("Controls already exist on the map", map.controls)
}
