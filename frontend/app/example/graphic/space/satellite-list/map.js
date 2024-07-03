// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    shadows: true,
    center: { lat: 12.845055, lng: 112.931363, alt: 24286797, heading: 3, pitch: -90 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    },
    globe: { enableLighting: true },
    clock: {
      multiplier: 1 // speed
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    compass: { top: "10px", left: "5px" }
  },
  terrain: false,
  layers: [
    {
      name: "Night Picture",
      icon: "img/basemaps/blackMarble.png",
      type: "image",
      url: "//data.mars3d.cn/file/img/world/night2.jpg",
      dayAlpha: 0.0,
      nightAlpha: 1.0,
      brightness: 3.5,
      show: true
    }
  ]
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // Record map map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Satellite clicked", event)
    // click event
    highlightSatellite(event.graphic)
  })
  graphicLayer.on(mars3d.EventType.change, function (event) {
    // Location change event
    processInArea(event.graphic)
  })

  bindLayerPopup()

  creatreDmzList()

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tle-china.json" })
    .then(function (data) {
      createSatelliteList(data.data)
    })
    .catch(function () {
      globalMsg("Abnormal acquisition of satellite information!")
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Create satellite list
function createSatelliteList(arr) {
  // Click on an empty space on the map
  map.on(mars3d.EventType.clickMap, function (event) {
    highlightSatellite()
  })

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    //Property processing
    item.model = {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 50,
      ...(item.model || {}),
      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 0,
      distanceDisplayCondition_far: 20000000
    }
    // When the viewing angle distance exceeds 20000000 meters (defined by distanceDisplayCondition_far), it is displayed as a point object style
    item.point = {
      color: "#ffff00",
      pixelSize: 5,
      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 20000000,
      distanceDisplayCondition_far: Number.MAX_VALUE
    }

    item.label = item.label || {
      color: "#ffffff",
      opacity: 1,
      font_size: 30,
      font_family: "楷体",
      outline: true,
      outlineColor: "#000000",
      outlineWidth: 3,
      background: true,
      backgroundColor: "#000000",
      backgroundOpacity: 0.5,
      pixelOffsetY: -20,
      scaleByDistance: true,
      scaleByDistance_far: 10000000,
      scaleByDistance_farValue: 0.4,
      scaleByDistance_near: 100000,
      scaleByDistance_nearValue: 1
    }
    item.label.text = item.name

    // FPS drops sharply after path is displayed
    item.path = item.path || {}
    item.path.color = Cesium.defaultValue(item.path.color, "#e2e2e2")
    item.path.closure = false

    item.cone = {
      sensorType: i % 2 === 1 ? mars3d.graphic.SatelliteSensor.Type.Rect : mars3d.graphic.SatelliteSensor.Type.Conic,
      angle1: random(20, 40),
      angle2: random(10, 20),
      color: "rgba(0,255,0,0.5)",
      show: false
    }
    //Property processing END

    const satelliteObj = new mars3d.graphic.Satellite(item)
    graphicLayer.addGraphic(satelliteObj)
  }
  console.log("Current number of satellites: " + arr.length)
}

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.options
    return `Name: ${attr.name}<br/>English name: ${attr.name_en || ""}<br/>Type: ${attr.type}`
  })
}

let lastSelectWX

function highlightSatellite(satelliteObj) {
  if (lastSelectWX) {
    //Reset the last selected track style
    lastSelectWX.setOptions({
      path: {
        color: "#e2e2e2",
        opacity: 0.5,
        width: 1
      }
    })
    lastSelectWX.coneShow = false // Turn off the view frustum
    lastSelectWX = null
  }

  if (satelliteObj) {
    // Highlight the selected track style
    satelliteObj.setOptions({
      path: {
        color: "#ffff00",
        opacity: 1,
        width: 2
      }
    })
    satelliteObj.coneShow = true // Turn on the view frustum
    lastSelectWX = satelliteObj
  }
}

// Determine whether the satellite is within the plane
function processInArea(weixin) {
  const position = weixin?.position
  if (!position) {
    return
  }

  dmzLayer.eachGraphic(function (dmzGraphic) {
    if (!dmzGraphic._isFW) {
      return
    }

    dmzGraphic._lastInPoly[weixin.id] = dmzGraphic._lastInPoly[weixin.id] || {}
    const lastState = dmzGraphic._lastInPoly[weixin.id]

    const thisIsInPoly = dmzGraphic.isInPoly(position)
    if (thisIsInPoly !== lastState.state) {
      if (thisIsInPoly) {
        // Start entering the area
        console.log(`${weixin.name} satellite begins to enter ${dmzGraphic.name} ground station area`)

        const line = new mars3d.graphic.PolylineEntity({
          positions: new Cesium.CallbackProperty(function (time) {
            const pots = weixin.position
            if (!pots) {
              return []
            }
            return [pots, dmzGraphic.positionShow]
          }, false),
          style: {
            width: 7,
            //Animation line material
            materialType: mars3d.MaterialType.LineFlow,
            materialOptions: {
              url: "./img/textures/arrow-h.png",
              color: Cesium.Color.AQUA,
              repeat: new Cesium.Cartesian2(15, 1),
              speed: 60 // Duration, control speed
            },
            arcType: Cesium.ArcType.NONE
          }
        })
        map.graphicLayer.addGraphic(line)
        lastState.line = line

        weixin.coneShow = true // Turn on the view frustum
      } else {
        //Leave the area
        console.log(`${weixin.name} satellite leaves ${dmzGraphic.name} ground station area`)

        if (lastState.line) {
          map.graphicLayer.removeGraphic(lastState.line)
          delete lastState.line
        }
        weixin.coneShow = false // Turn off the view frustum
      }

      dmzGraphic._lastInPoly[weixin.id].state = thisIsInPoly
    }
  })
}

// Get random numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Ground station layer
let dmzLayer
// Create ground station
function creatreDmzList() {
  const arr = [
    { name: "Xi'an", radius: 1500000, point: [108.938314, 34.345614, 342.9] },
    { name: "Kashi", radius: 1800000, point: [75.990372, 39.463507, 1249.5] },
    { name: "Wenchang", radius: 1200000, point: [110.755151, 19.606573, 21.1] }
  ]

  //Create vector data layer
  dmzLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(dmzLayer)

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    // Ground station gltf model
    const graphic = new mars3d.graphic.ModelEntity({
      name: "Ground station model",
      position: item.point,
      style: {
        url: "//data.mars3d.cn/gltf/mars/leida.glb",
        heading: 270,
        scale: 30,
        minimumPixelSize: 40
      },
      popup: item.name
    })
    dmzLayer.addGraphic(graphic)

    const dmfwGraphic = new mars3d.graphic.CircleEntity({
      name: item.name,
      position: item.point,
      style: {
        radius: item.radius,
        color: "#ff0000",
        opacity: 0.3
      },
      popup: item.name
    })
    dmzLayer.addGraphic(dmfwGraphic)

    //Variables that will be used when making judgments
    dmfwGraphic._isFW = true
    dmfwGraphic._lastInPoly = {}
  }
}
