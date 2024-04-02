// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.170953, lng: 121.485939, alt: 7473, heading: 10, pitch: -40 }
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

  map.basemap = 2017 // blue basemap

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Shanghai Buildings",
    url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
    maximumScreenSpaceError: 8,
    marsJzwStyle: true,
    style: {
      color: {
        conditions: [["true", "rgb(3, 104, 255)"]]
      }
    },
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add some demo data
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  // Three-dimensional wall diffusion effect, surface shape
  const diffuseWallGlow = new mars3d.graphic.DiffuseWall({
    positions: [
      [121.475616, 31.255374, 5.87],
      [121.482578, 31.248681, 10.85],
      [121.479447, 31.240235, 14.25],
      [121.470002, 31.240496, 12.92],
      [121.46538, 31.249206, 9.53],
      [121.475616, 31.255374, 5.87]
    ],
    style: {
      color: "#ffff00",
      diffHeight: 2000, // height
      speed: 10 // speed
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(diffuseWallGlow)
}

function addDemoGraphic2(graphicLayer) {
  // Three-dimensional wall diffusion effect, circular shape
  const circleDiffuseWallGlow = new mars3d.graphic.DiffuseWall({
    position: new mars3d.LngLatPoint(121.481165, 31.278668, 44.3), // Circle center point
    style: {
      diffHeight: 2000, // height
      radius: 600, // radius
      color: "#ff0000",
      speed: 10 // speed
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(circleDiffuseWallGlow)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CirclePrimitive({
    position: [121.522454, 31.267553, 61.9],
    style: {
      radius: 2000,
      materialType: mars3d.MaterialType.ScanLine,
      materialOptions: {
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        speed: 10
      },
      clampToGround: true // Whether to stick to the ground
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  let _rotation = Math.random()

  const graphic = new mars3d.graphic.CircleEntity({
    position: Cesium.Cartesian3.fromDegrees(121.504242, 31.23805, 27.88),
    style: {
      radius: 1500.0,
      //Scan material
      materialType: mars3d.MaterialType.CircleScan,
      materialOptions: {
        image: "img/textures/circle-scan.png",
        color: "#00ff00"
      },
      stRotation: new Cesium.CallbackProperty(function (e) {
        _rotation -= 0.1
        return _rotation
      }, false),
      classificationType: Cesium.ClassificationType.BOTH,
      clampToGround: true // Whether to stick to the ground
    },
    attr: { remark: "Example 4" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic5(graphicLayer) {
  let _rotation = Math.random()
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(121.526215, 31.245237, 123.5),
    style: {
      radius: 700.0,
      materialType: mars3d.MaterialType.CircleScan,
      materialOptions: {
        //Scan material
        image: "img/textures/circle-two.png",
        color: "#5fc4ee"
      },
      stRotation: new Cesium.CallbackProperty(function (e) {
        _rotation += 0.1
        return _rotation
      }, false),
      classificationType: Cesium.ClassificationType.BOTH,
      clampToGround: true // Whether to stick to the ground
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphic)
}
