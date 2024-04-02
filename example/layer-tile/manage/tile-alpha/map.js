// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 28.118943, lng: 114.834765, alt: 4038547, heading: 351, pitch: -83 },
    mapProjection: mars3d.CRS.EPSG3857, // Display Mercator projection in 2D
    mapMode2D: Cesium.MapMode2D.INFINITE_SCROLL // The world map can be scrolled left and right in 2D
  },
  control: {
    timeline: true,
    clockAnimate: true
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

  showImagesByGraphic()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// RectangleEntity method
async function showImagesByGraphic() {
  const urlArr = [
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522145400_0c972b7abe4f4b4fbdbe909f5c1ca17a.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522150000_55c4adac7ac8460db3d893866897bd6d.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522150600_ca075253d90e40049f069d22a1a3ce3d.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522151200_afe188f5892d4dd8a4d09d94c746ce1f.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522151800_b10b132f2d52424e9ab55a61896e86b0.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522152400_4ad54289d6f64f5aaa160f453a99b14a.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522153000_cf72453eba0b4b33966f69899771ba16.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522153600_c3aac59805ec433bae08bc8d77d25d20.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522154200_42a885bb66144e698190c38d02b3be96.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522154800_4564689c557e43ff993ad0113363bd6d.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522155400_4742e31563464542a533a43d5414a7ae.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522160000_487da64a0f384795848e60f2ed343500.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522160600_9a1cf5da2f2c46158f113c057b9bb079.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522161200_76861453df20413fa1eff57c8c938758.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522161800_767d25a128e94d968522badfaf071a66.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522162400_8b949a9d47fd4f289bd51afe9e009ab9.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522163000_9f234335ae2c42ac91d5dfc62b72f3db.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522163600_a808919c4a5a4142b188520a74dacf75.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522164200_248688f96cfd438eb5229812dfb748c3.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522164800_797dd13e0a304fbe934fee1902b7fc21.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522165400_0be5ef511d6c467288ec9f7b961821bd.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522170000_a1820b8d4527467a85db7fee3b352bbb.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522170600_964ada943fcf4a13aa59364b1efd0b1b.png"
  ]

  //Add vector layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Specify a fixed time to facilitate writing demonstration code.
  const startTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))
  let stopTime
  let tempTime = startTime.clone()

  // Preload images
  const arrImage = []
  const property = new Cesium.TimeIntervalCollectionProperty()
  for (let i = 0, len = urlArr.length; i < len; i++) {
    const image = await Cesium.Resource.fetchImage({ url: urlArr[i] })
    arrImage.push(image)

    // Use attribute mechanism to associate with timeline
    stopTime = Cesium.JulianDate.addSeconds(tempTime, 3, new Cesium.JulianDate()) // Demonstration time, displayed for 3 seconds
    property.intervals.addInterval(
      new Cesium.TimeInterval({
        start: tempTime, // Display the image during the time period from start to stop
        stop: stopTime,
        isStartIncluded: true,
        isStopIncluded: false,
        data: image
      })
    )
    tempTime = stopTime
  }

  // Clock settings
  map.clock.startTime = startTime.clone()
  map.clock.stopTime = stopTime.clone()
  map.clock.currentTime = startTime
  map.clock.multiplier = 1 // Current speed, default is 1
  map.clock.clockRange = Cesium.ClockRange.LOOP_STOP // Loop after reaching the end time

  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(startTime, stopTime)
  }
  console.log("Picture list preloading completed", arrImage) //Print picture array

  //Add image graphic
  const graphic = new mars3d.graphic.RectangleEntity({
    positions: [
      [63.8148899733, 12.7700338517],
      [143.536486117, 56.3833398551]
    ],
    style: {
      materialType: mars3d.MaterialType.Image2,
      materialOptions: {
        image: property
      }
    }
  })
  graphicLayer.addGraphic(graphic)

  // RectanglePrimitive
  // const graphic = new mars3d.graphic.RectanglePrimitive({
  //   positions: [
  //     [63.8148899733, 12.7700338517],
  //     [143.536486117, 56.3833398551]
  //   ],
  //   style: {
  //     materialType: mars3d.MaterialType.Image2,
  //     materialOptions: {
  //       image: property.getValue(map.clock.currentTime)
  //     },
  //     flat: true
  //   }
  // })
  // graphicLayer.addGraphic(graphic)

  // // renew
  // setInterval(() => {
  //   graphic.uniforms.image = property.getValue(map.clock.currentTime)
  // }, 1000)
}

