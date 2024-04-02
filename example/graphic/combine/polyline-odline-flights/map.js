// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 28.059099, lng: 120.440855, alt: 5467418, heading: 343, pitch: -75 }
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

  map.basemap = "Black basemap"

  addDemoGraphics()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function addDemoGraphics() {
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/flights.json" }).then(function (data) {
    const airports = data.airports.map(function (item) {
      return {
        name: item[0],
        country: item[2],
        point: Cesium.Cartesian3.fromDegrees(item[3], item[4])
      }
    })

    const routesGroupByAirline = {}
    data.routes.forEach(function (route) {
      const airline = data.airlines[route[0]]
      const airlineName = airline[0]
      if (!routesGroupByAirline[airlineName]) {
        routesGroupByAirline[airlineName] = []
      }
      routesGroupByAirline[airlineName].push(route)
    })

    const routes = routesGroupByAirline["Air China"]

    const routePaths = []
    routes.forEach(function (route, index) {
      const start = airports[route[1]]
      const end = airports[route[2]]

      routePaths.push({
        startName: start.name,
        startPoint: start.point,
        endName: end.name,
        endPoint: end.point
      })
    })

    initPath(routePaths)
  })
}

function initPath(routePaths) {
  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  // Bind the Popup window to the layer
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr
    if (!attr) {
      return false
    }
    return mars3d.Util.getTemplateHtml({ title: "Route", template: "{startName} - {endName}", attr })
  })

  const arrData = []
  routePaths.forEach(function (item, index) {
    const positions = mars3d.PolyUtil.getLinkedPointList(item.startPoint, item.endPoint, 5000, 30)

    arrData.push({
      positions,
      style: {
        width: 2.0,
        materialType: mars3d.MaterialType.ODLine,
        materialOptions: {
          color: new Cesium.Color(0.8 * Math.random() + 0.2, 0.5 * Math.random() + 0.5, 0.1, 1.0),
          bgColor: new Cesium.Color(0.8, 0.8, 0.2, 0.2),
          startTime: 10.0 * Math.random(),
          speed: 2 + 1.0 * Math.random(),
          bidirectional: 2
        }
      },
      attr: item
    })
  })

  // Combined rendering of multiple line objects.
  const graphic = new mars3d.graphic.PolylineCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(graphic)
}

function getAirData() {
  // Annual flight statistics
  const AirNum = [
    {
      year: "2000", // year
      domestic: 1032, // domestic flights
      international: 133 // international flights
    },
    {
      year: "2010",
      domestic: 1078,
      international: 302
    },
    {
      year: "2017",
      domestic: 3615,
      international: 803
    },
    {
      year: "2018",
      domestic: 4096,
      international: 849
    },
    {
      year: "2019",
      domestic: 4568,
      international: 953
    }
  ]

  // Domestic airport route numbers
  const routeNum = [
    {
      airport: "Hefei Xinqiao Airport",
      routeNum: 116
    },
    {
      airport: "Beijing Daxing Airport",
      routeNum: 126
    },
    {
      airport: "Hubei Airport",
      routeNum: 106
    },
    {
      airport: "Shanghai Hongqiao Airport",
      routeNum: 102
    },
    {
      airport: "Shenzhen Bao'an International Airport",
      routeNum: 120
    }
  ]

  return {
    guoji: 895, // Number of international routes
    guonei: 4686, // Number of domestic routes
    flight: AirNum,
    route: routeNum
  }
}

// Rendering according to a single line is less efficient
/* function initPath(routePaths) {
  //Create vector data layer
  let graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  routePaths.forEach(function (item, index) {
    const positions = mars3d.PolyUtil.getLinkedPointList(item.startPoint, item.endPoint, 5000, 30)

    let graphic = new mars3d.graphic.PolylinePrimitive({
      positions: positions,
      style: {
        width: 2.0,
         materialType:mars3d.MaterialType.ODLine, {
          color: new Cesium.Color(0.8 * Math.random() + 0.2, 0.5 * Math.random() + 0.5, 0.1, 1.0),
          bgColor: new Cesium.Color(0.8, 0.8, 0.2, 0.2),
          startTime: 10.0 * Math.random(),
          speed: 2 + 1.0 * Math.random(),
          bidirectional: 2
        })
      }
    })
    graphicLayer.addGraphic(graphic)
  })
} */
