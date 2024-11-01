// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 24.890314, lng: 118.165162, alt: 831420, heading: 355, pitch: -48 },
    fxaa: false
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

  //Add vector layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // add object
  addAnhui(graphicLayer)
  addCenterCity(graphicLayer)
  addOutCircle(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const diffHeight = 20000

//Add Anhui Province base map and wall
function addAnhui(graphicLayer) {
  // Satellite base map of Anhui Province
  const anhuiImg = new mars3d.graphic.RectanglePrimitive({
    positions: [
      [114.877478595, 29.395624614],
      [119.644266263, 34.655111865]
    ],
    style: {
      height: diffHeight,
      materialType: mars3d.MaterialType.Image2,
      materialOptions: {
        image: "//data.mars3d.cn/file/img/anhui.png"
      }
    }
  })
  graphicLayer.addGraphic(anhuiImg)

  // Anhui Province Boundary Wall
  const anhuiWall = new mars3d.layer.GeoJsonLayer({
    name: "Anhui Province Border Wall",
    url: "//data.mars3d.cn/file/geojson/areas/340000.json",
    symbol: {
      type: "wallP",
      styleOptions: {
        diffHeight, // wall height
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: "./img/icon/wall.png"
        }
      }
    }
  })
  map.addLayer(anhuiWall)

  // Boundary lines and names of cities in Anhui
  const shiLayer = new mars3d.layer.GeoJsonLayer({
    name: "Boundary lines of cities in Anhui",
    url: "//data.mars3d.cn/file/geojson/areas/340000_full.json",
    symbol: {
      type: "polyline",
      styleOptions: {
        color: "rgba(255,255,255,0.3)",
        setHeight: diffHeight,
        width: 2,
        label: {
          text: "{name}",
          position: "center",
          font_size: 18,
          color: "black",
          font_family: "楷体",
          outline: true,
          outlineColor: "#f1f3f4",
          outlineWidth: 3,
          //Sight distance settings
          scaleByDistance: true,
          scaleByDistance_far: 20000000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1
        }
      },
      styleField: "name",
      styleFieldOptions: {
        Hefei City: { color: "rgba(17, 230, 14)" }
      }
    },
    popup: "{name}"
  })
  map.addLayer(shiLayer)
}

//Add related objects of the demonstration city
function addCenterCity(graphicLayer) {
  const point = [117.234218, 31.814155, diffHeight + 500]

  // divgraphic annotation
  const divgraphic = new mars3d.graphic.DivGraphic({
    position: point,
    style: {
      html: `<div class="marsBlackPanel">
          <div class="marsBlackPanel-text">Model City</div>
      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // horizontal positioning
      verticalOrigin: Cesium.VerticalOrigin.CENTER // Vertical positioning
    }
  })
  graphicLayer.addGraphic(divgraphic)

  // Circular dynamic diffusion chart
  const cicle = new mars3d.graphic.CirclePrimitive({
    position: point,
    style: {
      radius: 16000,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "rgba(0,255,255,0.6)",
        count: 2,
        speed: 10
      }
    }
  })
  graphicLayer.addGraphic(cicle)
}

//Add surrounding circles, scales and other objects
function addOutCircle(graphicLayer) {
  const arrImg = [
    {
      //scale
      image: "./img/icon/calib.png",
      positions: [
        [113.564329, 35.654741],
        [120.802219, 28.844016]
      ]
    },
    {
      //scale
      image: "./img/icon/calib-value.png",
      positions: [
        [114.162597, 29.256489],
        [120.216593, 35.055444]
      ]
    },
    {
      // direction
      image: "./img/icon/calib-dir.png",
      positions: [
        [114.162597, 29.256489],
        [120.216593, 35.055444]
      ]
    }
  ]

  for (let i = 0; i < arrImg.length; i++) {
    const item = arrImg[i]
    const graphic = new mars3d.graphic.RectanglePrimitive({
      positions: item.positions,
      style: {
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: item.image,
          opacity: 0.4
        }
      }
    })
    graphicLayer.addGraphic(graphic)
  }

  // Rotating semi-ellipse
  let rotation = Cesium.Math.toRadians(50)
  function getRotationValue() {
    rotation += 0.005
    return rotation
  }
  const primitive1 = new mars3d.graphic.RectangleEntity({
    positions: [
      [114.642444, 34.789658],
      [119.814361, 29.425181]
    ],
    style: {
      materialType: mars3d.MaterialType.Image2,
      materialOptions: {
        image: "./img/icon/calib-semicircle.png",
        opacity: 0.2
      },
      clampToGround: true,
      rotation: new Cesium.CallbackProperty(getRotationValue, false),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false)
    }
  })
  graphicLayer.addGraphic(primitive1)
}
