// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 30.402686, lng: 116.303632, alt: 48692, heading: 3, pitch: -43 }
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

  // map.on(mars3d.EventType.removeLayer, function (event) {
  // console.log("Layer removed", event)
  // })

  showDraw()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function removeLayer() {
  if (graphicLayer) {
    graphicLayer.clear()
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

/**
 * Geojosn data saved by the platform after plotting through draw (style is already built-in, no need to configure symbol)
 */
function showDraw(isFlyTo) {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "Plotting sample data",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
    popup: "{type} {name}",
    queryParameters: {
      token: "mars3d" // Custom url parameters can be passed, such as token, etc.
    },
    symbol: {
      merge: true,
      styleOptions: {
        // Style when highlighted
        highlight: {
          type: "click",
          opacity: 0.9
        }
      }
    },
    flyTo: isFlyTo
  })
  map.addLayer(graphicLayer)

  // The load event must be bound before the load is completed to listen.
  graphicLayer.on(mars3d.EventType.load, function (event) {
    if (event.layer) {
      console.log("Data loading completed", event)
    }
  })

  setTimeout(() => {
    // readyPromise can be obtained after load loading data is completed.
    graphicLayer.readyPromise.then(function (layer) {
      console.log("readyPromise: data loading completed", layer)
    })
  }, 5000)

  // click event
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Layer clicked", event)
  })
}

/**
 *Point data
 */
function showPoint() {
  removeLayer()

  window._test_button_click = function (attr) {
    globalAlert(JSON.stringify(attr), "Test to view details")
  }

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "Sports facilities",
    url: "//data.mars3d.cn/file/geojson/hfty-point.json",
    symbol: {
      styleOptions: {
        image: "img/marker/mark-red.png",
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scale: 1,
        scaleByDistance: true,
        scaleByDistance_far: 20000,
        scaleByDistance_farValue: 0.5,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        // setHeight: 5000, //Specify height
        label: {
          text: "{project name}",
          font_size: 25,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -25,
          scaleByDistance: true,
          scaleByDistance_far: 80000,
          scaleByDistance_farValue: 0.5,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 80000,
          distanceDisplayCondition_near: 0
        }
      }
    },
    popup: [
      { field: "Project name", name: "Project name" },
      { field: "Construction Nature", name: "Construction Nature" },
      { field: "Facility Level", name: "Facility Level" },
      {field: "Affiliated district and county", name: "Affiliated district and county" },
      { field: "Architectural content and", name: "Architectural content" },
      { field: "New land (", name: "New land" },
      { field: "Start of construction", name: "Start of construction" },
      { field: "Total investment (10,000", name: "Total investment" },
      { field: "Funding Source", name: "Funding Source" },
      { field: "Preliminary site selection", name: "Preliminary site selection" },
      { field: "Facility Type", name: "Facility Type" },
      { field: "Facility Level", name: "Facility Level" },
      { field: "District and County where you are located", name: "District and County where you are located" },
      { field: "Specific location", name: "Specific location" },
      { field: "Construction content (", name: "Construction content" },
      { field: "Land area (", name: "Land area", format: "mars3d.MeasureUtil.formatArea" },
      { field: "Facility size (", name: "Facility size" },
      { field: "organizer type", name: "organizer type" },
      { field: "Start time", name: "Start time" },
      { field: "Total investment amount (", name: "Total investment amount", unit: "100 million yuan" },
      { field: "Project promotion main body", name: "Project promotion main body" },
      { field: "Project Progress", name: "Project Progress" },
      { field: "Project Source", name: "Project Source" },
      { field: "Remarks", name: "Remarks" },
      { name: "Details", type: "button", className: "mars3d-popup-btn-custom", callback: "_test_button_click" }
    ],
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

/**
 * Nationwide provincial boundaries
 */
function showChinaLine() {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "National Provincial Boundaries",
    url: "//data.mars3d.cn/file/geojson/areas/100000_full.json",
    format: simplifyGeoJSON, // used for custom processing of geojson
    symbol: {
      type: "polylineP",
      styleOptions: {
        width: 2,
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          color: "#00ffff",
          image: "img/textures/fence-line.png",
          speed: 10,
          repeat_x: 10
        },
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 12000000,
        distanceDisplayCondition_near: 100000,
        label: {
          text: "{name}",
          position: "{center}", // Provincial capital position center
          font_size: 30,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          scaleByDistance: true,
          scaleByDistance_far: 60000000,
          scaleByDistance_farValue: 0.2,
          scaleByDistance_near: 1000000,
          scaleByDistance_nearValue: 1,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 10000000,
          distanceDisplayCondition_near: 100000,
          setHeight: 10000
        }
      }
    },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })
}

