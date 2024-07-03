// Only mars3d v3.4 + versions before cesium1.95 support hypergraph layers
// // import * as mars3d from "mars3d"

var map

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: {
      lat: 28.440864,
      lng: 119.486477,
      alt: 588.23,
      heading: 268.6,
      pitch: -37.8,
      roll: 359.8
    },
    fxaa: true,
    requestRenderMode: true, // explicit rendering
    contextOptions: {
      requestWebgl1: true // Hypergraph does not support webgl2
    }
  },
  control: {
    infoBox: false
  },
  layers: []
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  globalNotify("Known Issue Tips", `Currently using the native Cesium+SuperMap3D plug-in method, many APIs are not supported. For the complete method, you need to refer to the Github open source code to switch Cesium to the super map version of Cesium.`)

  // showMaxNiaochaoDemo()
  showQxSuofeiyaDemo()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  removeLayer()
  map = null
}
let s3mLayer

function removeLayer() {
  if (s3mLayer) {
    map.basemap = 2021 // Switch to the default image basemap

    map.removeLayer(s3mLayer, true)
    s3mLayer = null
  }
}

// Example: Artificial Modeling Bird's Nest
function showMaxNiaochaoDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "Bird's Nest",
    url: "http://www.supermapol.com/realspace/services/3D-OlympicGreen/rest/realspace",
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // You can bind the Popup window and handle it arbitrarily in the callback method.
  // s3mLayer.bindPopup(function (event) {
  //   var attr = event.graphic.attr;
  // // attr["video"] = `<video src='//data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 300px;" ></video>`;
  // return mars3d.Util.getTemplateHtml({ title: "Petrochemical Plant", template: "all", attr: attr });
  // });

  // click event
  // s3mLayer.on(mars3d.EventType.click, function (event) {
  // console.log("3dtiles layer clicked", event);
  // });
}

// Example: Artificial Modeling CBD
function showMaxCBDDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "Artificially modeled CBD",
    url: "http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace",
    flyTo: true
  })
  map.addLayer(s3mLayer)
}

// Example: Underground pipe network
function showMaxPipeDemo() {
  removeLayer()
  globalMsg("The plug-in version does not currently support modification of the "fillForeColor" parameter")

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "Underground Pipe Network",
    url: "http://www.supermapol.com/realspace/services/3D-pipe/rest/realspace",
    center: { lat: 45.768407, lng: 126.621981, alt: 101, heading: 162, pitch: -38 },
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // Loading completed Promise
  s3mLayer.readyPromise.then(function (s3mLayer) {
    console.log("s3m model loading completed", s3mLayer)

    const layers = s3mLayer.layer

    const overGroundLayer = layers[25]
    overGroundLayer.style3D.fillForeColor.alpha = 0.5

    // for (var i = 0; i < layers.length; i++) {
    //   var layerName = layers[i].name;
    //   if (
    // layerName === "Rainwater Manhole Cover" ||
    // layerName === "Fire Manhole Cover" ||
    // layerName === "Remote water manhole cover" ||
    // layerName === "Domestic water manhole cover" ||
    // layerName === "Street Lamp Manhole Cover"
    //   ) {
    //     layers[i].setPBRMaterialFromJSON("./data/pbr/showUnderGround/jing2/UnityUDBJG2.json");
    //   }

    //   if (
    // layerName === "Gray water pipeline" ||
    // layerName === "Rainwater Pipeline" ||
    // layerName === "Fire water pipeline" ||
    // layerName === "Domestic water pipeline" ||
    // layerName === "Street Light Pipeline"
    //   ) {
    //     layers[i].setPBRMaterialFromJSON("./data/pbr/showUnderGround/piple.json");
    //   }
    // }
  })
}

// Example: BIM
function showBIMQiaoDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "BIM Bridge",
    url: "http://www.supermapol.com/realspace/services/3D-BIMMoXing/rest/realspace",
    center: { lat: 40.234379, lng: 116.148777, alt: 223, heading: 331, pitch: -19 },
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // Loading completed Promise
  s3mLayer.readyPromise.then(function (s3mLayer) {
    console.log("s3m model loading completed", s3mLayer)

    const layers = s3mLayer.layer
    for (const layer of layers) {
      //Set border line
      layer.style3D.lineWidth = 0.5
      layer.style3D.lineColor = new Cesium.Color(60 / 255, 60 / 255, 60 / 255, 1)
      layer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame
      layer.wireFrameMode = Cesium.WireFrameType?.EffectOutline
    }
  })
}

// Example: Oblique Photography Harbin Sophia Church
function showQxSuofeiyaDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "Harbin Sophia Church",
    type: "supermap_s3m",
    url: "http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace",
    s3mOptions: {
      selectEnabled: false
    },
    position: { alt: 140 },
    center: { lat: 45.769034, lng: 126.623702, alt: 291, heading: 250, pitch: -36 },
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // event
  s3mLayer.on(mars3d.EventType.load, function (event) {
    console.log("s3m model loading completed", event)
  })
}

// Example: Oblique Photography Salzburg
function showQxSrsbDemo() {
  removeLayer()

  s3mLayer = new mars3d.layer.S3MLayer({
    name: "Salzburg",
    url: "http://www.supermapol.com/realspace/services/3D-srsb/rest/realspace",
    // position: { alt: 400 },
    center: { lat: 47.803782, lng: 13.04465, alt: 582, heading: 0, pitch: -40 },
    flyTo: true
  })
  map.addLayer(s3mLayer)

  // Loading completed Promise
  s3mLayer.readyPromise.then(function (s3mLayer) {
    console.log("s3m model loading completed", s3mLayer)

    // Find the water layer
    // var waterLayer = s3mLayer.layer[1];
    // var style = new Cesium.Style3D();
    // style.bottomAltitude = 5; //Set the bottom elevation of the water surface layer to ensure that the water surface fits the model
    // waterLayer.style3D = style;
  })
}
