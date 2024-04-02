// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

//Event object, used to throw events to the panel
var eventTarget = new mars3d.BaseClass()

var mapOptions = {
  scene: {
    center: { lat: 28.750173, lng: 116.904665, alt: 353676.9, heading: 1.4, pitch: -50 }
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

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Add some demo data
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/volumeCloud.json" })
    .then(function (data) {
      console.log("Demo data data", data)

      addDemoGraphic1(data)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const colors = [
  "rgb(0,0,0,0)",
  "rgb(170,36,250)",
  "rgba(212,142,254,0.13)",
  "rgba(238,2,48,0.12)",
  "rgba(254,100,92,0.11)",
  "rgba(254,172,172,0.1)",
  "rgba(140,140,0,0.09)",
  "rgba(200,200,2,0.08)",
  "rgba(252,244,100,0.07)",
  "rgba(16,146,26,0.06)",
  "rgba(0,234,0,0.05)",
  "rgba(166,252,168,0.04)",
  "rgba(30,38,208,0.03)",
  "rgba(122,114,238,0.02)",
  "rgba(192,192,254,0.01)"
]
const steps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65]

function addDemoGraphic1(data) {
  //Create a meteorological data volume rendering model
  const volumeCloud = new mars3d.graphic.VolumeCloud({
    data: {
      rows: data.rows, // Number of row grids
      cols: data.cols, // Number of column grids
      heights: data.heights, // Number of high grids
      values: data.values, // 3D data set array, the array length should be rows*cols*heights, the order is: [height1-row1-col1, height1-row1-col2,……,height1-row2-col1, height1- row2-col2,…,height2-row1-col1, height2-row1-col2,…]

      xmin: data.xmin, // Minimum longitude (degrees, -180-180)
      xmax: data.xmax, // Maximum longitude (degrees, -180-180)
      ymin: data.ymin, // minimum latitude (degrees, -90-90)
      ymax: data.ymax, // Maximum latitude (degrees, -90-90)
      zmin: data.zmin, // minimum height
      zmax: data.zmax // maximum height
    },
    steps,
    colors
    // flyTo: true
  })
  graphicLayer.addGraphic(volumeCloud)

  //Display boundaries to facilitate comparison testing
  showDebuggerRectangleOutline(volumeCloud)

  // setInterval(() => {
  //   for (let index = 0, len = data.values.length; index < len; index++) {
  //     if (data.values[index] > 20) {
  //       data.values[index] = Math.abs(data.values[index] * 1.001)
  //     }
  //   }

  //   volumeCloud.updateData({
  // rows: data.rows, // Number of row grids
  // cols: data.cols, // Number of column grids
  // heights: data.heights, // Number of high grids
  // values: data.values ​​// 3D data set array, the array length should be rows*cols*heights
  //   })
  // }, 1000)
}

// Display the boundaries of the Rectangle rectangle to facilitate comparison testing.
function showDebuggerRectangleOutline(volumeCloud) {
  const boxOutlineInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleOutlineGeometry({
      ellipsoid: Cesium.Ellipsoid.WGS84,
      rectangle: volumeCloud._rectangle,
      height: volumeCloud.options.data.zmin,
      extrudedHeight: volumeCloud.options.data.zmax
    }),
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
    }
  })

  map.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: boxOutlineInstance,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true
      })
    })
  )
}
