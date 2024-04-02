// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 30.857163, lng: 116.345129, alt: 926, heading: 33, pitch: -34 }
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
  map.basemap = 2017 // blue basemap
  map.fixedLight = true // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  //Bind listening events on the layer
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Monitoring layer, clicked vector object", event)
  })

  bindLayerPopup() // Bind popup on the layer, which will take effect on all vector data added to this layer.
  bindLayerContextMenu() // Bind the right-click menu on the layer, which will take effect on all vector data added to this layer.

  //Add some demo data
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.ModelPrimitive({
    name: "Police Car",
    position: [116.346929, 30.861947, 401.34],
    style: {
      url: "//data.mars3d.cn/gltf/mars/jingche/jingche.gltf",
      scale: 20,
      minimumPixelSize: 50,
      heading: 90,

      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 0,
      distanceDisplayCondition_far: 10000,
      distanceDisplayPoint: {
        // When the viewing angle distance exceeds a certain distance (defined by distanceDisplayCondition_far), it is displayed as a point object style.
        color: "#00ff00",
        pixelSize: 8
      },

      label: {
        text: "I am original",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -50,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 10000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "Example 1" }
  })
  graphicLayer.addGraphic(graphic)

  // Demonstrate personalized processing graphic
  initGraphicManager(graphic)

  // graphic to geojson
  const geojson = graphic.toGeoJSON()
  console.log("Converted geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// You can also perform personalized management and binding operations on a single Graphic
function initGraphicManager(graphic) {
  // 3. Bind the listening event to the graphic
  // graphic.on(mars3d.EventType.click, function (event) {
  // console.log("Listening to graphic, clicked vector object", event)
  // })
  // Bind Tooltip
  // graphic.bindTooltip('I am the Tooltip bound to graphic') //.openTooltip()

  // Bind Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">I am a Popup bound to the graphic </th>
            </tr>
            <tr>
              <td>Tips:</td>
              <td>This is just test information, you can use any html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  //Bind right-click menu
  graphic.bindContextMenu([
    {
      text: "Delete object [graphic-bound]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])

  //Test color flash
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // Flashing duration (seconds)
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // Callback after completion
      }
    })
  }
}

// Add a single geojson as graphic, use graphicLayer.loadGeoJSON directly for multiple
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // new coordinates
  graphicCopy.position = [116.348587, 30.859472, 373.8]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "I generated it after conversion"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.ModelPrimitive({
    name: "Fan",
    position: [116.35104, 30.86225, 374.4],
    style: {
      url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
      colorBlendMode: Cesium.ColorBlendMode.MIX,
      heading: 270,
      scale: 30,
      minimumPixelSize: 100,
      runAnimations: false, // Turn off startup animations

      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 0,
      distanceDisplayCondition_far: 9000,
      distanceDisplayBillboard: {
        // When the viewing angle distance exceeds a certain distance (defined by distanceDisplayCondition_far), it is displayed as the style of the icon object
        image: "img/marker/square.png",
        scale: 1
      },

      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        silhouette: true,
        silhouetteColor: "#00ffff",
        silhouetteSize: 3
      }
    },
    attr: { remark: "Example 2" }
  })
  graphicLayer.addGraphic(graphic) // There is another way to write it: graphic.addTo(graphicLayer)

  // Manually start animation on demand
  graphic.on(mars3d.EventType.load, function (event) {
    console.log("Fan model loading completed", event)
    const model = event.model

    // Reference API: http://mars3d.cn/api/cesium/ModelAnimationCollection.html
    model.activeAnimations.addAll({
      multiplier: 0.5, // Play at half-speed
      loop: Cesium.ModelAnimationLoop.REPEAT // Loop the animations
    })

    // let animation = model.activeAnimations.add({
    // index: 0, // first leaf
    //   multiplier: 0.5, // Play at double speed
    //   loop: Cesium.ModelAnimationLoop.REPEAT, // Loop the animation
    // });

    // animation.start.addEventListener(function (model, animation) {
    //   console.log("Animation started: " + animation.name);
    // });
    // animation.update.addEventListener(function (model, animation, time) {
    //   console.log("Animation updated: " + animation.name + ". glTF animation time: " + time);
    // });
    // animation.stop.addEventListener(function (model, animation) {
    //   console.log("Animation stopped: " + animation.name);
    // });
  })
}

