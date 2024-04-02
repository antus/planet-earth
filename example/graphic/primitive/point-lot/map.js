// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let graphicLayerElllipsoid

const center = Cesium.Cartesian3.fromDegrees(117.167848, 31.814011, 46) // incident point

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.805861, lng: 117.158491, alt: 1311, heading: 53, pitch: -45 }
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
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayerElllipsoid = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayerElllipsoid)

  //Hemisphere range circle
  createEllipsoid(true, false)

  //Add point set
  const resource = new Cesium.Resource({
    url: "//data.mars3d.cn/file/apidemo/diffusion.json"
  })
  resource
    .fetchJson()
    .then(function (rs) {
      globalNotify("Known problem prompt", `Loading hundreds of thousands of data, please wait patiently~`)

      setTimeout(() => {
        creteaPointPrimitive(graphicLayer, rs)
      }, 500)
    })
    .catch(function (error) {
      globalAlert(error, "Error loading data")
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

//Add point set
function creteaPointPrimitive(graphicLayer, rs) {
  clr.init()

  const degree = 45 // angle
  const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(degree), 0, 0)

  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  for (let i = 1, len = rs.length; i < len; i++) {
    const item = rs[i]

    if (i % 2 === 0) {
      continue //Extract data and reduce the amount of data
    }

    const val = item[3]
    const par1Position = mars3d.PointUtil.getPositionByHprAndOffset(center, new Cesium.Cartesian3(item[0], item[1], item[2]), hpr)

    //Add points
    const graphic = new mars3d.graphic.PointPrimitive({
      position: par1Position,
      style: {
        pixelSize: 5,
        color: clr.getColor(val)
      },
      tooltip: "Concentration value:" + val
    })
    graphicLayer.addGraphic(graphic)
  }
  graphicLayer.enabledEvent = true // restore event
}

//Hemisphere range circle
function createEllipsoid(redShow, yellowShow) {
  graphicLayerElllipsoid.clear()
  let radiu = 200
  const redSphere = new mars3d.graphic.EllipsoidEntity({
    name: "Danger Circle",
    position: center,
    style: {
      radii: new Cesium.Cartesian3(radiu, radiu, radiu),
      maximumConeDegree: 90,
      slicePartitions: 45,
      stackPartitions: 45,
      color: Cesium.Color.RED.withAlpha(0.3),
      outline: true,
      outlineColor: Cesium.Color.WHITE.withAlpha(0.8)
    },
    show: redShow
  })
  graphicLayerElllipsoid.addGraphic(redSphere)

  // Whether to display a red danger circle
  redSphere.show = redShow

  radiu = 400
  const yellowSphere = new mars3d.graphic.EllipsoidEntity({
    name: "Warning Circle",
    position: center,
    style: {
      radii: new Cesium.Cartesian3(radiu, radiu, radiu),
      maximumConeDegree: 90,
      slicePartitions: 45,
      stackPartitions: 45,
      color: Cesium.Color.YELLOW.withAlpha(0.3),
      outline: true,
      outlineColor: Cesium.Color.WHITE.withAlpha(0.8)
    },
    show: yellowShow
  })
  graphicLayerElllipsoid.addGraphic(yellowSphere)

  // Whether to display a yellow warning circle
  yellowSphere.show = yellowShow
}

// color processing
const clr = {
  span: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07],
  colors: ["#FFEDA0", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"],
  init: function () {
    for (let k = 0, length = this.colors.length; k < length; k++) {
      this.colors[k] = Cesium.Color.fromCssColorString(this.colors[k]).withAlpha(0.6)
    }
  },
  getColor: function (num) {
    let length = this.span.length + 1
    if (length > this.colors.length) {
      length = this.colors.length
    }

    for (let k = 0; k < length; k++) {
      if (num < this.span[k]) {
        return this.colors[k]
      }
    }
    return this.colors[length - 1]
  }
}