// Simplify geojson coordinates
function simplifyGeoJSON(geojson) {
  try {
    geojson = turf.simplify(geojson, { tolerance: 0.0001, highQuality: true, mutate: true })
  } catch (e) {
    //
  }
  return geojson
}

/**
 * Show Hefei area
 */
function showRegion() {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "Hefei City",
    url: "//data.mars3d.cn/file/geojson/areas/340100_full.json",
    symbol: {
      styleOptions: {
        fill: true,
        randomColor: true, // random color
        opacity: 0.3,
        outline: true,
        outlineStyle: {
          color: "#FED976",
          width: 3,
          opacity: 1
        },
        // Style when highlighted
        highlight: {
          opacity: 0.9,
          outlineStyle: {
            width: 6,
            color: "#ff0000",
            addHeight: 100
          },
          label: { show: true }
        },
        label: {
          show: false,
          // Center point of the surface, display text configuration
          text: "{name}", // Corresponding attribute name
          opacity: 1,
          font_size: 40,
          color: "#ffffff",

          font_family: "楷体",
          outline: true,
          outlineColor: "#000000",
          outlineWidth: 3,

          background: false,
          backgroundColor: "#000000",
          backgroundOpacity: 0.1,

          font_weight: "normal",
          font_style: "normal",

          scaleByDistance: true,
          scaleByDistance_far: 20000000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,

          distanceDisplayCondition: false,
          distanceDisplayCondition_far: 10000,
          distanceDisplayCondition_near: 0,
          visibleDepth: false
        }
      }
    },
    popup: "{name}",
    // "tooltip": "{name}",
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

// Planning surface
function showPlanningSurface() {
  removeLayer()

  map.setCameraView({ lat: 31.591382, lng: 120.718945, alt: 784, heading: 279, pitch: -67 })

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    id: 1987,
    name: "Land Use Planning",
    // 1. Support URL
    url: "//data.mars3d.cn/file/geojson/guihua.json",
    // 2. Also supports direct incoming data
    // data: {
    //   type: "FeatureCollection",
    // name: "Land Planning",
    // features: [] //Data has been omitted and can be copied from guihua.json above
    // },
    symbol: {
      type: "polygonC",
      styleOptions: {
        opacity: 0.6,
        color: "#0000FF"
      },
      styleField: "type",
      styleFieldOptions: {
        Class I residential land: { color: "#FFDF7F" },
        Class II residential land: { color: "#FFFF00" },
        Community service land: { color: "#FF6A38" },
        Child care site: { color: "#FF6A38" },
        Mixed commercial and residential land: { color: "#FF850A" },
        Administrative office space: { color: "#FF00FF" },
        Cultural facilities land: { color: "#FF00FF" },
        Primary school land: { color: "#FF7FFF" },
        Junior high school land: { color: "#FF7FFF" },
        Stadium land: { color: "#00A57C" },
        Hospital land: { color: "#A5527C" },
        Social welfare land: { color: "#FF7F9F" },
        Commercial land: { color: "#FF0000" },
        Business land: { color: "#7F0000" },
        Business outlet land: { color: "#FF7F7F" },
        Class I industrial land: { color: "#A57C52" },
        Social parking lot: { color: "#C0C0C0" },
        Communication land: { color: "#007CA5" },
        Drainage land: { color: "#00BFFF" },
        Park green space: { color: "#00FF00" },
        Protective green space: { color: "#007F00" },
        River water: { color: "#7FFFFF" },
        Equipped with parking lot: { color: "#ffffff" },
        Road land: { color: "#ffffff" }
      }
    },
    popup: "Type:{type}"
    // flyTo: true,
  })
  map.addLayer(graphicLayer)

  //The following code demonstrates how to bind additional event methods if the layer is configured in config.json
  // Bind the click event of the "id" value layer corresponding to the layer configuration in config.json (for example, the following is the layer corresponding to id:1987)
  const layerTest = map.getLayerById(1987)
  //Bind event
  layerTest.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })

  layerTest.on(mars3d.EventType.click, function (event) {
    // click event
    console.log("Layer clicked", event)
  })
}

/**
 * Three-dimensional buildings
 */
function showBuilding() {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "Building Floor",
    url: "//data.mars3d.cn/file/geojson/buildings-demo.json",
    symbol: {
      styleOptions: {
        color: "#0d3685",
        outlineColor: "#0d3685",
        opacity: 0.8
      },
      callback: function (attr, styleOpt) {
        const diffHeight = Number(attr.floors || 1) * Number(attr.flo_height)
        return { height: 0, diffHeight }
      }
    },
    center: { lat: 31.928659, lng: 120.420654, alt: 838, heading: 344, pitch: -42 },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })
}

/**
 * Layered and divided three-dimensional buildings
 */
