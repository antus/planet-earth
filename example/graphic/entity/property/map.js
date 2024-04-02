// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.81506, lng: 117.23734, alt: 1768, heading: 322, pitch: -33 },
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
  map = mapInstance // record map

  //Create vector layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function demoSampleProperty() {
  graphicLayer.clear()

  //Create box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,255,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // Specify a fixed time to facilitate writing demonstration code.
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // Demonstrate attribute mechanism
  const property = new Cesium.SampledProperty(Cesium.Cartesian3)
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), new Cesium.Cartesian3(400.0, 300.0, 100.0))
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:20")), new Cesium.Cartesian3(400.0, 300.0, 900.0))
  // Let the box always exist
  // property.addSample(Cesium.JulianDate.fromDate(new Date('2017-08-26 00:00:00')), new Cesium.Cartesian3(400.0, 300.0, 900.0))

  marsBox.setStyle({ dimensions: property })
}

function demoTimeIntervalCollectionProperty() {
  graphicLayer.clear()

  // Specify a fixed time to facilitate writing demonstration code.
  map.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-08-25T00:00:00.00Z")

  //Create box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(255,255,0,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // Demonstrate attribute mechanism
  const property = new Cesium.TimeIntervalCollectionProperty()
  property.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:00.00Z/2017-08-25T00:00:02.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 200.0)
    })
  )
  property.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:02.00Z/2017-08-25T00:00:04.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 400.0)
    })
  )
  property.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:04.00Z/2017-08-25T00:00:06.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 500.0)
    })
  )
  property.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:06.00Z/2017-08-25T00:00:08.00Z",
      isStartIncluded: true,
      isStopIncluded: true,
      data: new Cesium.Cartesian3(400.0, 300.0, 700.0)
    })
  )

  marsBox.setStyle({ dimensions: property })
}

function demoConstantProperty() {
  graphicLayer.clear()

  //Create box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,255,0,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  setTimeout(() => {
    // Demonstrate attribute mechanism

    // A new ConstantProperty will be created
    // marsBox.entityGraphic.dimensions = new Cesium.Cartesian3(400.0, 300.0, 200.0)

    // Will modify the original ConstantProperty value.
    marsBox.entityGraphic.dimensions.setValue(new Cesium.Cartesian3(400.0, 300.0, 700.0))
  }, 2000)
}

//
function demoCompositeProperty() {
  graphicLayer.clear()

  // Specify a fixed time to facilitate writing demonstration code.
  map.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-08-25T00:00:00.00Z")

  //Create box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,255,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // Demonstrate attribute mechanism

  // 1 sampledProperty
  const sampledProperty = new Cesium.SampledProperty(Cesium.Cartesian3)
  sampledProperty.addSample(Cesium.JulianDate.fromIso8601("2017-08-25T00:00:00.00Z"), new Cesium.Cartesian3(400.0, 300.0, 100.0))
  sampledProperty.addSample(Cesium.JulianDate.fromIso8601("2017-08-25T00:00:10.00Z"), new Cesium.Cartesian3(400.0, 300.0, 500.0))

  // 2 ticProperty
  const ticProperty = new Cesium.TimeIntervalCollectionProperty()
  ticProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:10.00Z/2017-08-25T00:00:12.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 600.0)
    })
  )
  ticProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:12.00Z/2017-08-25T00:00:14.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 700.0)
    })
  )
  ticProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:14.00Z/2017-08-25T00:00:16.00Z",
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(400.0, 300.0, 800.0)
    })
  )
  ticProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:16.00Z/2017-08-25T00:00:18.00Z",
      isStartIncluded: true,
      isStopIncluded: true,
      data: new Cesium.Cartesian3(400.0, 300.0, 900.0)
    })
  )

  // 3 compositeProperty
  const compositeProperty = new Cesium.CompositeProperty()
  compositeProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:00.00Z/2017-08-25T00:00:10.00Z",
      data: sampledProperty
    })
  )
  compositeProperty.intervals.addInterval(
    Cesium.TimeInterval.fromIso8601({
      iso8601: "2017-08-25T00:00:10.00Z/2017-08-25T00:00:20.00Z",
      isStartIncluded: false,
      isStopIncluded: false,
      data: ticProperty
    })
  )

  // 4 Set dimensions
  marsBox.setStyle({ dimensions: compositeProperty })
}

// Make the box move
function demoSampledPositionProperty() {
  graphicLayer.clear()

  //Create box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.198461, 31.834956, 40.2],
    style: {
      dimensions: new Cesium.Cartesian3(100.0, 200.0, 300.0),
      color: "rgba(2,255,123,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // Specify a fixed time to facilitate writing demonstration code.
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // Demonstrate attribute mechanism
  const property = new Cesium.SampledPositionProperty()
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), Cesium.Cartesian3.fromDegrees(117.198461, 31.834956, 40.2))
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:20")), Cesium.Cartesian3.fromDegrees(117.231979, 31.833411, 35.6))

  marsBox.position = property
}