// ImageLayer method, direct replacement
function showImages() {
  const urlArr = [
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522145400_0c972b7abe4f4b4fbdbe909f5c1ca17a.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522150000_55c4adac7ac8460db3d893866897bd6d.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522150600_ca075253d90e40049f069d22a1a3ce3d.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522151200_afe188f5892d4dd8a4d09d94c746ce1f.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522151800_b10b132f2d52424e9ab55a61896e86b0.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522152400_4ad54289d6f64f5aaa160f453a99b14a.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522153000_cf72453eba0b4b33966f69899771ba16.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522153600_c3aac59805ec433bae08bc8d77d25d20.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522154200_42a885bb66144e698190c38d02b3be96.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522154800_4564689c557e43ff993ad0113363bd6d.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522155400_4742e31563464542a533a43d5414a7ae.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522160000_487da64a0f384795848e60f2ed343500.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522160600_9a1cf5da2f2c46158f113c057b9bb079.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522161200_76861453df20413fa1eff57c8c938758.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522161800_767d25a128e94d968522badfaf071a66.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522162400_8b949a9d47fd4f289bd51afe9e009ab9.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522163000_9f234335ae2c42ac91d5dfc62b72f3db.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522163600_a808919c4a5a4142b188520a74dacf75.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522164200_248688f96cfd438eb5229812dfb748c3.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522164800_797dd13e0a304fbe934fee1902b7fc21.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522165400_0be5ef511d6c467288ec9f7b961821bd.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522170000_a1820b8d4527467a85db7fee3b352bbb.png",
    "//data.mars3d.cn/file/img/radar_water/20200522145400_20200522170600_964ada943fcf4a13aa59364b1efd0b1b.png"
  ]

  const arrTileLayer = []
  for (let i = 0, len = urlArr.length; i < len; i++) {
    const tileLayer = new mars3d.layer.ImageLayer({
      url: urlArr[i],
      rectangle: { xmin: 63.8148899733, xmax: 143.536486117, ymin: 12.7700338517, ymax: 56.3833398551 },
      crs: mars3d.CRS.EPSG3857,
      alpha: 0
    })
    map.addLayer(tileLayer)
    arrTileLayer.push(tileLayer)
  }

  let current = 0
  function play() {
    if (current > arrTileLayer.length) {
      current = 0
    }
    current++

    const layer1 = arrTileLayer[current - 1]
    if (layer1) {
      layer1.alpha = 0
    }
    const layer2 = arrTileLayer[current]
    if (layer2) {
      layer2.alpha = 1
    }

    setTimeout(play, 500)
  }

  play()
}

// ImageLayer method, gradient method
function showImagesByAlpha() {
  const urlArr = [
    "//data.mars3d.cn/file/img/radar/201906211112.PNG",
    "//data.mars3d.cn/file/img/radar/201906211124.PNG",
    "//data.mars3d.cn/file/img/radar/201906211130.PNG",
    "//data.mars3d.cn/file/img/radar/201906211136.PNG",
    "//data.mars3d.cn/file/img/radar/201906211142.PNG"
  ]

  const arrTileLayer = []
  for (let i = 0, len = urlArr.length; i < len; i++) {
    const tileLayer = new mars3d.layer.ImageLayer({
      url: urlArr[i],
      rectangle: { xmin: 73.16895, xmax: 134.86816, ymin: 12.2023, ymax: 54.11485 },
      crs: mars3d.CRS.EPSG3857,
      alpha: 0
    })
    map.addLayer(tileLayer)
    arrTileLayer.push(tileLayer)
  }

  let step = 0
  const alphaStep = 0.01
  let idxTimer

  function changeRadarAlpha(time) {
    if (step > arrTileLayer.length - 1) {
      step = 0
      arrTileLayer[arrTileLayer.length - 1].alpha = 0
    }
    const layer1 = arrTileLayer[step]
    const layer2 = arrTileLayer[step + 1]
    if (!layer1 || !layer2) {
      return
    }
    layer1.alpha = 1
    layer2.alpha = 0

    clearInterval(idxTimer)
    idxTimer = window.setInterval(function () {
      layer1.alpha -= alphaStep
      layer2.alpha += alphaStep

      if (layer1.alpha < alphaStep) {
        layer1.alpha = 0
        step++
        changeRadarAlpha(time)
      }
    }, time * 1000 * alphaStep)
  }

  changeRadarAlpha(1)
}
