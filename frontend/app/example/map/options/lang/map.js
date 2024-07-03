// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

let drawLayer
let measure

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  control: {
    homeButton: true,
    sceneModePicker: true,
    infoBox: false,
    vrButton: true,
    geocoder: { service: "gaode", insertIndex: 0 },
    baseLayerPicker: true,
    fullscreenButton: true,
    navigationHelpButton: true,

    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control

    contextmenu: { hasDefault: true }, // Modules involving multiple languages: right-click menu
    compass: { top: "10px", left: "5px" },
    distanceLegend: { left: "180px", bottom: "30px" },
    locationBar: {
      template:
        "<div>lng:{lng}</div> <div>lat:{lat}</div> <div>alt：{alt} m</div> <div>level：{level}</div><div>heading：{heading}°</div> <div>pitch：{pitch}°</div><div>cameraHeight：{cameraHeight}m</div>"
    }
  },

  basemaps: [
    {
      name: "Google Images",
      name_cn: "Google Image",
      name_en: "Google Images",
      icon: "/img/basemaps/google_img.png",
      type: "google",
      layer: "img_d",
      show: true
    },
    {
      name: "Tianditu Images",
      name_cn: "Heaven Map Image",
      name_en: "Tianditu Images",
      icon: "/img/basemaps/tdt_img.png",
      type: "group",
      layers: [
        { name: "basemap", type: "tdt", layer: "img_d" },
        { name: "note", type: "tdt", layer: "img_z" }
      ],
      show: false
    },
    {
      name: "Tianditu Electronic map",
      name_cn: "Tiantu Electronics",
      name_en: "Tianditu Electronic map",
      icon: "/img/basemaps/tdt_vec.png",
      type: "group",
      layers: [
        { name: "basemap", type: "tdt", layer: "vec_d" },
        { name: "note", type: "tdt", layer: "vec_z" }
      ]
    },
    {
      name: "not map",
      name_cn: "No basemap",
      name_en: "not map",
      icon: "/img/basemaps/null.png",
      type: "grid",
      color: "#ffffff",
      alpha: 0.03,
      cells: 2
    }
  ],
  // eslint-disable-next-line no-undef
  lang: CustomLang // Use custom language configuration, the configuration information is in ./CustomLang.js
}

var eventTarget = new mars3d.BaseClass()

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance
  map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  //Modules involving multiple languages: plotting tips
  drawLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // Whether to automatically activate editing after drawing is completed
  })
  map.addLayer(drawLayer)

  drawLayer.bindContextMenu([
    {
      text: () => {
        return map.getLangText("_Delete")
      },
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
        drawLayer.removeGraphic(graphic)
        if (parent) {
          drawLayer.removeGraphic(parent)
        }
      }
    }
  ])

  // Involving multi-language modules: measurement on the picture
  measure = new mars3d.thing.Measure({
    // Text style can be set
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20,
      background: false
    }
  })
  map.addThing(measure)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function toCustomLang() {
  map.options.basemaps.forEach((item) => {
    item.name = item.name_en
  })

  if (map.controls.locationBar) {
    map.controls.locationBar.options.template =
      "<div>lng:{lng}</div> <div>lat:{lat}</div> <div>alt：{alt} m</div> <div>level：{level}</div><div>heading：{heading}°</div> <div>pitch：{pitch}°</div><div>cameraHeight：{cameraHeight}m</div><div class='hide700'> {fps} FPS</div>"
  }

  // eslint-disable-next-line no-undef
  map.lang = CustomLang // Use custom language configuration, the configuration information is in ./CustomLang.js
}

function toDefaultLange() {
  map.options.basemaps.forEach((item) => {
    item.name = item.name_cn
  })

  if (map.controls.locationBar) {
    map.controls.locationBar.options.template =
      "<div>Longitude:{lng}</div> <div>Latitude:{lat}</div> <div class='hide1000'>Horizontal {crsx} Vertical {crsy}</div> <div>Altitude: {alt}meters</div> <div class='hide700'>Level: {level}</div><div>Direction: {heading}°</div> <div>Pitch angle: {pitch}°</ div><div class='hide700'>View height: {cameraHeight} meters</div><div class='hide700'>Frame rate: {fps} FPS</div>"
  }

  map.lang = mars3d.Lang // Use default configuration
}

function distance() {
  drawLayer.stopDraw()
  measure.distance()
}

function area() {
  drawLayer.stopDraw()
  measure.area()
}

function height() {
  drawLayer.stopDraw()
  measure.heightTriangle()
}

function coordinate() {
  drawLayer.stopDraw()
  measure.point()
}
function angle() {
  drawLayer.stopDraw()
  measure.angle()
}

/**
 *Start plotting
 *
 * @startDraw
 * @param { string } type vector data type
 * @returns {void} None
 */
function startDraw(type) {
  measure.stopDraw()
  drawLayer.startDraw({
    type,
    style: {
      color: "#00ffff",
      opacity: 0.6
    }
  })
}
