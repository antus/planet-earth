// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 20.772952, lng: 82.609338, alt: 22604251, heading: 0, pitch: -90 }
  }
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

let moveGraphicObj
const tiles3dLayerArr = []
let removeGraphicArr
/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Add a model and the effect will be better

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
}

const heatMapPoints = [
  {
    lng: 124.66,
    lat: 28.9236,
    value: 64
  },
  {
    lng: 125.459,
    lat: 30.4274,
    value: 32
  },
  {
    lng: 124.072,
    lat: 29.8663,
    value: 52
  },
  {
    lng: 125.51,
    lat: 30.1191,
    value: 37
  },
  {
    lng: 125.48,
    lat: 30.1596,
    value: 28
  },
  {
    lng: 124.418,
    lat: 29.646,
    value: 78
  },
  {
    lng: 125.945,
    lat: 29.8979,
    value: 15
  },
  {
    lng: 125.953,
    lat: 29.8974,
    value: 12
  },
  {
    lng: 125.969,
    lat: 29.9043,
    value: 3
  },
  {
    lng: 124.036,
    lat: 29.8524,
    value: 49
  },
  {
    lng: 124.693,
    lat: 28.8889,
    value: 21
  },
  {
    lng: 124.296,
    lat: 29.5377,
    value: 95
  },
  {
    lng: 125.6764,
    lat: 28.2778,
    value: 62
  },
  {
    lng: 124.807,
    lat: 28.8152,
    value: 58
  },
  {
    lng: 125.532,
    lat: 30.0749,
    value: 43
  },
  {
    lng: 125.581,
    lat: 30.081,
    value: 85
  },
  {
    lng: 124.666,
    lat: 28.9189,
    value: 71
  },
  {
    lng: 125.604,
    lat: 30.0683,
    value: 30
  },
  {
    lng: 125.607,
    lat: 30.0016,
    value: 31
  },
  {
    lng: 124.3511,
    lat: 30.8339,
    value: 19
  },
  {
    lng: 124.3534,
    lat: 30.8282,
    value: 53
  },
  {
    lng: 124.658,
    lat: 28.9619,
    value: 5
  },
  {
    lng: 124.5528,
    lat: 28.2587,
    value: 92
  },
  {
    lng: 125.515,
    lat: 30.0963,
    value: 79
  },
  {
    lng: 125.508,
    lat: 28.1153,
    value: 83
  },
  {
    lng: 125.718,
    lat: 28.1134,
    value: 6
  },
  {
    lng: 125.621,
    lat: 28.3521,
    value: 69
  },
  {
    lng: 125.761,
    lat: 28.1573,
    value: 49
  },
  {
    lng: 125.0952,
    lat: 28.5621,
    value: 36
  },
  {
    lng: 124.0385,
    lat: 28.2342,
    value: 59
  },
  {
    lng: 124.068,
    lat: 28.03,
    value: 45
  },
  {
    lng: 125.186,
    lat: 28.6449,
    value: 76
  },
  {
    lng: 125.773,
    lat: 28.1509,
    value: 18
  },
  {
    lng: 125.784,
    lat: 28.1342,
    value: 57
  },
  {
    lng: 125.779,
    lat: 28.1559,
    value: 43
  },
  {
    lng: 125.3913,
    lat: 28.3484,
    value: 17
  },
  {
    lng: 124.2254,
    lat: 28.054,
    value: 59
  },
  {
    lng: 125.911,
    lat: 28.2146,
    value: 8
  },
  {
    lng: 124.5206,
    lat: 28.6804,
    value: 70
  },
  {
    lng: 125.816,
    lat: 28.9691,
    value: 22
  },
  {
    lng: 125.533,
    lat: 32.0648,
    value: 98
  },
  {
    lng: 125.4404,
    lat: 28.4261,
    value: 28
  },
  {
    lng: 125.656,
    lat: 32.1201,
    value: 37
  },
  {
    lng: 125.615,
    lat: 32.0506,
    value: 7
  },
  {
    lng: 125.156,
    lat: 32.7588,
    value: 72
  },
  {
    lng: 125.4849,
    lat: 28.4087,
    value: 11
  },
  {
    lng: 124.904,
    lat: 29.3991,
    value: 44
  },
  {
    lng: 125.375,
    lat: 32.5393,
    value: 6
  },
  {
    lng: 124.874,
    lat: 29.0635,
    value: 72
  },
  {
    lng: 124.021,
    lat: 28.9738,
    value: 42
  },
  {
    lng: 124.906,
    lat: 29.045,
    value: 62
  },
  {
    lng: 124.969,
    lat: 29.0386,
    value: 57
  },
  {
    lng: 124.918,
    lat: 28.9935,
    value: 95
  },
  {
    lng: 124.967,
    lat: 29.0373,
    value: 50
  },
  {
    lng: 124.135,
    lat: 29.3523,
    value: 65
  },
  {
    lng: 124.019,
    lat: 32.0917,
    value: 91
  },
  {
    lng: 125.608,
    lat: 32.1106,
    value: 68
  },
  {
    lng: 124.327,
    lat: 29.9546,
    value: 82
  },
  {
    lng: 124.333,
    lat: 29.9514,
    value: 71
  },
  {
    lng: 124.569,
    lat: 29.6004,
    value: 55
  },
  {
    lng: 124.224,
    lat: 29.9135,
    value: 64
  },
  {
    lng: 124.983,
    lat: 29.0323,
    value: 9
  },
  {
    lng: 124.829,
    lat: 29.3126,
    value: 90
  },
  {
    lng: 124.689,
    lat: 28.8967,
    value: 64
  },
  {
    lng: 125.162,
    lat: 30.2822,
    value: 21
  },
  {
    lng: 124.4536,
    lat: 30.7667,
    value: 23
  },
  {
    lng: 124.5568,
    lat: 30.7904,
    value: 55
  },
  {
    lng: 125.5364,
    lat: 28.4002,
    value: 25
  },
  {
    lng: 125.106,
    lat: 30.8595,
    value: 30
  },
  {
    lng: 124.9966,
    lat: 30.4707,
    value: 37
  },
  {
    lng: 125.194,
    lat: 30.1376,
    value: 59
  }
]

