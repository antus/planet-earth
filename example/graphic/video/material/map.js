// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

let videoElement
let videoGraphic

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 28.441852, lng: 119.481567, alt: 241, heading: 174, pitch: -35 }
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

  globalNotify("Known Problem Tips", `If the video does not play or the service URL access times out, it is because the current online demo URL address has expired. You can replace the url in the code with a local service and use it.`)

  //Add reference 3D model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "County Community",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true
  })
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })
  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  createVideoDom()

  //Add some demo data
  addDemoGraphic1()
  addDemoGraphic2()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function createVideoDom() {
  videoElement = mars3d.DomUtil.create("video", "", document.body)
  videoElement.setAttribute("muted", "muted")
  videoElement.setAttribute("autoplay", "autoplay")
  videoElement.setAttribute("loop", "loop")
  videoElement.setAttribute("crossorigin", "")
  videoElement.setAttribute("controls", "")
  videoElement.style.display = "none"

  const mp4Source = mars3d.DomUtil.create("source", "", videoElement)
  mp4Source.setAttribute("src", "//data.mars3d.cn/file/video/lukou.mp4")
  mp4Source.setAttribute("type", "video/mp4")

  // const webmSource = mars3d.DomUtil.create("source", "", videoElement)
  // webmSource.setAttribute("src", "https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.webm")
  // webmSource.setAttribute("type", "video/webm")

  // const mp4Source = mars3d.DomUtil.create("source", "", videoElement)
  // mp4Source.setAttribute("src", "https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mp4")
  // mp4Source.setAttribute("type", "video/mp4")

  // const quicktimeSource = mars3d.DomUtil.create("source", "", videoElement)
  // quicktimeSource.setAttribute("src", "https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mov")
  // quicktimeSource.setAttribute("type", "video/quicktime")

  // Video elements can be synchronized with Cesium's analog clock
  const synchronizer = new Cesium.VideoSynchronizer({
    clock: map.clock,
    element: videoElement
  })
  map.clock.shouldAnimate = true

  setTimeout(() => {
    try {
      if (videoElement.paused) {
        globalMsg("The current browser has restricted automatic playback, please click the play button")
        videoElement.play()
      }
    } catch (e) {
      //Avoid browser permission exceptions
      globalMsg("The current browser has restricted automatic playback, please click the play button")
    }
  }, 3000)
}

function getGraphic(graphicId) {
  videoGraphic = graphicLayer.getGraphicById(graphicId)
  return videoGraphic
}

// erect video
function addDemoGraphic1() {
  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [119.481299, 28.439988, 140],
      [119.481162, 28.440102, 140],
      [119.481163, 28.440101, 130],
      [119.481296, 28.439986, 130]
    ],
    styleType: "video", //Use of attribute edit box
    style: {
      material: videoElement
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)
}

// ground video
function addDemoGraphic2() {
  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [119.481749, 28.440171, 130],
      [119.481385, 28.440457, 130],
      [119.481911, 28.44094, 130],
      [119.482254, 28.440653, 130]
    ],
    styleType: "video", //Use of attribute edit box
    style: {
      material: videoElement,
      stRotationDegree: 90 //Video rotation angle
      // clampToGround: true
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 0, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 72, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 144, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 216, result.radius)

    const graphic = new mars3d.graphic.PolygonEntity({
      positions: [pt1, pt2, pt3, pt4],
      styleType: "video", //Use of attribute edit box
      style: {
        material: videoElement,
        stRotationDegree: 130, // Video rotation angle
        clampToGround: true
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "rectangle",
    styleType: "video", //Use of attribute edit box
    style: {
      material: videoElement,
      clampToGround: true
    }
  })
}

function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "wall",
    maxPointNum: 2,
    styleType: "video", //Use of attribute edit box
    style: {
      diffHeight: 5,
      material: videoElement
    }
  })
}

// play / Pause
function videoPlay() {
  if (!map.clock.shouldAnimate) {
    map.clock.shouldAnimate = true
  }
}
function videoStop() {
  if (map.clock.shouldAnimate) {
    map.clock.shouldAnimate = false
  }
}

/**
 * Direction change
 *
 * @export
 * @param {number} value range is 0-360°
 * @returns {void}
 */
function angleChange(value) {
  videoGraphic?.setStyle({
    stRotationDegree: value
  })
}

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["source"] = "I am the Popup bound to the layer"
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr })
  })
}

//Bind right-click menu
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "Start editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "Stop editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "Delete object",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // When the right click is the editing point
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}
