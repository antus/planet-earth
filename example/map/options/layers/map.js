// import * as mars3d from "mars3d"

function initMap() {
  // There are 3 ways to add overlayable layers (no type parameters are required except for the specified type, and other parameters are the same):

  const map = new mars3d.Map("mars3dContainer", {
    scene: {
      center: { lat: 26.035977, lng: 115.209641, alt: 2703280, heading: 7, pitch: -78 }
    },
    control: {
      baseLayerPicker: true, // basemaps basemap switching button
      homeButton: true, //View reset button
      sceneModePicker: true, // 2D and 3D switching button
      navigationHelpButton: true, // Help button
      fullscreenButton: true, // full screen button
      contextmenu: { hasDefault: true } // Right-click menu
    },
    basemaps: [
      {
        name: "Single picture",
        icon: "img/basemaps/offline.png",
        type: "image",
        url: "//data.mars3d.cn/file/img/world/world.jpg",
        show: true
      }
    ],
    // Method 1: Configure the layers parameters in the parameters before creating the earth
    layers: [
      {
        name: "Heaven and Map Notes",
        type: "tdt",
        layer: "img_z",
        show: true
      }
    ]
  })

  // Method 2: Call addLayer to add a layer after creating the earth (directly use new layer class corresponding to the type type)
  const tileLayer = new mars3d.layer.XyzLayer({
    url: "//data.mars3d.cn/tile/dizhiChina/{z}/{x}/{y}.png",
    minimumLevel: 0,
    maximumLevel: 10,
    rectangle: { xmin: 69.706929, xmax: 136.560941, ymin: 15.831038, ymax: 52.558005 },
    opacity: 0.7
  })
  map.addLayer(tileLayer)

  // Method 3: Call addLayer to add a layer after creating the earth (created with the mars3d.layer.create factory method)
  const layerImg = mars3d.LayerUtil.create({
    type: "image",
    url: "//data.mars3d.cn//file/img/radar/201906211112.PNG",
    rectangle: { xmin: 73.16895, xmax: 134.86816, ymin: 12.2023, ymax: 54.11485 },
    alpha: 0.7
  })
  map.addLayer(layerImg)
}
