// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.053342, lng: 117.677104, alt: 187118, heading: 350, pitch: -50 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: " #120f44", // sky background color
    globe: {
      baseColor: "#120f44", // Earth ground background color
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  control: {
    baseLayerPicker: false
  },
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

  //Hefei City Boundary Wall
  const borderWall = new mars3d.layer.GeoJsonLayer({
    name: "Hefei City Boundary Wall",
    url: "//data.mars3d.cn/file/geojson/areas/340100.json",
    symbol: {
      type: "wallP",
      styleOptions: {
        setHeight: -25000,
        diffHeight: 25000, // wall height
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: "./img/textures/fence-top.png",
          color: "#4881A7"
        }
      }
    }
  })
  map.addLayer(borderWall)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addGraphics()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

/**
 * Add vector data
 *polygon surface PolylineEntity line light cone and LED digital display
 * @returns {void} None
 */
function addGraphics() {
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/areas/340100_full.json" })
    .then(function (geojson) {
      const arr = mars3d.Util.geoJsonToGraphics(geojson) // Parse geojson

      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]

        //polygon face
        const polygonEntity = new mars3d.graphic.PolygonEntity({
          positions: item.positions,
          style: {
            fill: true,
            color: "#4881a7",
            opacity: 0.5,
            label: {
              text: item.attr.name,
              font_size: 20,
              color: "#ffffff",
              font_family: "楷体",
              outline: true,
              outlineColor: "black",
              setHeight: 2000,
              visibleDepth: false,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000),
              scaleByDistance: new Cesium.NearFarScalar(200000, 1.0, 500000, 0.5)
            }
          }
        })
        graphicLayer.addGraphic(polygonEntity)

        // PolylineEntity line
        const graphicLine = new mars3d.graphic.PolylineEntity({
          positions: item.positions,
          style: {
            color: "rgba(255,255,255,0.5)",
            width: 1
          }
        })
        graphicLayer.addGraphic(graphicLine)

        // center point
        const center = item.attr.centroid

        // light cone
        const coneGlow = new mars3d.graphic.LightCone({
          position: center,
          style: {
            radius: 1500,
            height: 15000
          }
        })
        graphicLayer.addGraphic(coneGlow)

        // LED digital display
        const number = Math.floor(Math.random() * (4000 - 3000 + 1) + 3000) // Random number 3000-4000
        const graphic = new mars3d.graphic.DivGraphic({
          position: [center[0], center[1], 12000],
          style: {
            html: `<div class ="coneNum">${number}`,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000),
            scaleByDistance: new Cesium.NearFarScalar(200000, 1.0, 500000, 0.5)
          }
        })
        graphicLayer.addGraphic(graphic)
      }
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}
