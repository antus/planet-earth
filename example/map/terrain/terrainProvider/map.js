// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

/**
 * Merge attribute parameters to overwrite the corresponding configuration in config.json
 * @type {object}
 */
var mapOptions = {
  //Method 1: Configure the terrain parameters in the parameters before creating the earth [Currently, 1 ball only supports 1 terrain service]
  terrain: {
    url: "http://data.mars3d.cn/terrain",
    show: true
  },
  control: {
    baseLayerPicker: true,
    terrainProviderViewModels: getTerrainProviderViewModelsArr() // Optional array of terrain from baseLayerPicker panel
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

  map.on(mars3d.EventType.terrainLoadSuccess, function (event) {
    console.log("Terrain service loading completed", event)
  })
  map.on(mars3d.EventType.terrainLoadError, function (event) {
    console.log("Terrain service loading failed", event)
  })

  // Method 2: Update terrainProvider after creating the earth (created using mars3d.layer.createTerrainProvider factory method) [Currently, 1 ball only supports 1 terrain service]
  map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
    url: "http://data.mars3d.cn/terrain"
  })

  //Method 3: Layer method (generally used for switching between multiple terrains in layer management)
  // const terrainLayer = new mars3d.layer.TerrainLayer({
  //   url: "http://data.mars3d.cn/terrain"
  // })
  // map.addLayer(terrainLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function radioTerrain(type) {
  switch (type) {
    case "none": // No terrain
      map.terrainProvider = mars3d.LayerUtil.getNoTerrainProvider()
      break
    case "xyz": // Standard xyz service
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        url: "http://data.mars3d.cn/terrain"
      })
      break
    case "arcgis": // ArcGIS terrain service
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        type: "arcgis",
        url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
      })

      globalNotify(
        "Known Issue Tips",
        `For example, if the layer is not displayed or the service URL access times out, it is because the national surveying and mapping authorities currently block foreign map services that have not been reviewed and approved. You can use it if you need to circumvent the firewall or refer to the sample code to replace the local service address. `
      )
      break
    case "ion": // cesium official ion online service
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        type: "ion",
        requestWaterMask: true,
        requestVertexNormals: true
      })

      globalNotify(
        "Known Issue Tips",
        `For example, if the layer is not displayed or the service URL access times out, it is because the national surveying and mapping authorities currently block foreign map services that have not been reviewed and approved. You can use it if you need to circumvent the firewall or refer to the sample code to replace the local service address. `
      )
      break
    case "gee": // Google Earth Enterprise Services
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        type: "gee",
        url: "http://www.earthenterprise.org/3d",
        proxy: "//server.mars3d.cn/proxy/"
      })
      break
    case "vr": // vr terrain service
      map.terrainProvider = mars3d.LayerUtil.createTerrainProvider({
        type: "vr",
        url: "https://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/"
      })
      break
    default:
  }
}

//Terrain can be turned on and off
function enabledTerrain(val) {
  map.hasTerrain = val
}

// Whether to enable triangulation network
function enabledTerrainSJW(val) {
  map.scene.globe._surface.tileProvider._debug.wireframe = val
}

function getTerrainProviderViewModelsArr() {
  return [
    new Cesium.ProviderViewModel({
      name: "No terrain",
      tooltip: "WGS84 standard sphere",
      iconUrl: "img/basemaps/TerrainEllipsoid.png",
      creationFunction: function () {
        return mars3d.LayerUtil.getNoTerrainProvider()
      }
    }),
    new Cesium.ProviderViewModel({
      name: "China Terrain",
      tooltip: "China's domestic terrain provided by Mars Technology",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          url: "http://data.mars3d.cn/terrain"
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "ArcGIS terrain",
      tooltip: "China's domestic terrain provided by Mars Technology",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          type: "arcgis",
          url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "Global Terrain",
      tooltip: "High-resolution global terrain provided by Cesium officials",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          type: "ion",
          requestWaterMask: true,
          requestVertexNormals: true
        })
      }
    })
  ]
}
