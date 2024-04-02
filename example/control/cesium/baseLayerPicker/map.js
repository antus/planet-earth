// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = function (option) {
  option.control = {
    baseLayerPicker: false // Whether to display the layer selection control
  }
  return option
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  // Method 2: After creating the earth, call addControl on demand (directly new the control corresponding to the type type)
  const baseLayerPicker = new mars3d.control.BaseLayerPicker({
    icon: "img/svg/baseLayerPicker.svg"
  })
  map.addControl(baseLayerPicker)

  map.on(mars3d.EventType.changeBasemap, (event) => {
    console.log("The basemap was switched, the current basemap is ", map.basemap)
  })

  // setTimeout(() => {
  //   map.basemap = 2017
  // }, 5000)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Get custom basemap switching
function getImageryProviderArr() {
  const providerViewModels = []
  let imgModel

  imgModel = new Cesium.ProviderViewModel({
    name: "local picture",
    tooltip: "Local single image",
    iconUrl: "img/basemaps/esriNationalGeographic.png",
    category: "Standard coordinate system",
    creationFunction: function () {
      return mars3d.LayerUtil.createImageryProvider({
        type: "image",
        url: "//data.mars3d.cn/file/img/world/world.jpg"
      })
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "Heaven Map Image",
    tooltip: "Tiantu Global Image Map Service (National Bureau of Surveying and Mapping)",
    iconUrl: "img/basemaps/tdt_img.png",
    category: "Standard coordinate system",
    creationFunction: function () {
      return [
        mars3d.LayerUtil.createImageryProvider({
          type: "tdt",
          layer: "img_d",
          key: mars3d.Token.tiandituArr
        }),
        mars3d.LayerUtil.createImageryProvider({
          type: "tdt",
          layer: "img_z",
          key: mars3d.Token.tiandituArr
        })
      ]
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "Bing image",
    iconUrl: "img/basemaps/bingAerial.png",
    tooltip: "HD image map provided by Microsoft",
    category: "Standard coordinate system",
    creationFunction: function () {
      return mars3d.LayerUtil.createImageryProvider({
        type: "bing",
        layer: "Aerial"
      })
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "ESRI Image",
    iconUrl: "img/basemaps/esriWorldImagery.png",
    tooltip: "HD image map provided by ESRI",
    category: "Standard coordinate system",
    creationFunction: function () {
      return mars3d.LayerUtil.createImageryProvider({
        type: "arcgis",
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
      })
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "Google Image",
    tooltip: "Google Image Map Service",
    iconUrl: "img/basemaps/google_img.png",
    category: "National Bureau of Surveying Offset Coordinate System",
    creationFunction: function () {
      return [
        mars3d.LayerUtil.createImageryProvider({ type: "google", layer: "img_d" }),
        mars3d.LayerUtil.createImageryProvider({ type: "google", layer: "img_z" })
      ]
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "Gaode Image",
    tooltip: "Amap Image Map Service",
    iconUrl: "img/basemaps/gaode_img.png",
    category: "National Bureau of Surveying Offset Coordinate System",
    creationFunction: function () {
      return [
        mars3d.LayerUtil.createImageryProvider({ type: "gaode", layer: "img_d" }),
        mars3d.LayerUtil.createImageryProvider({ type: "gaode", layer: "img_z" })
      ]
    }
  })
  providerViewModels.push(imgModel)

  return providerViewModels
}

function getTerrainProviderViewModelsArr() {
  return [
    new Cesium.ProviderViewModel({
      name: "No terrain",
      tooltip: "WGS84 standard sphere",
      iconUrl: "img/basemaps/TerrainEllipsoid.png",
      creationFunction: function () {
        return new Cesium.EllipsoidTerrainProvider({
          ellipsoid: Cesium.Ellipsoid.WGS84
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "Global Terrain",
      tooltip: "High-resolution global terrain provided by Cesium officials",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return Cesium.createWorldTerrainAsync({
          requestWaterMask: true,
          requestVertexNormals: true
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "China Terrain",
      tooltip: "China domestic terrain provided by Mars3D",
      iconUrl: "img/basemaps/TerrainSTK.png",
      creationFunction: function () {
        return new Cesium.CesiumTerrainProvider({
          url: "http://data.mars3d.cn/terrain",
          requestWaterMask: true,
          requestVertexNormals: true
        })
      }
    })
  ]
}
