// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: {
      lat: 31.799613,
      lng: 117.27357,
      alt: 72.55,
      heading: 59.8,
      pitch: -18,
      roll: 0
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    compass: { bottom: "380px", left: "5px" }
  }
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Time control parameters
const args = {
  space: 100,
  time: 5,
  martTimeInter: null,
  cleanTimeInter: null
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  addLayer()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addLayer() {
  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Hefei High Speed ​​Rail
  const coors = [
    [117.277697, 31.800233, 45],
    [117.262022, 31.798983, 45],
    [117.229506, 31.793351, 45],
    [117.215719, 31.791085, 45],
    [117.207234, 31.79079, 45],
    [117.180246, 31.790688, 45],
    [117.168311, 31.789785, 45],
    [117.152322, 31.789855, 45],
    [117.125297, 31.788849, 45],
    [117.091144, 31.787516, 45]
  ]

  const positions = mars3d.PointTrans.lonlats2cartesians(coors)

  // Interpolation to find a new route (interpolation according to fixed intervals of meters) The value entered in positions needs to be a Cartesian space xyz coordinate array
  const positionsNew = mars3d.PolyUtil.interLine(positions, {
    minDistance: 20 // 20 meters apart
  })

  // Find the comparative ground height (for echarts display)
  mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: positionsNew // The source route coordinate array that needs to be calculated
  }).then((result) => {
    // raisedPositions is a new coordinate array containing elevation information, and noHeight indicates whether there is no terrain data.
    console.log("New coordinate array containing elevation information", result.positions)

    inintRoad(positionsNew, result.positions)
  })
}

//Construct dynamic high-speed rail positions: designed route positionsTD ground-to-ground route (for comparison)
function inintRoad(positionsSJ, positionsTD) {
  const heightArray = []
  const heightTDArray = []
  const mpoints = []
  for (let i = 0; i < positionsSJ.length; i++) {
    const position = positionsSJ[i]
    const carto = Cesium.Cartographic.fromCartesian(position)
    const x = Cesium.Math.toDegrees(carto.longitude)
    const y = Cesium.Math.toDegrees(carto.latitude)

    const height = mars3d.Util.formatNum(carto.height) // Design height When the numbers after the decimal point are consistent, the decimal point will be omitted and not displayed.
    const tdHeight = mars3d.Util.formatNum(Cesium.Cartographic.fromCartesian(positionsTD[i]).height) // Ground height

    heightArray.push(height)
    heightTDArray.push(tdHeight)
    mpoints.push([x, y, height, tdHeight])
  }

  // distance array
  const positionsLineFirst = positionsTD[0]
  const distanceArray = positionsTD.map(function (data) {
    return Math.round(Cesium.Cartesian3.distance(data, positionsLineFirst)) // Calculate the distance between two points and return the distance
  })

  // display echarts
  eventTarget.fire("dataLoaded", { heightArray, heightTDArray, distanceArray })
  // draw lines
  const graphic = new mars3d.graphic.PolylinePrimitive({
    id: "Design Route",
    positions: positionsSJ,
    style: {
      width: 3,
      materialType: mars3d.MaterialType.PolylineDash, // dashed line
      materialOptions: {
        color: Cesium.Color.RED,
        dashLength: 20
      }
    }
  })
  graphicLayer.addGraphic(graphic)

  const primitiveTD = new mars3d.graphic.PolylinePrimitive({
    id: "ground route",
    positions: positionsTD,
    style: {
      width: 3,
      color: Cesium.Color.YELLOW
    }
  })
  graphicLayer.addGraphic(primitiveTD)

  // ================= Calculate route ====================
  const start = map.clock.currentTime.clone()

  const counts = mpoints.length

  const arrProperty = []

  // 16 sets of body + 2 heads and tail, 18 sets in total
  for (let j = 0; j < 18; j++) {
    const stime = Cesium.JulianDate.addSeconds(start, j, new Cesium.JulianDate()) // Add time every j seconds

    const property = new Cesium.SampledPositionProperty()

    for (let i = 0; i < counts; i++) {
      const time = Cesium.JulianDate.addSeconds(stime, i + 1, new Cesium.JulianDate())
      const point = Cesium.Cartesian3.fromDegrees(mpoints[i][0], mpoints[i][1], mpoints[i][2] + 0.5)
      property.addSample(time, point) //Add new sample, time, location
    }

    property.setInterpolationOptions({
      interpolationDegree: 1,
      interpolationAlgorithm: Cesium.LinearApproximation
    })

    arrProperty.push(property)
  }

  // =================Time related====================

  const stop = Cesium.JulianDate.addSeconds(start, counts + 60, new Cesium.JulianDate())
  map.clock.startTime = start.clone()
  map.clock.stopTime = stop.clone()
  map.clock.currentTime = start.clone()
  map.clock.multiplier = 1 // Current speed, default is 1
  map.clock.shouldAnimate = true // Whether to enable clock animation, default true
  // map.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // Loop after reaching the end time

  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(start, stop)
  }

  const availability = new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start,
      stop: Cesium.JulianDate.addSeconds(start, counts, new Cesium.JulianDate())
    })
  ])

  // ================= Add high-speed rail head ================
  const graphicHead = addTrainHead(arrProperty[0], availability)

  // =================Add body====================
  const len = arrProperty.length
  for (let j = 1; j < len - 1; j++) {
    addTrainBody(arrProperty[j], availability)
  }

  // ================= Add high-speed rail tail ================
  addTrainHead(arrProperty[len - 1], availability, true) // Reverse head of the rear of the car

  // ============== Add railway, update regularly ================
  addRailway(graphicHead, mpoints)

  // // Set the Entity instance that the camera's perspective follows
  // map.trackedEntity = graphicHead

  // ==============Update echarts================
  let lastDistance

  function locTrain() {
    const t = parseInt(map.clock.currentTime.secondsOfDay - map.clock.startTime.secondsOfDay) // Time difference

    if (t >= heightArray.length) {
      // After the high-speed rail operation ends
      clearInterval(args.martTimeInter)
      clearInterval(args.cleanTimeInter)
      return
    }
    if (lastDistance === t) {
      return
    }
    lastDistance = t
    updateEchartsDistance(t, heightArray[t])
  }
  args.martTimeInter = setInterval(locTrain, 100)
}

