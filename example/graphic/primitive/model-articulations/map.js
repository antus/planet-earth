// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphic
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
  addRockets()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

let model

function addRockets() {
  // // Bind to UI interface control parameters
  // const viewModel = {
  //   articulations: [],
  //   stages: [],
  //   selectedArticulation: undefined
  // }

  //Create vector data layer
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    let nodeName = event.pickedObject?.detail?.node?._node?.articulationName
    if (nodeName) {
      nodeName = namesCN[nodeName] || nodeName
      globalMsg("Clicked the widget: " + nodeName)
    }

    console.log("Monitoring layer, clicked vector object", event)
  })

  const expandModelShader = new Cesium.CustomShader({
    uniforms: {
      u_drag: {
        type: Cesium.UniformType.VEC2,
        value: new Cesium.Cartesian2(1.0, 1.0) // Vector from the latest drag center to the mouse
      }
    },
    vertexShaderText: `
      // If the mouse is dragged to the right, the model will grow. If the mouse is dragged to the left, the model will shrink.
      void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput)
      {
          vsOutput.positionMC += 0.1 * u_drag.x * vsInput.attributes.normalMC;
      } `
  })
  bindUpdateModelShader(expandModelShader)

  graphic = new mars3d.graphic.ModelPrimitive({
    position: [113.693, 31.243, 220000],
    style: {
      url: "//data.mars3d.cn/gltf/sample/launchvehicle/launchvehicle.glb",
      scale: 20,
      minimumPixelSize: 128,
      heading: 0,
      customShader: expandModelShader
    }
  })
  graphicLayer.addGraphic(graphic)

  // gltf model loading completion event
  graphic.on(mars3d.EventType.load, (event) => {
    model = event.model

    //Zoom the area to the location of the model
    const controller = map.scene.screenSpaceCameraController
    const r = 2.0 * Math.max(model.boundingSphere.radius, map.camera.frustum.near)
    controller.minimumZoomDistance = r * 0.2

    const center = Cesium.Matrix4.multiplyByPoint(model.modelMatrix, Cesium.Cartesian3.ZERO, new Cesium.Cartesian3())
    const heading = Cesium.Math.toRadians(0.0)
    const pitch = Cesium.Math.toRadians(-10.0)
    map.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, r * 1.5))

    //Set parameter effects
    model.setArticulationStage("LaunchVehicle Pitch", -60) //The overall pitch angle of the rocket
    model.setArticulationStage("SRBFlames Size", 1) // Booster flame size
    model.applyArticulations()

    // Read the component information in gltf cesium versions before 1.97
    // const articulationsByName = model._runtime.articulationsByName
    // const articulations = Object.keys(articulationsByName).map(function (articulationName) {
    //   return {
    //     name: articulationName,
    // name_cn: namesCN[articulationName] || articulationName, // Chinese
    //     stages: articulationsByName[articulationName].stages.map(function (stage) {
    //       const stageModel = {
    //         name: stage.name,
    // name_cn: namesCN[stage.name] || stage.name, // Chinese
    //         minimum: stage.minimumValue,
    //         maximum: stage.maximumValue,
    //         current: stage.currentValue
    //       }
    //       return stageModel
    //     })
    //   }
    // })

    // Read the component information in gltf cesium 1.97+ and later versions
    const articulationsByName = model.sceneGraph._runtimeArticulations
    const articulations = Object.keys(articulationsByName).map(function (articulationName) {
      return {
        name: articulationName,
        name_cn: namesCN[articulationName] || articulationName, // Chinese
        stages: articulationsByName[articulationName]._runtimeStages.map(function (stage) {
          const stageModel = {
            name: stage.name,
            name_cn: namesCN[stage.name] || stage.name, // Chinese
            minimum: stage.minimumValue,
            maximum: stage.maximumValue,
            current: stage.currentValue
          }
          return stageModel
        })
      }
    })

    console.log("Complete reading of component information in gltf", articulations)

    eventTarget.fire("loadGltfModel", { articulations })
  })
}

//Set parameter effects
function setArticulationStage(groupName, stageName, current) {
  const name = groupName + " " + stageName
  model.setArticulationStage(name, Number(current))
  model.applyArticulations()
}

//Chinese attribute name
const namesCN = {
  //Attribute grouping
  LaunchVehicle: "Rocket as a whole",
  Fairing: "Fairing",

  UpperStage: "Second level part",
  UpperStageEngines: "Secondary Engine",
  UpperStageFlames: "Second stage flames",

  InterstageAdapter: "Interstage segment",

  Booster: "First level part",
  BoosterEngines: "Level 1 Engine",
  BoosterFlames: "First level flames",

  SRBs: "Boosters",
  SRBFlames: "Booster Flames",

  // Attributes
  MoveX: "Move in X direction",
  MoveY: "Move in Y direction",
  MoveZ: "Move in Z direction",
  Yaw: "Yaw angle",
  Pitch: "Pitch angle",
  Roll: "Roll angle",
  Size: "size",
  Separate: "separate",
  Drop: "drop",
  Open: "open",
  Rotate: "rotate"
}

// Drag the model with the mouse to spread the model
function bindUpdateModelShader(expandModelShader) {
  let dragActive = false
  const dragCenter = new Cesium.Cartesian2()
  const scratchDrag = new Cesium.Cartesian2()
  map.on(mars3d.EventType.leftDown, function (event) {
    if (!Cesium.defined(event.graphic)) {
      return
    }

    map.scene.screenSpaceCameraController.enableInputs = false

    dragActive = true
    event.position.clone(dragCenter)
  })

  map.on(mars3d.EventType.mouseMove, function (event) {
    if (!dragActive) {
      return
    }
    const drag = Cesium.Cartesian3.subtract(event.endPosition, dragCenter, scratchDrag)
    expandModelShader.setUniform("u_drag", drag)
  })

  map.on(mars3d.EventType.leftUp, function (event) {
    map.scene.screenSpaceCameraController.enableInputs = true
    dragActive = false
  })
}
