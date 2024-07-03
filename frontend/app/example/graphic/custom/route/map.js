// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.773622, lng: 117.077444, alt: 5441, heading: 359, pitch: -57 }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true // Whether to display the timeline control
  }
}

var eventTarget = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  //Time to demonstrate data
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2020-11-25 10:10:00"))

  //Load vehicle
  mars3d.Util.fetchJson({
    url: "//data.mars3d.cn/file/apidemo/car-list.json"
  })
    .then(function (res) {
      const tableData = res.data
      eventTarget.fire("carList", { tableData })
      showCarList(tableData)
    })
    .catch(function () {
      globalMsg("Query information failed")
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const colors = [
  "rgb(40, 40, 255)",
  "rgb(0, 88, 176)",
  "rgb(0, 128, 255)",
  "rgb(0, 217, 0)",
  "rgb(0, 151, 0)",
  "rgb(255, 199, 83)",
  "rgb(255, 144, 30)",
  "rgb(202, 101, 0)",
  "rgb(255, 0, 0)"
]

function showCarList(arr) {
  console.log("Loading" + arr.length + "bar")

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // Mouse moves into prompt information
  graphicLayer.bindTooltip(function (event) {
    const attr = event.graphic?.attr
    if (!attr) {
      return
    }
    return `Vehicle number: ${attr.id}<br />License plate number: ${attr.name}`
  })

  // Click on an empty space on the map
  map.on(mars3d.EventType.clickMap, function (event) {
    if (lastClickCar) {
      lastClickCar.circle.show = false
      lastClickCar = null
    }
  })

  //Bind click event
  graphicLayer.on(mars3d.EventType.click, (event, position) => {
    const car = event.graphic
    console.log("Clicked the vehicle", car)

    if (lastClickCar) {
      if (lastClickCar === car) {
        return
      } // Repeat click to jump out
      lastClickCar.circle.show = false
      lastClickCar = null
    }

    car.circle.show = true
    lastClickCar = car

    // Under perspective positioning
    // car.flyToPoint({ radius: 1000 })
  })

  // Delete table data when clicking the delete button in the edit pop-up box
  graphicLayer.on("removeGraphic", (e) => {
    eventTarget.fire("removeCar", { id: e.graphic.options.id })
  })

  let lastClickCar

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    item.show = true
    let modelParam
    switch (item.type) {
      case 1:
        modelParam = {
          scale: 2,
          url: "//data.mars3d.cn/gltf/mars/car/tufangche.glb"
        }
        break
      case 2:
        modelParam = {
          scale: 1,
          url: "//data.mars3d.cn/gltf/mars/car/wajueji.glb"
        }
        break
      default:
    }

    const car = new mars3d.graphic.Route({
      id: item.id,
      name: item.name,
      // maxCacheCount: -1,
      polyline: {
        color: colors[i],
        width: 2,
        clampToGround: true,
        maxDistance: 500
      },
      model: {
        ...modelParam,
        clampToGround: true
      },
      // billboard: {
      //   image: "img/icon/huojian.svg",
      //   scale: 0.5,
      //   alignedAxis: true
      // },
      circle: {
        radius: 50,
        materialType: mars3d.MaterialType.CircleWave,
        materialOptions: {
          color: "#ffff00",
          opacity: 0.3,
          speed: 10,
          count: 3,
          gradient: 0.1
        },
        clampToGround: true,
        show: false
      },
      attr: item
    })
    graphicLayer.addGraphic(car)
  }

  // Get list data of trucks and forklifts regularly
  createPath()
}

// Time interval for obtaining trajectory data (unit: seconds)
const timeStep = 10
let lastTime

// Get and create the trajectory for the first time
function createPath() {
  //The time range and end time of fetching data
  const date = Cesium.JulianDate.toDate(map.clock.currentTime)
  const endTime = mars3d.Util.formatDate(date, "yyyy-MM-dd HH:mm:ss")

  // Modify the current time and go back one minute, because the data is always before the current time.
  date.setSeconds(date.getSeconds() - 60)
  map.clock.currentTime = window.Cesium.JulianDate.fromDate(date)

  // Time range for fetching data, start time
  date.setMinutes(date.getMinutes() - 10) // Get data within a certain period of time for the first time
  const beginTime = mars3d.Util.formatDate(date, "yyyy-MM-dd HH:mm:ss")

  //Record the time when the data was last read
  lastTime = endTime

  // Get data
  getPathList(beginTime, endTime)

  //Regular updates
  setInterval(() => {
    updatePath()
  }, timeStep * 1000)
}

// Subsequent update track
function updatePath() {
  const beginTime = lastTime

  const date = new Date(beginTime)
  date.setSeconds(date.getSeconds() + timeStep)
  const endTime = mars3d.Util.formatDate(date, "yyyy-MM-dd HH:mm:ss")

  lastTime = endTime

  // Get data
  getPathList(beginTime, endTime)
}

//Interface for reading vehicle gps coordinate path
function getPathList(beginTime, endTime) {
  mars3d.Util.fetchJson({
    url: "//data.mars3d.cn/file/apidemo/car-path.json"
  })
    .then((res) => {
      const listALL = res.data || []
      // Because static json is read, in order to demonstrate dynamics, the data in the data is filtered to match the time range.
      // The following code can be commented in the real interface.
      const d_beginTime = new Date(beginTime)
      const d_endTime = new Date(endTime)
      const list = listALL.filter((item) => {
        const thistime = new Date(item.time)
        return thistime >= d_beginTime && thistime <= d_endTime
      })

      const path = `${endTime} gets ${list.length} GPS coordinate records`

      eventTarget.fire("showPath", { path })

      // cycle vehicles
      graphicLayer.eachGraphic((car) => {
        // Get the track list of the corresponding vehicle
        const path = list.filter((item) => {
          return item.id === car.id
        })

        path.forEach((item) => {
          const point = new mars3d.LngLatPoint(item.lon, item.lat, 0)
          car.addDynamicPosition(point, item.time)
        })
      })
    })
    .catch(() => {
      globalMsg("Real-time query of vehicle route information failed, please try again later")
    })
}

function onSelect(id, selected) {
  const car = graphicLayer.getGraphicById(id)
  if (!car) {
    return
  }
  if (selected) {
    car.show = true
    car.flyToPoint({ radius: 900 })
  } else {
    car.show = false
  }
}

function onChange(data) {
  data.forEach((item) => {
    const car = graphicLayer.getGraphicById(item)
    if (car) {
      car.flyToPoint({ radius: 900 })
    }
  })
}

// click row
function flyToModel(id) {
  const car = graphicLayer.getGraphicById(id)
  if (car) {
    car.flyToPoint({ radius: 900 })
  }
}