//Add vector data
function addGraphics() {
  map.setCameraView({ lat: 18, lng: 126, alt: 800000, heading: 354.2109524366, pitch: -29.3531104185 })

  //Vector data that will be moved later
  let yiLiaoShip, jiuYuanShip

  //Add building
  const buildPositions = [
    { lat: 38, lng: 117.3, name: "Maritime Safety Administration" },
    { lat: 33, lng: 117.1, name: "Command Center" },
    { lat: 30, lng: 116.5, name: "Smart Center" }
  ]
  buildPositions.forEach((e) => {
    const tiles3dLayer = new mars3d.layer.TilesetLayer({
      name: e.name,
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: e,
      scale: 1000,
      popup: e.name
    })
    map.addLayer(tiles3dLayer)
    tiles3dLayerArr.push(tiles3dLayer)

    const labelGraphic = new mars3d.graphic.LabelEntity({
      position: new mars3d.LngLatPoint(e.lng, e.lat, 10000),
      style: {
        text: e.name,
        font_size: 25,
        font_family: "楷体",
        color: "#003da6",
        outline: true,
        outlineColor: "#bfbfbf",
        outlineWidth: 2,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        visibleDepth: false
      }
    })
    graphicLayer.addGraphic(labelGraphic)
  })

  //Add base radar
  const leiDaPositions = [
    {
      position: [120.3479992508, 28.4277417126],
      name: "Base Radar 1"
    },
    {
      position: [120.098207771, 30.2945074558],
      name: "Base Radar 2"
    },
    {
      position: [120.1278554546, 32.4739348842],
      name: "Base Radar 3"
    },
    {
      position: [119.6090489248, 33.9603970691],
      name: "Base Radar 4"
    },
    {
      position: [119.563892164, 35.9884519627],
      name: "Based Radar 5"
    }
  ]
  leiDaPositions.forEach((e) => {
    const graphic = new mars3d.graphic.ModelEntity({
      name: e.name,
      position: e.position,
      style: {
        url: "//data.mars3d.cn/gltf/mars/leida.glb",
        scale: 1,
        minimumPixelSize: 40,
        clampToGround: true,
        label: {
          text: e.name,
          scale: 1,
          hasPixelOffset: true,
          pixelOffsetY: -20,
          visibleDepth: false,
          outline: true,
          outlineColor: "#476395",
          outlineWidth: 5.0
        }
      }
    })
    graphicLayer.addGraphic(graphic)
  })

  //Add satellite
  const modelGraphic = new mars3d.graphic.ModelEntity({
    name: "Rescue Satellite",
    position: [120, 36, 550000],
    style: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 100,
      label: {
        text: "Rescue Satellite",
        scale: 1,
        hasPixelOffset: true,
        pixelOffsetY: -10,
        visibleDepth: false,
        outline: true,
        outlineColor: "#476395",
        outlineWidth: 5.0
      }
    }
  })
  graphicLayer.addGraphic(modelGraphic)

  //Add rescue aircraft
  const plane1 = new mars3d.graphic.ModelEntity({
    name: "Aircraft 1",
    position: [129, 36, 550000],
    style: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 100
    }
  })
  graphicLayer.addGraphic(plane1)

  const plane = new mars3d.graphic.FixedRoute({
    name: "Flying Plane",
    speed: 500000,
    id: "rescuePlane",
    positions: [
      [123, 36, 550000],
      [127, 31.83, 10000]
    ],
    model: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 100,
      pitch: 15
    }
  })
  graphicLayer.addGraphic(plane)

  // add ship
  const shipPositions = [
    {
      position: [121.64, 26.03],
      name: "supply ship"
    },
    {
      position: [121.94, 27.03],
      name: "hospital ship"
    },
    {
      position: [122.24, 28.03],
      name: "Rescue Ship 1"
    },
    {
      position: [122.54, 29.03],
      name: "Rescue Ship 2"
    },
    {
      position: [126.54, 27.03],
      name: "Goods 001"
    },
    {
      position: [127.24, 32.03],
      name: "Goods 002"
    },
    {
      position: [128.54, 29.03],
      name: "Goods 003"
    },
    {
      position: [122.54, 34.03],
      name: "Goods 004"
    }
  ]

  shipPositions.forEach((e) => {
    if (e.name === "hospital ship") {
      yiLiaoShip = new mars3d.graphic.FixedRoute({
        name: "hospital ship",
        id: "treatShip",
        speed: 500000,
        positions: [
          [121.94, 27.03],
          [125.989481, 27.620443],
          [126.787149, 31.205917]
        ],
        model: {
          url: "//data.mars3d.cn/gltf/imap/a64cb3926a024fd8bc2638da6f7ebe32/gltf/gltf2.gltf",
          scale: 5000
        },
        label: {
          text: "hospital ship",
          scale: 1,
          hasPixelOffset: true,
          pixelOffsetY: -10,
          visibleDepth: false,
          outline: true,
          outlineColor: "#476395",
          outlineWidth: 5.0
        }
      })
      graphicLayer.addGraphic(yiLiaoShip)
    } else if (e.name === "Rescue Ship 2") {
      jiuYuanShip = new mars3d.graphic.FixedRoute({
        name: "Rescue Ship 2",
        speed: 500000,
        id: "rescueShip",
        positions: [
          [122.54, 29.03],
          [123.547133, 31.293979],
          [127, 31.8]
        ],
        model: {
          url: "//data.mars3d.cn/gltf/imap/a64cb3926a024fd8bc2638da6f7ebe32/gltf/gltf2.gltf",
          scale: 5000
        },
        label: {
          text: "Rescue Ship 2",
          scale: 1,
          hasPixelOffset: true,
          pixelOffsetY: -10,
          visibleDepth: false,
          outline: true,
          outlineColor: "#476395",
          outlineWidth: 5.0
        }
      })
      graphicLayer.addGraphic(jiuYuanShip)
    } else {
      const graphic = new mars3d.graphic.ModelEntity({
        name: e.name,
        position: e.position,
        style: {
          url: "//data.mars3d.cn/gltf/imap/a64cb3926a024fd8bc2638da6f7ebe32/gltf/gltf2.gltf",
          scale: 5000,
          label: {
            text: e.name,
            scale: 1,
            hasPixelOffset: true,
            pixelOffsetY: -10,
            visibleDepth: false,
            outline: true,
            outlineColor: "#476395",
            outlineWidth: 5.0
          }
        }
      })
      graphicLayer.addGraphic(graphic)
    }
  })

  //Add oil diffusion wave
  const oilWave = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(127, 31.83),
    style: {
      radius: 120000,
      color: "#544747",
      outline: false,
      outlineWidth: 2,
      outlineOpacity: 1,
      clampToGround: true
    },
    id: "Oil pollution range"
  })
  graphicLayer.addGraphic(oilWave)

  moveGraphicObj = { yiLiaoShip, jiuYuanShip, plane }
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Get the coordinates of an arched curve
function getLinePosition(position) {
  const startPoint = Cesium.Cartesian3.fromDegrees(position[0][0], position[0][1], position[0][2])
  const endPoint = Cesium.Cartesian3.fromDegrees(position[1][0], position[1][1], position[1][2])
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // Calculate curve points
  return positions
}