//Add head
function addTrainHead(position, availability, rotatePI) {
  const graphicModel = new mars3d.graphic.ModelEntity({
    name: "Harmony Headquarters",
    position,
    orientation: new Cesium.VelocityOrientationProperty(position),
    availability,
    style: {
      url: "//data.mars3d.cn/gltf/mars/train/heada.glb",
      scale: 0.001,
      minimumPixelSize: 16,
      heading: rotatePI ? 90 : -90,
      mergeOrientation: true // Used to set the correction process when the model is not in a standard orientation. Add the setting to the orientation-based mode value to be the heading value.
    }
  })
  graphicLayer.addGraphic(graphicModel)
  return graphicModel
}

//Add body
function addTrainBody(position, availability) {
  const graphicModel = new mars3d.graphic.ModelEntity({
    name: "Harmony Body",
    position,
    orientation: new Cesium.VelocityOrientationProperty(position),
    availability,
    style: {
      url: "//data.mars3d.cn/gltf/mars/train/body.glb",
      scale: 0.001,
      minimumPixelSize: 16,
      heading: -90,
      mergeOrientation: true // Used to set the correction process when the model is not in a standard orientation. Add the setting to the orientation-based mode value to be the heading value.
    }
  })
  graphicLayer.addGraphic(graphicModel)
  return graphicModel
}