function showFloor() {
  removeLayer()

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "stratified household building floor",
    url: "//data.mars3d.cn/file/geojson/huxing.json",
    symbol: {
      styleOptions: {
        color: "#ffffff",
        opacity: 0.2,
        outline: true,
        outlineColor: "#63AEFF",
        outlineOpacity: 0.3,

        highlight: {
          type: "click",
          color: "#00ffff",
          opacity: 0.6
        }
      },
      callback: function (attr, styleOpt) {
        const flrH = attr.floorh || 0 // Floor height
        const lyrH = attr.layerh || 0 // Floor height

        return { height: flrH, diffHeight: lyrH }
      }
    },
    // popup: "all",
    center: { lat: 31.821524, lng: 117.179329, alt: 255, heading: 25, pitch: -48 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })
}

/**
 * Administrative division, converted to wall display
 */
function showBoundaryWall() {
  removeLayer()

  map.setCameraView({ lat: 30.561661, lng: 117.663884, alt: 113078, heading: 346, pitch: -43 })

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "Hefei City",
    url: "//data.mars3d.cn/file/geojson/areas/340100_full.json",
    symbol: {
      type: "wall",
      styleOptions: {
        diffHeight: 5000, // wall height
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          color: "#00ffff", // color
          opacity: 0.6, // transparency
          image: "img/textures/fence.png", // image
          repeatX: 1, // number of repeats
          axisY: true, // vertical direction
          speed: 10 // speed
        },
        // Style when highlighted
        highlight: {
          type: "click",
          color: "#ffff00"
        }
      }
    },
    popup: "{name}"
    // "tooltip": "{name}",
    // flyTo: true,
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

/**
 * Display special surface data (single)
 */
let tilesetLayer
function showMonomer() {
  removeLayer()

  // 3D model
  if (!tilesetLayer) {
    tilesetLayer = new mars3d.layer.TilesetLayer({
      name: "Confucian Temple",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
      position: { alt: 38.8 },
      maximumScreenSpaceError: 1,
      show: true
    })
    map.addLayer(tilesetLayer)
  }

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "Confucian Temple-Single",
    url: " //data.mars3d.cn/file/geojson/dth-wm.json",
    symbol: {
      type: "polygonP",
      styleOptions: {
        //Single default display style
        color: "rgba(255, 255, 255, 0.01)",
        clampToGround: true,
        classification: true,
        // Singletify the style highlighted after the mouse is moved or clicked
        highlight: {
          // type: mars3d.EventType.click,
          color: "rgba(255,255,0,0.4)"
        }
      }
    },
    popup: [
      { field: "name", name: "House name" },
      { field: "jznf", name: "Year of construction" },
      { field: "ssdw", name: "Affiliated unit" },
      { field: "remark", name: "Remarks information" }
    ],
    center: { lat: 33.589442, lng: 119.031613, alt: 254, heading: 5, pitch: -37 },
    flyTo: true
  })
  map.addLayer(graphicLayer)

  //Bind event
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("Data loading completed", event)
  })
}

/**
 * Show countries around the world
 */
function showWorld() {
  removeLayer()

  map.setCameraView({ lat: 22.564341, lng: 89.44688, alt: 10817167, heading: 0, pitch: -87 })

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "National Boundary Line",
    url: "//data.mars3d.cn/file/geojson/world.json",
    symbol: {
      type: "polygonP",
      styleOptions: {
        fill: true,
        // color: '#ffffff',
        // opacity: 0.01,
        randomColor: true,
        opacity: 0.5,

        // Style when highlighted
        highlight: {
          type: "click",
          color: "#ffff00"
        }
      },
      styleField: "name",
      styleFieldOptions: {
        Russia: { clampToGround: true }
      }
    },
    popup: "{name} {name_cn}"
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

//Load GCJ data for correction
function showGCJ02Data() {
  removeLayer()

  const gcjLayer = new mars3d.layer.GeoJsonLayer({
    name: "before correction",
    url: "//data.mars3d.cn/file/geojson/areas/340303.json",
    symbol: {
      styleOptions: {
        fill: false,
        outline: true,
        outlineStyle: {
          color: "#FF0000",
          width: 3
        }
      }
    },
    popup: "GCJ02 coordinates before correction"
  })
  map.addLayer(gcjLayer)

  graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "After correction",
    url: "//data.mars3d.cn/file/geojson/areas/340303.json",
    chinaCRS: mars3d.ChinaCRS.GCJ02, //Identifies the data coordinates, which will be corrected internally
    symbol: {
      styleOptions: {
        fill: false,
        outline: true,
        outlineStyle: {
          color: "#00ffff",
          width: 3
        }
      }
    },
    popup: "WGS coordinates after correction",
    flyTo: true
  })
  map.addLayer(graphicLayer)
}
