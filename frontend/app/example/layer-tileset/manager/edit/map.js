// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var tiles3dLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: "#363635", // sky background color
    globe: {
      baseColor: "#363635", // Earth ground background color
      showGroundAtmosphere: false,
      enableLighting: false
    },
    clock: {
      currentTime: "2023-11-01 12:00:00" // Fixed light time
    },
    cameraController: {
      zoomFactor: 1.5,
      minimumZoomDistance: 0.1,
      maximumZoomDistance: 200000,
      enableCollisionDetection: false // Allow underground access
    }
  }
}

// Custom event
var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  // Fixed lighting direction
  map.scene.light = new Cesium.DirectionalLight({
    direction: map.scene.camera.direction
  })
  map.camera.percentageChanged = 0.001
  map.on(mars3d.EventType.cameraChanged, function (event) {
    map.scene.light.direction = map.scene.camera.direction
  })

  // If there is a "+" symbol in the model address, you can add the following method for customized processing
  Cesium.Resource.ReplaceUrl = function (url) {
    if (url.endsWith(".json") || url.endsWith(".b3dm")) {
      return url.replace(/\+/gm, "%2B") // Escape the "+" symbol in 3dtiles
    } else {
      return url
    }
  }

  //Read localStorage value
  localforage.getItem(storageName).then(function (lastUrl) {
    eventTarget.fire("historyUrl", { url: lastUrl })
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function removeLayer() {
  if (tiles3dLayer) {
    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}
const storageName = "layer-tileset-manager-edit"
function showModel(url) {
  removeLayer()

  if (!url) {
    globalMsg("Please enter the layer URL!")
    return
  }

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "model name",
    url,
    maximumScreenSpaceError: 16,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    popup: "all",
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  tiles3dLayer.readyPromise
    .then(() => {
      // Loading completed
      console.log("Model loading completed", tiles3dLayer)

      localforage.setItem(storageName, url) //Record historical values
      eventTarget.fire("tiles3dLayerLoad", { layer: tiles3dLayer })
    })
    .catch((e) => {
      // Failed to load
      console.log("Model loading failed", e)
    })

  // Loading completion event
  tiles3dLayer.on(mars3d.EventType.updatePosition, function (event) {
    eventTarget.fire("changePoition", {
      center: tiles3dLayer.center,
      rotation: tiles3dLayer.rotation
    })
  })

  tiles3dLayer.bindContextMenu([
    {
      text: "Start editing",
      icon: "fa fa-edit",
      show: function (e) {
        return tiles3dLayer.hasEdit && !tiles3dLayer.isEditing
      },
      callback: (e) => {
        tiles3dLayer.startEditing()
      }
    }
    // {
    // text: "Stop editing",
    //   icon: "fa fa-edit",
    //   show: function (e) {
    //     return tiles3dLayer.hasEdit && tiles3dLayer.isEditing
    //   },
    //   callback: (e) => {
    //     tiles3dLayer.stopEditing()
    //   }
    // }
  ])
}

// Find the exact height asynchronously
function updateHeightForSurfaceTerrain(position) {
  // Find ground altitude (asynchronous)
  if (Cesium.defined(position) && Cesium.defined(position.alt)) {
    // No need to process when there is a height set by history
  } else {
    mars3d.PointUtil.getSurfaceTerrainHeight(map.scene, tiles3dLayer.orginCenterPosition).then((result) => {
      if (!Cesium.defined(result.height)) {
        return
      }
      const offsetZ = Math.ceil(result.height - tiles3dLayer.orginCenterPoint.alt + 1)
      console.log("Ground altitude: " + result.height.toFixed(2) + ", offset required" + offsetZ)

      tiles3dLayer.height = offsetZ

      eventTarget.fire("changeHeight", { alt: offsetZ })
    })
  }
}

//Modify the changed parameters
function updateModel(params, pannelData) {
  tiles3dLayer.setOptions(params)

  //Non-parameter, call method to bind or unbind
  if (pannelData.highlightEnable) {
    tiles3dLayer.highlight = {
      type: mars3d.EventType.click, // The default is to highlight when the mouse moves in, you can also specify click to highlight
      outlineEffect: true, // Use OutlineEffect to highlight
      color: "#00FF00"
    }
  } else {
    tiles3dLayer.highlight = undefined
  }
  if (pannelData.popupEnable) {
    tiles3dLayer.bindPopup("all")
  } else {
    tiles3dLayer.unbindPopup()
  }
}

// Depth detection
function updateDepthTest(enabled) {
  map.scene.globe.depthTestAgainstTerrain = enabled
}

function locate() {
  if (tiles3dLayer.tileset?.boundingSphere) {
    map.camera.flyToBoundingSphere(tiles3dLayer.tileset.boundingSphere, {
      offset: new Cesium.HeadingPitchRange(map.camera.heading, map.camera.pitch, tiles3dLayer.tileset.boundingSphere.radius * 2)
    })
  } else {
    map.flyToPoint(tiles3dLayer.position, {
      radius: tiles3dLayer.tileset.boundingSphere.radius * 2
    })
  }
}

//Save GeoJSON
function saveBookmark() {
  const params = tiles3dLayer.toJSON()

  // Clean up the parts of the parameters that do not need to be saved (only used for internal control of the current example)
  delete params.highlightEnable
  delete params.popupEnable

  console.log("Layer parameters are: ", params)

  mars3d.Util.downloadFile("3dtiles layer configuration.json", JSON.stringify(params))
}

// View components
function checkedTree() {
  tiles3dLayer.tileset.style = undefined
}

function showCompTree(model) {
  querySceneTreeData(model)
    .then(function (scene) {
      const data = []
      if (scene.scenes) {
        for (let i = 0; i < scene.scenes.length; i++) {
          const node = scene.scenes[i]
          name2text(node)
          data.push(node)
        }
      } else {
        name2text(scene)
        data.push(scene)
      }

      eventTarget.fire("compTree", { data })
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

function compModelChange(nodeid, nodesphere) {
  if (nodesphere[3] <= 0) {
    return
  }
  // Component node position
  let center = new Cesium.Cartesian3(nodesphere[0], nodesphere[1], nodesphere[2])

  // Get the position of the component node, now the new position after the change of the original matrix
  center = tiles3dLayer.getPositionByOrginMatrix(center)

  // fly over
  const sphere = new Cesium.BoundingSphere(center, nodesphere[3])
  map.camera.flyToBoundingSphere(sphere, {
    offset: new Cesium.HeadingPitchRange(map.camera.heading, map.camera.pitch, nodesphere[3] * 1.5),
    duration: 0.5
  })

  //Set the style of tileset
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${id} ==='" + nodeid + "'", "rgb(255, 255, 255)"],
        ["true", "rgba(255, 200, 200,0.2)"]
      ]
    }
  })
}

// Get component tree data
function querySceneTreeData(url) {
  const scenetree = url.substring(0, url.lastIndexOf("/") + 1) + "scenetree.json"

  return mars3d.Util.fetchJson({ url: scenetree })
}

function name2text(o) {
  o.text = o.name

  // In order to avoid the inconsistency of the IDs in the tree control, we need to change this.
  o.eleid = o.id
  o.id = undefined

  if ((!o.text || o.text.trim() === "") && o.type) {
    o.text = o.type
  }

  if (o.children) {
    for (let i = 0; i < o.children.length; i++) {
      name2text(o.children[i])
    }
  }
}
