// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tilesetLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.658282, lng: 117.070076, alt: 521, heading: 94, pitch: -33 }
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

  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "Petrochemical Plant",
    url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    maximumScreenSpaceError: 1,
    highlight: { type: "click", outlineEffect: true, width: 8, color: "#FFFF00" },
    popup: "all"
  })
  map.addLayer(tilesetLayer)

  // After reading the attributes from the database, organize the assignment according to the following format [not suitable for large models]
  tilesetLayer.readyPromise.then(() => {
    bindSetPropertiesToTile(tilesetLayer.tileset)

    addProperties({
      id: "55a7cf9c71f1c9c495413f934dd1a158",
      name: "Chimney 1 - I updated it with setProperties", // Modify the original properties
      column1: "I was updated by setProperties", // New properties
      testStyle: true // New attributes
    })
    addProperties({
      id: "559cb990c9dffd8675f6bc2186971dc2",
      name: "Chimney 2 - I updated it with setProperties", // Modify the original properties
      column1: "I was updated by setProperties", // New properties
      testStyle: true // New attributes
    })

    setTimeout(() => {
      //Restore or delete the assigned attributes
      removeProperties({
        id: "559cb990c9dffd8675f6bc2186971dc2",
        name: "Big Chimney 2 - I restored it", // Modify the original attributes
        column1: undefined,
        testStyle: undefined
      })
      console.log("Chimney 2 restored attribute values")
    }, 5000)
  })

  // style callback method
  tilesetLayer.style = function (feature) {
    const attr = mars3d.Util.get3DTileFeatureAttr(feature)

    // Below you can make various judgments based on the attributes and return different colors. The hidden ones can have a transparency of 0
    if (attr.testStyle) {
      return "rgba(255,0,0,1)"
    }
    if (attr.id === "f106b7f99d2cb30c3db1c3cc0fde9ccb") {
      return "rgba(0,255,255,1)"
    }
    if (attr.name === "Obj3d66-771819-1-938") {
      return "rgba(0,255,0,1)"
    }

    return "rgba(255,255,255,0.7)"
  }

  //Restore or delete the assigned style
  // setTimeout(() => {
  //   tilesetLayer.style = undefined
  // }, 5000)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const idField = "id" // Uniquely identifies the corresponding attribute field name
const newProperties = {}
const loadFeatureList = new mars3d.MarsArray()

//Bind the event to be processed
function bindSetPropertiesToTile(tileset) {
  tileset.tileLoad.addEventListener(function (tile) {
    processTileFeatures(tile, (feature) => {
      const id = feature.getProperty(idField)
      const attr = newProperties[id]
      if (id && attr) {
        setFeatureProperties(feature, attr)
        loadFeatureList.set(id, feature)
      }
    })
  })

  tileset.tileUnload.addEventListener(function (tile) {
    processTileFeatures(tile, (feature) => {
      const id = feature.getProperty(idField)
      if (id) {
        loadFeatureList.remove(id)
      }
    })
  })
}

//Add attributes
function addProperties(properties) {
  const id = properties[idField]
  newProperties[id] = properties
}

//remove attribute
function removeProperties(properties) {
  const id = properties[idField]
  if (id) {
    delete newProperties[id]

    const feature = loadFeatureList.get(id)
    setFeatureProperties(feature, properties)
  }
}

function processTileFeatures(tile, callback) {
  const content = tile.content
  const innerContents = content.innerContents
  if (Cesium.defined(innerContents)) {
    const length = innerContents.length
    for (let i = 0; i < length; ++i) {
      processContentFeatures(innerContents[i], callback)
    }
  } else {
    processContentFeatures(content, callback)
  }
}
function processContentFeatures(content, callback) {
  const featuresLength = content.featuresLength
  for (let i = 0; i < featuresLength; ++i) {
    const feature = content.getFeature(i)
    callback(feature)
  }
}
//Update feature attributes
function setFeatureProperties(feature, newAttr) {
  if (!feature || !newAttr) {
    return
  }

  for (const key in newAttr) {
    const val = newAttr[key]
    if (feature.hasProperty(key) && feature.getProperty(key) === val) {
      continue
    }
    feature.setProperty(key, val)
  }
}