//Add railway and update regularly
function addRailway(graphicHead, mpoints) {
  const positions = []
  const orientations = []

  const times = graphicHead.position._property._times
  const start = times[0].clone()
  const counts = times.length

  for (let k = 1; k < counts; k++) {
    const time = times[k]

    const position = graphicHead.position.getValue(time)
    positions.push(position)

    const orientation = graphicHead.orientation.getValue(time)
    orientations.push(orientation)
  }

  let i = 0
  const roadNum = 80

  function addroad() {
    const space = Math.round(map.clock.currentTime.secondsOfDay - map.clock.startTime.secondsOfDay)
    let spa = space + args.space
    if (spa > counts) {
      spa = counts
    }
    for (; i < spa; i++) {
      const availability = new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: Cesium.JulianDate.addSeconds(start, -roadNum + i, new Cesium.JulianDate()),
          stop: Cesium.JulianDate.addSeconds(start, roadNum + i, new Cesium.JulianDate())
        })
      ])

      // When the height is underground, add an underground tunnel
      if (mpoints[i][2] - mpoints[i][3] < -20 || (i > 2 && mpoints[i - 3][2] - mpoints[i - 3][3] < -20)) {
        // mpoints[i][2] -- design height; mpoints[i][3] -- ground-mounted height
        const id = "s" + i
        const graphic = graphicLayer.getGraphicById(id)
        if (!graphic) {
          const graphicModel = new mars3d.graphic.ModelEntity({
            id,
            position: positions[i],
            orientation: orientations[i],
            availability,
            style: {
              url: "//data.mars3d.cn/gltf/mars/railway/suidao.glb",
              scale: 0.001
            }
          })
          graphicLayer.addGraphic(graphicModel)
        } else {
          graphic.entity.availability._intervals[0].stop.secondsOfDay = availability._intervals[0].stop.secondsOfDay
        }
      }

      //Add track ground
      const id = "xl" + i
      const graphic = graphicLayer.getGraphicById(id)
      if (!graphic) {
        const graphicModel = new mars3d.graphic.ModelEntity({
          id,
          position: positions[i],
          orientation: orientations[i],
          availability,
          style: {
            url: "//data.mars3d.cn/gltf/mars/railway/railway.glb",
            scale: 0.001
          }
        })
        graphicLayer.addGraphic(graphicModel)
      } else {
        graphic.entity.availability._intervals[0].stop.secondsOfDay = availability._intervals[0].stop.secondsOfDay
      }

      //Add track bracket
      if (mpoints[i][2] - mpoints[i][3] > 20 && i % 5 === 0) {
        const id = "xq" + i
        const graphic = graphicLayer.getGraphicById(id)
        if (!graphic) {
          const graphicModel = new mars3d.graphic.ModelEntity({
            id,
            position: positions[i],
            orientation: orientations[i],
            availability,
            style: {
              url: "//data.mars3d.cn/gltf/mars/railway/bridge.glb",
              scale: 0.001
            }
          })
          graphicLayer.addGraphic(graphicModel)
        } else {
          graphic.entity.availability._intervals[0].stop.secondsOfDay = availability._intervals[0].stop.secondsOfDay
        }
      }

      //Add pillars along the track
      if (i % 12 === 0) {
        const id = "xd" + i
        const graphic = graphicLayer.getGraphicById(id)
        if (!graphic) {
          const graphicModel = new mars3d.graphic.ModelEntity({
            id,
            position: positions[i],
            orientation: orientations[i],
            availability,
            style: {
              url: "//data.mars3d.cn/gltf/mars/railway/jiazi.glb",
              scale: 0.001
            }
          })
          graphicLayer.addGraphic(graphicModel)
        } else {
          graphic.entity.availability._intervals[0].stop.secondsOfDay = availability._intervals[0].stop.secondsOfDay
        }
      }
    }

    //remove rail
    for (let j = args.statate; j < args.statate - args.space; j++) {
      removeGraphic("s" + j)
      removeGraphic("xl" + j)
      removeGraphic("xq" + j)
      removeGraphic("xd" + j)
      args.statate = j
    }
  }

  addroad()

  args.cleanTimeInter = setInterval(addroad, args.time)
  args.statate = 0
}

function removeGraphic(id) {
  const graphic = graphicLayer.getGraphicById(id)
  if (graphic) {
    if (graphic.entity.availability._intervals[0].stop.secondsOfDay < map.clock.currentTime.secondsOfDay) {
      graphic.remove(true)
    }
  }
}

function updateEchartsDistance(loc, height) {
  eventTarget.fire("dataUpdated", { loc, height })
}
