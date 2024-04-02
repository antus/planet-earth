// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.811646, lng: 117.22232, alt: 842.4, heading: 358.5, pitch: -45 }
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
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // Whether to automatically activate editing after drawing is completed
  })
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  //Load model list
  const configUrl = "//data.mars3d.cn/gltf/list.json"
  mars3d.Util.fetchJson({ url: configUrl })
    .then(function (data) {
      eventTarget.fire("loadModelList", { data })
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
  deleteAll()
}

// draw model
function startDrawModel(style) {
  graphicLayer.startDraw({
    type: "model",
    drawShow: true, // Whether to display the model when drawing can avoid problems with picking coordinates on 3dtiles.
    style
  })
}

// Depth detection
function chkTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
}

function onlyVertexPosition(val) {
  map.onlyVertexPosition = val
}

function deleteAll() {
  graphicLayer.clear()
}

function changeItemImage(item) {
  return mars3d.Util.template(item.image, map.options.templateValues)
}

function changeItemUrl(item) {
  return mars3d.Util.template(item.style.url, map.options.templateValues)
}

/**
 *Open geojson file
 *
 * @export
 * @param {FileInfo} file file name
 * @returns {void} None
 */
function openGeoJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const json = this.result
      graphicLayer.loadGeoJSON(json, {
        flyTo: true
      })
    }
  } else if (fileType === "glb" || fileType === "gltf") {
    graphicLayer.clear()
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = function (e) {
      const arrayBuffer = this.result
      const graphic = new mars3d.graphic.ModelPrimitive({
        position: [117.221674, 31.823752, 34.7],
        style: {
          url: new Uint8Array(arrayBuffer),
          scale: 1,
          minimumPixelSize: 50
        },
        hasEdit: false
      })
      graphicLayer.addGraphic(graphic)

      graphic.flyTo({ radius: 1000 })
    }
  } else {
    globalMsg("Data of " + fileType + " file type is not supported yet!")
  }
}

// save document
function saveGeoJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("No data is currently marked, no need to save!")
    return
  }
  const geojson = graphicLayer.toGeoJSON()
  mars3d.Util.downloadFile("Model plotting.json", JSON.stringify(geojson))
}