function addDemoGraphic3(graphicLayer) {
  // const textureUniformShader = new Cesium.CustomShader({
  //   uniforms: {
  // // The running time of the animation (in seconds)
  //     u_time: {
  //       type: Cesium.UniformType.FLOAT,
  //       value: 1
  //     },
  // // User-defined texture
  //     u_stripes: {
  //       type: Cesium.UniformType.SAMPLER_2D,
  //       value: new Cesium.TextureUniform({
  //         url: "/img/textures/colors.png"
  //       })
  //     }
  //   },
  // //Apply the texture to the model, but move the texture coordinates a bit so it animates.
  //   fragmentShaderText: `
  //     void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
  //     {
  //         vec2 texCoord = fsInput.attributes.texCoord_0 + 1.0 * vec2(u_time, 0.0);
  //         material.diffuse = texture(u_stripes, texCoord).rgb;
  //     }
  //     `
  // })
  // // Listen to postUpdate to demonstrate modifying uniforms variables
  // const startTime = performance.now()
  // setInterval(() => {
  //   const elapsedTimeSeconds = (performance.now() - startTime) / 1000
  //   textureUniformShader.setUniform("u_time", elapsedTimeSeconds)
  // }, 200)

  const graphic = new mars3d.graphic.ModelPrimitive({
    name: "car",
    position: [116.349194, 30.864603, 376.58],
    style: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.5,
      minimumPixelSize: 50,
      silhouette: false,
      // customShader: textureUniformShader, // custom shader

      // The style when highlighting (default is mouse move in, you can also specify type:'click' to click to highlight). After construction, you can also manually call the openHighlight and closeHighlight methods.
      highlight: {
        silhouette: true,
        silhouetteColor: "#ff0000",
        silhouetteSize: 4
      }
    },
    attr: { remark: "Example 3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const propertyFJ = getSampledPositionProperty([
    [116.341348, 30.875522, 500],
    [116.341432, 30.871815, 500],
    [116.347965, 30.866654, 500],
    [116.352154, 30.855531, 500],
    [116.341181, 30.85326, 500],
    [116.334609, 30.856601, 500],
    [116.337695, 30.866505, 500],
    [116.345018, 30.870448, 500],
    [116.345028, 30.870436, 500]
  ])

  // airplane
  const graphicModel = new mars3d.graphic.ModelPrimitive({
    position: propertyFJ,
    style: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 0.1,
      minimumPixelSize: 20
    },
    frameRate: 1,
    attr: { remark: "Example 4" },
    hasEdit: false
  })
  graphicLayer.addGraphic(graphicModel)
}

// Calculate the SampledPositionProperty trajectory of the demonstration
function getSampledPositionProperty(points) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const start = map.clock.currentTime
  const positions = mars3d.LngLatArray.toCartesians(points)
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, i * 20, new Cesium.JulianDate())
    const position = positions[i]
    property.addSample(time, position)
  }
  return property
}

function addDemoGraphic5(graphicLayer) {
  // Custom shader
  const pointCloudWaveShader = new Cesium.CustomShader({
    uniforms: {
      u_time: {
        type: Cesium.UniformType.FLOAT,
        value: 0
      }
    },
    vertexShaderText: `
        void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput)
        {
          // This model's x and y coordinates are in the range [0,1] conveniently doubled as UV coordinates.
          vec2 uv = vsInput.attributes.positionMC.xy;
          // Make the point cloud fluctuate in complex waves that vary in space and time. The amplitude is based on the original shape of the point cloud (it is already a wavy surface). Waves are calculated relative to the center of the model, so the transformation goes from [0,1]->[- 1,1]->[0,1]
          float amplitude = 2.0 * vsInput.attributes.positionMC.z - 1.0;
          float wave = amplitude * sin(2.0 * czm_pi * uv.x - 2.0 * u_time) * sin(u_time);
          vsOutput.positionMC.z = 0.5 + 0.5 * wave;
          // Make the points pulse in and out by changing the size of the points
          vsOutput.pointSize = 10.0 + 5.0 * sin(u_time);
        } `,
    fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
        {
            // Make these points circles instead of squares
            float distance = length(gl_PointCoord - 0.5);
            if (distance > 0.5) {
                discard;
            }
            // Make a sinusoidal palette that moves in the general direction of the wave, but at different speeds. The coefficients are chosen arbitrarily.
            vec2 uv = fsInput.attributes.positionMC.xy;
            material.diffuse = 0.2 * fsInput.attributes.color_0.rgb;
            material.diffuse += vec3(0.2, 0.3, 0.4) + vec3(0.2, 0.3, 0.4) * sin(2.0 * czm_pi * vec3(3.0, 2.0, 1.0) * uv.x - 3.0 * u_time);
        }`
  })
  //Listen to postUpdate to demonstrate modifying uniforms variables
  const startTime = performance.now()
  setInterval(() => {
    const elapsedTimeSeconds = (performance.now() - startTime) / 1000
    pointCloudWaveShader.setUniform("u_time", elapsedTimeSeconds)
  }, 200)

  const graphicModel = new mars3d.graphic.ModelPrimitive({
    position: new mars3d.LngLatPoint(116.35265, 30.860337, 364.3),
    style: {
      url: "//data.mars3d.cn/gltf/sample/PointCloudWave/PointCloudWave.glb",
      scale: 30,
      customShader: pointCloudWaveShader
    },
    attr: { remark: "Example 5" }
  })
  graphicLayer.addGraphic(graphicModel)
}

// Generate demonstration data (test data amount)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // Turn off the event, which affects the loading time when big data addGraphic

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("Generated test grid coordinates", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.ModelPrimitive({
      position,
      style: {
        url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
        heading: 270,
        scale: 10
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // restore event
  return result.points.length
}

// Start drawing
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "modelP",
    style: {
      scale: 10,
      url: "//data.mars3d.cn/gltf/mars/firedrill/xiaofangche.gltf"
      // label: {
      // // When text is not needed, just remove the label configuration.
      // text: "Can support text at the same time",
      //   font_size: 20,
      //   color: "#ffffff",
      //   outline: true,
      //   outlineColor: "#000000",
      //   pixelOffsetY: -20
      // }
    }
  })
}

// Bind the Popup window to the layer
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["type"] = event.graphic.type
    attr["source"] = "I am the Popup bound to the layer"
    attr["Remarks"] = "I support mouse interaction"

    return mars3d.Util.getTemplateHtml({ title: "Vector Layer", template: "all", attr })
  })
}

//Bind right-click menu
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "Start editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "Stop editing object",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "Delete object",
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
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}
