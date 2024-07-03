// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let mapSplit

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 34.213866, lng: 108.956499, alt: 832, heading: 22, pitch: -35 }
  },
  control: {
    baseLayerPicker: false // Whether to display the layer selection control
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

  createControl()

  //Load the model layer [also supports the setLayerSplitDirection method to set the layer]
  // const tiles3dLayer = new mars3d.layer.TilesetLayer({
  //   url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
  //   position: { alt: -27 }
  // })
  // map.addLayer(tiles3dLayer)
  // mapSplit.setLayerSplitDirection(tiles3dLayer, Cesium.SplitDirection.RIGHT) // Split-screen rolling shutter for the model
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function createControl() {
  if (mapSplit) {
    return
  }
  map.basemap = null
  mapSplit = new mars3d.control.MapSplit({
    rightLayer: [
      { name: "Tiantu Satellite", type: "tdt", layer: "img_d" },
      {
        name: "Big Wild Goose Pagoda",
        type: "3dtiles",
        url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
        position: { alt: -27 }
      }
    ],
    leftLayer: [
      { name: "Tiantu Electronics", type: "tdt", layer: "vec_d" },
      { name: "Tiantu Notes", type: "tdt", layer: "vec_z" },
      {
        name: "Big Wild Goose Pagoda",
        type: "3dtiles",
        url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
        position: { alt: -27 },
        style: {
          color: {
            conditions: [["true", "rgba(255,255,0,0.8)"]]
          }
        }
      }
    ]
  })
  map.addControl(mapSplit)

  mapSplit.on(mars3d.EventType.mouseMove, function (event) {
    console.log("The mapSplit control was dragged", event)
  })

  window.mapSplit = mapSplit // only for test

  //Add 2 div text
  const addHTML = `
    <div style="position: absolute;top: 20px;left: -335px;width: 300px;height: 48px;line-height: 48px;border-radius: 3px;background-color: rgba(0,0,0, .6);font-size: 16px;color: #fff;text-align: center;pointer-events: none;"> Image on the left: Satellite remote sensing image in August 2021</div>
    <div style="position: absolute;top: 20px;left: 45px;width: 300px;height: 48px;line-height: 48px;border-radius: 3px;background-color: rgba(0,0,0,. 6);font-size: 16px;color: #fff;text-align: center;pointer-events: none;"> Image on the right: Satellite remote sensing image in August 2022</div>
  `
  const splitter = mars3d.DomUtil.parseDom(addHTML, true)
  mapSplit.container.appendChild(splitter)
}

function destroyControl() {
  if (mapSplit) {
    map.removeControl(mapSplit)
    mapSplit = null
    map.basemap = "ArcGIS Imagery"
  }
}