//
function demoColorMaterialProperty() {
  graphicLayer.clear()

  //Create box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,0,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // Demonstrate attribute mechanism
  setTimeout(() => {
    marsBox.setStyle({ material: new Cesium.ColorMaterialProperty(new Cesium.Color(0, 1, 0)) })
    //The above code is equivalent to
    // marsBox.setStyle({ material: new Cesium.Color(0, 1, 0) })
  }, 3000)
}

function demoColorMaterialProperty2() {
  graphicLayer.clear()

  //Create box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,0,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // Specify a fixed time to facilitate writing demonstration code.
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // Demonstrate attribute mechanism
  const colorProperty = new Cesium.SampledProperty(Cesium.Color)
  colorProperty.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), new Cesium.Color(0, 0, 1))
  colorProperty.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:10")), new Cesium.Color(1, 1, 0))

  marsBox.setStyle({ material: new Cesium.ColorMaterialProperty(colorProperty) })
}

//
function demoCallbackProperty() {
  graphicLayer.clear()

  //Create box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,255,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // Demonstrate attribute mechanism
  let len = 100.0
  const property = new Cesium.CallbackProperty(function (time, result) {
    result = result || new Cesium.Cartesian3(400.0, 300.0, 500.0)

    len += 3.0
    if (len > 900.0) {
      len = 100.0
    }

    result.x = 400.0
    result.y = 300.0
    result.z = len

    return result
  }, false)

  marsBox.setStyle({ dimensions: property })
}

//
function demoReferenceProperty() {
  graphicLayer.clear()

  //Create a blue box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,0,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // Specify a fixed time to facilitate writing demonstration code.
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // Demonstrate attribute mechanism
  const property = new Cesium.SampledProperty(Cesium.Cartesian3)
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), new Cesium.Cartesian3(400.0, 300.0, 100.0))
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:20")), new Cesium.Cartesian3(400.0, 300.0, 900.0))
  property.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-26 00:00:00")), new Cesium.Cartesian3(400.0, 300.0, 900.0)) // Let the box always exist
  marsBox.setStyle({ dimensions: property })

  //Another red box
  const redBox = new mars3d.graphic.BoxEntity({
    position: [117.225643, 31.843242, 37.9],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(255,0,0,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(redBox)

  // Demonstrate attribute mechanism
  const collection = graphicLayer.dataSource.entities
  const dimensions = new Cesium.ReferenceProperty(collection, marsBox.id, ["box", "dimensions"])
  redBox.setStyle({ dimensions })
}

//
function demoPropertyBag() {
  graphicLayer.clear()

  //Create box
  const marsBox = new mars3d.graphic.BoxEntity({
    position: [117.220164, 31.834887, 39.6],
    style: {
      dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
      color: "rgba(0,0,255,0.8)",
      outline: true
    }
  })
  graphicLayer.addGraphic(marsBox)

  // Specify a fixed time to facilitate writing demonstration code.
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00"))

  // Demonstrate attribute mechanism
  const zp = new Cesium.SampledProperty(Number)
  zp.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:00")), 100.0)
  zp.addSample(Cesium.JulianDate.fromDate(new Date("2017-08-25 08:00:10")), 800.0)

  const dimensions = new Cesium.PropertyBag({
    x: 400.0,
    y: 300.0,
    z: zp
  })
  marsBox.setStyle({ dimensions })
}

//
function demoVelocityVectorProperty() {
  graphicLayer.clear()

  const propertyFJ = getSampledPositionProperty([
    [117.198461, 31.834956, 40.2],
    [117.231979, 31.833411, 35.6]
  ])
  const graphic = new mars3d.graphic.BillboardEntity({
    position: propertyFJ,
    orientation: new Cesium.VelocityOrientationProperty(propertyFJ),
    style: {
      image: "img/icon/huojian.svg",
      scale: 0.5,
      alignedAxis: new Cesium.VelocityVectorProperty(propertyFJ, true)
    }
  })
  graphicLayer.addGraphic(graphic)
}

// Calculate the SampledPositionProperty trajectory of the demonstration
function getSampledPositionProperty(points) {
  const property = new Cesium.SampledPositionProperty()

  const start = map.clock.currentTime
  const positions = mars3d.LngLatArray.toCartesians(points)
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, i * 20, new Cesium.JulianDate())
    const position = positions[i]
    property.addSample(time, position)
  }
  return property
}
