// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.516143, lng: 117.282937, alt: 46242, heading: 2, pitch: -49 }
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
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function startDrawModel(url, isProxy) {
  if (isProxy) {
    url = "//server.mars3d.cn/proxy/" + url
  }

  graphicLayer.startDraw({
    type: "model",
    drawShow: true, // Whether to display the model when drawing can avoid problems with picking coordinates on 3dtiles.
    style: {
      url,
      scale: 1
    }
  })
}

// terrain
function chkHasTerrain(isStkTerrain) {
  map.hasTerrain = isStkTerrain
}

// Depth detection
function chkTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
  if (val) {
    globalMsg("When depth detection is turned on, you will not be able to see objects underground or obscured by terrain.")
  }
}

function onlyVertexPosition(val) {
  map.onlyVertexPosition = val
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
    console.log("reader")
    console.log(reader)
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

function saveGeoJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("No data is currently marked, no need to save!")
    return
  }
  const geojson = graphicLayer.toGeoJSON()
  mars3d.Util.downloadFile("My annotation.json", JSON.stringify(geojson))
}
