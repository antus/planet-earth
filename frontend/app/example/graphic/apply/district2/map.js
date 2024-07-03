// import * as mars3d from "mars3d"

var map

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
const color = "#363635"
var mapOptions = {
  scene: {
    center: { lat: 25.845231, lng: 117.57678, alt: 488175, heading: 358, pitch: -42 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: color, // sky background color
    globe: {
      baseColor: color, // Earth ground background color
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  control: {
    baseLayerPicker: false
  },
  terrain: { show: false },
  basemaps: [],
  layers: []
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

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

//Add Anhui Province base map and wall
function addAnhui() {
  // Satellite base map of Anhui Province
  const tileLayer = new mars3d.layer.XyzLayer({
    url: "//data.mars3d.cn/tile/anhui/{z}/{x}/{y}.png",
    minimumLevel: 0,
    maximumLevel: 12,
    rectangle: { xmin: 114.883371, xmax: 119.649144, ymin: 29.395253, ymax: 34.650809 }
  })
  map.addLayer(tileLayer)

  // Anhui Province Boundary Wall
  const anhuiWall = new mars3d.layer.GeoJsonLayer({
    name: "Anhui Province Border Wall",
    url: "//data.mars3d.cn/file/geojson/areas/340000.json",
    //Customized parsing data
    onCreateGraphic: function (options) {
      const points = options.positions[0] // coordinates
      const attr = options.attr // attribute information

      console.log("Original coordinates of the boundary wall", points)

      mars3d.PolyUtil.computeSurfaceLine({
        map,
        positions: points,
        has3dtiles: false,
        splitNum: 300
      }).then((result) => {
        console.log("Boundary wall interpolation calculation completed coordinates", result.positions)

        const graphic = new mars3d.graphic.WallPrimitive({
          positions: result.positions,
          style: {
            addHeight: -15000,
            diffHeight: 15000, // wall height
            materialType: mars3d.MaterialType.Image2,
            materialOptions: {
              image: "./img/textures/fence-top.png",
              color: "rgba(0,255,255,0.6)"
            }
            // renderState: Cesium.RenderState.fromCache({
            //   blending: Cesium.BlendingState.ALPHA_BLEND,
            //   depthTest: {
            //     enabled: true,
            //     func: Cesium.DepthFunction.LESS
            //   },
            //   cull: {
            //     enabled: true,
            //     face: Cesium.CullFace.BACK
            //   },
            //   depthMask: true
            // })
          },
          attr
        })
        anhuiWall.addGraphic(graphic)
      })
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
        Hefei City: { color: "rgba(0,255,255,0.3)" }
      }
    },
    popup: "{name}"
  })
  map.addLayer(shiLayer)
}

//Add related objects of the demonstration city
function addCenterCity(graphicLayer) {
  const point = [117.234218, 31.814155, 0]

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
        },
        flat: true
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}
