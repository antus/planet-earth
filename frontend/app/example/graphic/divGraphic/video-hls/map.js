// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.649617, lng: 117.081721, alt: 444, heading: 348, pitch: -25 }
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

  globalNotify("Known Problem Tips", `If the video does not play or the service URL access times out, it is because the current online demo URL address has expired. You can replace the url in the code with a local service and use it.`)

  //Load the petrochemical plant model
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Petrochemical Plant",
    url: "http://data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    maximumScreenSpaceError: 1,
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  //Create DIV data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("You clicked", event)
  })

  // Bind the right-click menu to the layer
  graphicLayer.bindContextMenu(
    [
      {
        text: "View camera",
        icon: "fa fa-trash-o",
        callback: (e) => {
          const graphic = e.graphic

          globalMsg("right-click menu example")
        }
      }
    ],
    { offsetY: -170 }
  )

  // adding data
  addRandomGraphicByCount(graphicLayer, [117.080397, 31.656139, 33.3])
  addRandomGraphicByCount(graphicLayer, [117.078006, 31.65649, 49.4])
  addRandomGraphicByCount(graphicLayer, [117.080571, 31.657898, 50.2])
  addRandomGraphicByCount(graphicLayer, [117.078331, 31.660016, 47.2])
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// const hlsUrl = "http://ivi.bupt.edu.cn/hls/cctv13.m3u8"
// const hlsUrl = "http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8"
const hlsUrl = "http://1252093142.vod2.myqcloud.com/4704461fvodcq1252093142/f865d8a05285890787810776469/playlist.f3.m3u8"

function addRandomGraphicByCount(graphicLayer, position) {
  const graphicImg = new mars3d.graphic.DivGraphic({
    position,
    style: {
      html: ` <div class="mars3d-camera-content">
                  <img class="mars3d-camera-img" src="img/icon/camera.svg" >
                </div>
                <div class="mars3d-camera-line" ></div>
                <div class="mars3d-camera-point"></div>
              `,
      offsetX: -16,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
    },
    popup: `<video style="width: 200px;height:100px;" id="videoHLS"  muted="muted" autoplay="autoplay" loop="loop" crossorigin="" controls="">
              </video>`,
    popupOptions: {
      offsetY: -170, // Display the offset value of Popup, which is the pixel height value of DivGraphic itself
      template: `<div class="marsBlackPanel animation-spaceInDown">
                    <div class="marsBlackPanel-text">{content}</div>
                    <span class="mars3d-popup-close-button closeButton" >×</span>
                  </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    }
  })
  graphicLayer.addGraphic(graphicImg)

  graphicImg.on(mars3d.EventType.popupOpen, function (event) {
    const videoElement = event.container.querySelector("#videoHLS") // DOM corresponding to popup

    if (window.Hls.isSupported()) {
      const hls = new window.Hls()
      hls.loadSource(hlsUrl)
      hls.attachMedia(videoElement)
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        videoElement.play()
      })
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = hlsUrl
      videoElement.addEventListener("loadedmetadata", function () {
        videoElement.play()
      })
    }
  })
}