function showHeatMap(arrPoints) {
  //Heat map layer
  const heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    //The following are the style parameters of the heat map itself, please refer to the API: https://www.patrick-wied.at/static/heatmapjs/docs.html
    max: 100,
    heatStyle: {
      radius: 250,
      minOpacity: 0,
      maxOpacity: 0.8,
      blur: 0.9
    },
    //The following are the style parameters of the rectangular vector object
    style: {
      opacity: 1.0
    },
    id: "heatLayer"
  })

  map.addLayer(heatLayer)
}

//Clear the vector data from the previous step
const removeGraphic = (graphicArr, canClear) => {
  if (graphicArr && graphicArr.length !== 0) {
    graphicArr.forEach((graphic) => {
      if (!graphic?.attr.save || canClear) {
        graphicLayer.removeGraphic(graphic)
      }
    })
  }
}

//The first step is to send a signal
function firstStep() {
  removeGraphic(removeGraphicArr, true)
  map.setCameraView({ lat: 23.232027, lng: 131.178867, alt: 1126670.6, heading: 343.9, pitch: -39.3 })
  const firstPannel = new mars3d.graphic.DivGraphic({
    position: [127, 31.83, 14000],
    style: {
      html: `<div class="marsBlueBlack  animation-spaceInDown">
              <div class="marsBlueBlack-top">First step</div>
              <div class="marsBlueBlack-down">Oil spill ship sends distress signal</div>
          </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(firstPannel)

  //Add rescue icon
  const rescueIcon = new mars3d.graphic.BillboardEntity({
    position: new mars3d.LngLatPoint(126.320842, 31.97364, 14000),
    id: "rescueIcon",
    style: {
      image: "img/icon/warn.png",
      scale: 0.5,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      clampToGround: true
    },
    attr: { save: true }
  })

  if (!graphicLayer.getGraphicById("rescueIcon")) {
    graphicLayer.addGraphic(rescueIcon)
  }

  setInterval(() => {
    rescueIcon.show = !rescueIcon.show
  }, 500)

  // The communication wave sent by the accident ship to the satellite
  const shipTOweixin = new mars3d.graphic.PolylineEntity({
    positions: [
      [127, 31.83, 14000],
      [120, 36, 550000]
    ],
    style: {
      width: 10,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "rgba(255, 204, 102 , .5)",
        image: "img/textures/line-tarans.png",
        speed: 8
      }
    }
  })
  graphicLayer.addGraphic(shipTOweixin)

  graphicLayer.getGraphicById("Oil range").show = true

  removeGraphicArr = [firstPannel, shipTOweixin]
}

//The second step is to send the signal
function secondStep() {
  removeGraphic(removeGraphicArr, true)

  map.setCameraView({ lat: 40.471932, lng: 123.393843, alt: 873577.9, heading: 237.2, pitch: -45.5 })
  const heatLayer = map.getLayerById("heatLayer")
  if (heatLayer) {
    heatLayer.show = false
  }

  const secondPannel = new mars3d.graphic.DivGraphic({
    position: [117.3, 38, 14000],
    style: {
      html: `<div class="marsBlueBlack  animation-spaceInDown">
              <div class="marsBlueBlack-top">Step 2</div>
              <div class="marsBlueBlack-down">The Maritime Safety Administration sends a help signal to the command center</div>
          </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(secondPannel)

  // The communication wave sent by the accident ship to the satellite
  const weixinTObuild = new mars3d.graphic.PolylineEntity({
    positions: [
      [120, 36, 550000],
      [117.3, 38, 14000]
    ],
    style: {
      width: 10,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "rgba(255, 204, 102 , .5)",
        image: "img/textures/line-tarans.png",
        speed: 8
      }
    }
  })
  graphicLayer.addGraphic(weixinTObuild)

  removeGraphicArr = [secondPannel, weixinTObuild]
}

//The third step is to issue the command
function thirdStep() {
  removeGraphic(removeGraphicArr, true)
  map.setCameraView({ lat: 36.976138, lng: 122.494085, alt: 551666.1, heading: 257.4, pitch: -48 })

  const thirdPannel = new mars3d.graphic.DivGraphic({
    position: [117.1, 33, 14000],
    style: {
      html: `<div class="marsBlueBlack  animation-spaceInDown">
              <div class="marsBlueBlack-top">Step 3</div>
              <div class="marsBlueBlack-down">After receiving the report, the command center will analyze the on-site situation and assign tasks to rescue ships and rescue aircraft</div>
          </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(thirdPannel)

  // Sent by the Maritime Safety Administration to the command center
  const haishiTOzhihui = new mars3d.graphic.PolylineEntity({
    positions: getLinePosition([
      [117.3, 38, 14000],
      [117.1, 33, 14000]
    ]),
    style: {
      width: 2,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#fff",
        speed: 10,
        percent: 0.55,
        alpha: 0.2
      }
    }
  })
  graphicLayer.addGraphic(haishiTOzhihui)
  if (map.getLayerById("heatLayer")) {
    map.getLayerById("heatLayer").show = true
  } else {
    showHeatMap(heatMapPoints)
  }

  removeGraphicArr = [thirdPannel, haishiTOzhihui]
}

// Step 4: Get ready to go
function forthStep() {
  removeGraphic(removeGraphicArr, true)
  map.setCameraView({ lat: 29.097887, lng: 110.576537, alt: 653281.5, heading: 65.1, pitch: -28.3 })

  const forthPannel = new mars3d.graphic.DivGraphic({
    position: [121.94, 27.03, 20000],
    style: {
      html: `<div class="marsBlueBlack  animation-spaceInDown">
              <div class="marsBlueBlack-top">Step 4</div>
              <div class="marsBlueBlack-down">Rescue ships and rescue aircraft begin rescue missions</div>
          </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(forthPannel)

  //The command center sends it to the hospital ship
  const zhihuiTOyiliao = new mars3d.graphic.PolylineEntity({
    positions: getLinePosition([
      [117.1, 33, 14000],
      [121.94, 27.03, 20000]
    ]),
    style: {
      width: 2,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#fff",
        speed: 10,
        percent: 0.55,
        alpha: 0.2
      }
    }
  })
  graphicLayer.addGraphic(zhihuiTOyiliao)

  //The command center sends it to the rescue ship
  const zhihuiTOjiuyuan = new mars3d.graphic.PolylineEntity({
    positions: getLinePosition([
      [117.1, 33, 14000],
      [122.54, 29.03, 20000]
    ]),
    style: {
      width: 2,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#fff",
        speed: 10,
        percent: 0.55,
        alpha: 0.2
      }
    }
  })
  graphicLayer.addGraphic(zhihuiTOjiuyuan)

  //The command center sends it to Radar 5
  const zhihuiTOleida5 = new mars3d.graphic.PolylineEntity({
    positions: getLinePosition([
      [117.1, 33, 14000],
      [119.563892164, 35.9884519627]
    ]),
    style: {
      width: 2,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#fff",
        speed: 10,
        percent: 0.55,
        alpha: 0.2
      }
    }
  })
  graphicLayer.addGraphic(zhihuiTOleida5)

  // Cone under the plane
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: [119.563892164, 35.9884519627],
    targetPosition: [123, 36, 550000], // optional
    style: {
      angle: 2, // half-court angle
      color: "#42b883",
      opacity: 0.3
    }
  })

  //Load rescue route (rescue boat)
  const shipLine1 = new mars3d.graphic.CurveEntity({
    id: "rescueLine",
    positions: [
      [122.54, 29.03],
      [123.547133, 31.293979],
      [126.211407, 31.502229]
    ],
    style: {
      width: 20,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-arrow-blue.png"
      }
    },
    name: "Rescue boat rescue route",
    attr: { save: true }
  })

  //Load rescue route (supply ship)
  const shipLine2 = new mars3d.graphic.CurveEntity({
    id: "supplyLine",
    positions: [
      [121.94, 27.03],
      [125.989481, 27.620443],
      [126.488784, 31.01376]
    ],
    style: {
      width: 20,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "img/textures/line-arrow-blue.png"
      }
    },
    name: "Supply Ship Rescue Route",
    attr: { save: true }
  })

  const { yiLiaoShip, jiuYuanShip, plane } = moveGraphicObj
  yiLiaoShip.stop()
  jiuYuanShip.stop()
  plane.stop()

  if (!graphicLayer.getGraphicById("rescueLine")) {
    graphicLayer.addGraphic(shipLine2)
    graphicLayer.addGraphic(shipLine1)
    graphicLayer.addGraphic(coneTrack)
  }

  removeGraphicArr = [forthPannel, zhihuiTOyiliao, zhihuiTOjiuyuan, zhihuiTOleida5, coneTrack, shipLine1, shipLine2]
}

