// import * as mars3d from "mars3d"

var map
let graphicLayer
let terrainClip

// Need to override the map attribute parameters in config.json (the merge is automatically processed in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.773023, lng: 116.473055, alt: 133111.3, heading: 40.4, pitch: -47.9 },
    orderIndependentTranslucency: false,
    backgroundImage: "url(/img/tietu/backGroundImg.jpg)",
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    globe: {
      baseColor: "rgba(0,0,0,0)",
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  control: {
    baseLayerPicker: true
  },
  terrain: { show: false }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = 2017

  //Add vector layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // All vector data under the graphicLayer layer will trigger this event
  graphicLayer.on(mars3d.EventType.click, (event) => {
    const attr = event.graphic?.attr
    if (attr) {
      globalMsg(attr.name + ":" + attr.adcode)
    }
  })

  // map.scene.debugShowFramesPerSecond = true

  terrainClip = new mars3d.thing.TerrainClip({
    image: false,
    splitNum: 80 // Well boundary interpolation number
  })
  map.addThing(terrainClip)

  mars3d.Util.fetchJson({ url: "http://data.mars3d.cn/file/geojson/areas/340100.json" })
    .then(function (geojson) {
      const arr = mars3d.Util.geoJsonToGraphics(geojson) // Parse geojson
      const options = arr[0]

      terrainClip.addArea(options.positions, { simplify: { tolerance: 0.002 } })
      terrainClip.clipOutSide = true

      const polylineGraphic = new mars3d.graphic.PolylineEntity({
        positions: options.positions,
        style: {
          width: 10,
          color: "#b3e0ff",
          depthFail: false,
          materialType: mars3d.MaterialType.PolylineGlow,
          materialOptions: {
            color: "#b3e0ff",
            glowPower: 0.3,
            taperPower: 1.0
          }
        }
      })
      graphicLayer.addGraphic(polylineGraphic)

      const wall = new mars3d.graphic.WallPrimitive({
        positions: options.positions,
        style: {
          setHeight: -20000,
          diffHeight: 20000, // wall height
          width: 10,
          materialType: mars3d.MaterialType.Image2,
          materialOptions: {
            image: "./img/textures/fence-top.png",
            color: "#0b88e3"
          }
        }
      })
      graphicLayer.addGraphic(wall)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })

  mars3d.Util.fetchJson({ url: "http://data.mars3d.cn/file/geojson/areas/340100_full.json" }).then(function (geojson) {
    const arr = mars3d.Util.geoJsonToGraphics(geojson) // Parse geojson
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const attr = item.attr // attribute information

      const graphic = new mars3d.graphic.PolylinePrimitive({
        positions: item.positions,
        style: {
          color: "rgba(255,255,255,0.3)",
          depthFail: true,
          width: 2
        },
        attr
      })
      graphicLayer.addGraphic(graphic)

      addCenterGraphi(attr)
    }
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addCenterGraphi(attr) {
  const circleGraphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(attr.centroid[0], attr.centroid[1], 100),
    style: {
      radius: 5000,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#0b88e3",
        count: 2,
        speed: 10
      }
    },
    attr
  })
  graphicLayer.addGraphic(circleGraphic)

  const divGraphic = new mars3d.graphic.DivGraphic({
    position: attr.centroid,
    style: {
      html: `<div class="mars-four-color mars3d-animation">
                <img src="${getImage()}"  class="four-color_bg"></img>
                <div class="four-color_name">${attr.name}</div>
            </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      clampToGround: true
    },
    attr
  })
  graphicLayer.addGraphic(divGraphic)
}

// Simplify geojson coordinates
function simplifyGeoJSON(geojson) {
  try {
    geojson = turf.simplify(geojson, { tolerance: 0.009, highQuality: true, mutate: true })
  } catch (e) {
    //
  }
  return geojson
}

// Get pictures based on random numbers
function getImage() {
  const num = Math.floor(Math.random() * 5)
  switch (num) {
    case 1:
      return "/img/icon/map-title-y.png"
    case 2:
      return "/img/icon/map-title-h.png"
    case 3:
      return "/img/icon/map-title-o.png"
    case 4:
      return "/img/icon/map-title-r.png"
    default:
      return "/img/icon/map-title-b.png"
  }
}
