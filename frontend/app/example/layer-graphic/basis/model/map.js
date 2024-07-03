// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.799033, lng: 117.177563, alt: 4324.03, heading: 0, pitch: -45, roll: 0 },
    fxaa: true
  }
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance //Record the first created map

  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  showShanghaiDemo()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function removeLayer() {
  map.trackedEntity = null
  if (graphicLayer) {
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }

  //Reset state
  eventTarget.fire("defuatData", {
    enabledShowHide: true,
    enabledPopup: true,
    enabledTooltip: false,
    enabledRightMenu: false
  })
}

// Example: Shanghai
function showShanghaiDemo() {
  removeLayer()

  //Create gltf model,
  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "Shanghai Pudong",
    data: [
      {
        type: "modelP",
        position: [121.507762, 31.233975, 200],
        style: {
          url: "//data.mars3d.cn/gltf/mars/shanghai/pudong/scene.gltf",
          scale: 520,
          heading: 215
        }
      }
    ],
    center: { lat: 31.251138, lng: 121.463588, alt: 1729.97, heading: 110.7, pitch: -25, roll: 0.2 },
    popup: "Shanghai Pudong Model",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Example: skeletal animation
function showDonghuaDemo() {
  removeLayer()

  //Create gltf model
  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "Skeleton Animation",
    data: [
      {
        type: "modelP",
        position: [117.170624, 31.840666, 278.66],
        style: {
          url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
          scale: 200,
          heading: 270
        }
      },
      {
        type: "modelP",
        position: [117.184442, 31.842172, 33.92],
        style: {
          url: "//data.mars3d.cn/gltf/sample/GroundVehicle/GroundVehicle.glb",
          scale: 300
        }
      }
    ],
    center: { lat: 31.817737, lng: 117.179117, alt: 1810, heading: 0, pitch: -30, roll: 0 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Wind Turbines
function showFenliDemo() {
  removeLayer()

  const positions = [
    { lng: 112.227630577, lat: 39.0613382363999, alt: 1815 },
    { lng: 112.229302206, lat: 39.0579481036999, alt: 1827 },
    { lng: 112.226596341, lat: 39.0584773033999, alt: 1849 },
    { lng: 112.22511174, lat: 39.0574840383999, alt: 1866 },
    { lng: 112.225476722, lat: 39.0550566812, alt: 1866 },
    { lng: 112.225643865, lat: 39.0532631538, alt: 1899 },
    { lng: 112.229228645, lat: 39.0525930380999, alt: 1880 },
    { lng: 112.224976033, lat: 39.0502488098, alt: 1926 },
    { lng: 112.225661372999, lat: 39.0484097539999, alt: 1948 },
    { lng: 112.229409737, lat: 39.0474211486, alt: 1910 },
    { lng: 112.224894212, lat: 39.0464248147999, alt: 1983 },
    { lng: 112.224022809, lat: 39.0436919592999, alt: 2036 },
    { lng: 112.224492463, lat: 39.0413040158, alt: 2036 },
    { lng: 112.223470676999, lat: 39.0381470684, alt: 2038 },
    { lng: 112.220336836, lat: 39.039450506, alt: 2071 },
    { lng: 112.221019662, lat: 39.0367113260999, alt: 2063 },
    { lng: 112.221282611, lat: 39.045567662, alt: 2026 },
    { lng: 112.221147308, lat: 39.0439265946, alt: 2048 },
    { lng: 112.2216533, lat: 39.041840792, alt: 2056 },
    { lng: 112.222813848, lat: 39.0343489941, alt: 2075 },
    { lng: 112.225573092, lat: 39.0307660108, alt: 2015 },
    { lng: 112.220069655, lat: 39.0323883292, alt: 2022 },
    { lng: 112.217448043999, lat: 39.0310627231, alt: 2021 },
    { lng: 112.230322327, lat: 39.0281575923999, alt: 1965 }
  ]

  const arr = []
  positions.forEach((item) => {
    arr.push({
      type: "modelP",
      position: item,
      style: {
        url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
        scale: 40,
        heading: 135,
        minimumPixelSize: 30,
        clampToGround: true
      }
    })
  })

  //Create gltf model
  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "wind turbine",
    data: arr,
    center: { lat: 39.066518, lng: 112.245269, alt: 2913, heading: 226, pitch: -21, roll: 0 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

// Photovoltaic electric field
function showGuangfu() {
  removeLayer()

  //Create layer
  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "Photovoltaic Electric Field",
    center: { lat: 42.786315, lng: 93.105225, alt: 2095, heading: 57, pitch: -44 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })

  // Construct data
  const longitudeString = 93.1214
  const latitudeString = 42.7863
  const height = 678
  const heading = 0
  // Photovoltaic power plant location Solar panel location
  for (let i = 0; i < 120; i++) {
    let point
    if (i < 20) {
      point = { lng: longitudeString, lat: latitudeString + i / 1000, alt: height }
    } else if (i < 40) {
      point = { lng: longitudeString - 0.00082, lat: latitudeString + (i - 20) / 1000, alt: height }
    } else if (i < 60) {
      point = { lng: longitudeString - 0.00164, lat: latitudeString + (i - 40) / 1000, alt: height }
    } else if (i < 80) {
      point = { lng: longitudeString - 0.00256, lat: latitudeString + (i - 60) / 1000, alt: height }
    } else if (i < 100) {
      point = { lng: longitudeString - 0.00338, lat: latitudeString + (i - 80) / 1000, alt: height }
    } else if (i < 120) {
      point = { lng: longitudeString - 0.0042, lat: latitudeString + (i - 100) / 1000, alt: height }
    }

    const graphic = new mars3d.graphic.ModelPrimitive({
      name: "Fan",
      position: point,
      style: {
        url: "//data.mars3d.cn/gltf/mars/taiyang/taiyang.gltf",
        scale: 1,
        heading,
        minimumPixelSize: 30,
        clampToGround: true
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}