// Step 5, add flight animation and start
function fifthStep() {
  removeGraphic(removeGraphicArr)
  map.setCameraView({ lat: 22.221019, lng: 127.76867, alt: 492335.3, heading: 341.9, pitch: -24 })

  const { yiLiaoShip, jiuYuanShip, plane } = moveGraphicObj
  plane.stop()
  yiLiaoShip.stop()
  jiuYuanShip.stop()
  plane.start()
  yiLiaoShip.start()
  jiuYuanShip.start()

  const shipLine1 = graphicLayer.getGraphicById("rescueLine")
  const shipLine2 = graphicLayer.getGraphicById("supplyLine")

  removeGraphicArr = [shipLine1, shipLine2]
}

// Step six, add activated carbon to deal with leaks
function sixthStep() {
  removeGraphic(removeGraphicArr)
  map.setCameraView({ lat: 28.263862, lng: 128.114428, alt: 351171.2, heading: 345.9, pitch: -40.8 })

  graphicLayer.getGraphicById("Oil range").show = true

  const carbonList = [
    [127.540097, 31.429462, 0],
    [127.699521, 32.065311, 0],
    [127.189607, 32.45923, 0],
    [127.929319, 31.733224, 0]
  ]

  const graphicArr = []

  carbonList.forEach((positon) => {
    const graphic = new mars3d.graphic.EllipsoidEntity({
      position: positon,
      style: {
        radii: new Cesium.Cartesian3(4000.0, 4000.0, 8000.0),
        color: "#000"
      }
    })
    graphicArr.push(graphic)
    graphicLayer.addGraphic(graphic)
  })

  removeGraphicArr = graphicArr
}

// Step 7, clear the oil pollution area and complete the rescue
var seventhStep = () => {
  removeGraphic(removeGraphicArr)

  graphicLayer.getGraphicById("Oil range").show = false
}

var clear = () => {
  graphicLayer.remove()
  tiles3dLayerArr.forEach((layer) => {
    layer.remove()
  })
}

var stop = () => {
  removeGraphicArr.push(graphicLayer.getGraphicById("rescuePlane"))
  removeGraphicArr.push(graphicLayer.getGraphicById("rescueIcon"))
  removeGraphicArr.push(graphicLayer.getGraphicById("rescueLine"))
  removeGraphicArr.push(graphicLayer.getGraphicById("supplyLine"))
  removeGraphicArr.push(graphicLayer.getGraphicById("treatShip"))
  removeGraphicArr.push(graphicLayer.getGraphicById("rescueShip"))
  removeGraphic(removeGraphicArr, true)
}
