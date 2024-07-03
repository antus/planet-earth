// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object

let tiles3dLayer
let brightnessEffect
let bloomEffect

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.795446, lng: 117.219725, alt: 1816, heading: 15, pitch: -34 }
    // sceneMode: 2
  },
  layers: [
    {
      type: "geojson",
      name: "Road Line",
      url: "//data.mars3d.cn/file/geojson/hefei-road.json",
      symbol: {
        styleOptions: {
          width: 12,
          materialType: "PolylineGlow",
          materialOptions: {
            color: "#FF4500",
            opacity: 0.8,
            glowPower: 0.2
          }
        }
      },
      popup: "{name}",
      zIndex: 20,
      show: true
    },
    {
      type: "geojson",
      name: "River (surface)",
      url: "//data.mars3d.cn/file/geojson/hefei-water.json",
      symbol: {
        type: "waterC",
        styleOptions: {
          normalMap: "img/textures/waterNormals.jpg", // Normal map of water normal disturbance
          frequency: 5000.0, // Number that controls the wave number.
          animationSpeed: 0.05, // Number that controls the animation speed of water.
          amplitude: 9.0, // Number that controls the amplitude of the water wave.
          specularIntensity: 0.8, // Number that controls the intensity of specular reflection.
          baseWaterColor: "#00baff", // The base color of water in the rgba color object. #00ffff,#00baff,#006ab4
          blendColor: "#00baff" // The rgba color object used when blending from water to non-water.
          // clampToGround: true,
        }
      },
      popup: "{name}",
      zIndex: 10,
      show: true
    }
  ]
}

var eventTarget = new mars3d.BaseClass() // Event object, used to throw events into the panel

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map
  map.basemap = 2017 // switch to blue basemap

  // Fixed lighting time
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2022-11-01 12:00:00"))
  // map.clock.shouldAnimate = false

  // Fixed lighting direction
  map.scene.light = new Cesium.DirectionalLight({
    direction: map.scene.camera.direction
  })
  map.camera.percentageChanged = 0.001
  map.on(mars3d.EventType.cameraChanged, function (event) {
    map.scene.light.direction = map.scene.camera.direction
  })

  bloomEffect = new mars3d.effect.BloomEffect({
    enabled: false
  })
  map.addEffect(bloomEffect)

  addbrightnessEffect(1.5)

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei City Building",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    // projectTo2D: true,
    popup: [
      { field: "objectid", name: "number" },
      { field: "name", name: "name" },
      { field: "height", name: "building height", unit: "meters" }
    ]
  })
  map.addLayer(tiles3dLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Turn on brightness
function addbrightnessEffect(brightness) {
  brightnessEffect = new mars3d.effect.BrightnessEffect({
    enabled: false,
    brightness
  })
  map.addEffect(brightnessEffect)
}

function setStyleDef() {
  if (tiles3dLayer) {
    tiles3dLayer.remove()
  }
  // Model
  tiles3dLayer = new mars3d.layer.TilesetLayer({
    type: "3dtiles",
    name: "Hefei City Building",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    popup: [
      { field: "objectid", name: "number" },
      { field: "name", name: "name" },
      { field: "height", name: "building height", unit: "meters" }
    ]
  })
  map.addLayer(tiles3dLayer)
}

// mars3d built-in marsJzwStyle attribute
function setStyle1() {
  tiles3dLayer.customShader = undefined

  tiles3dLayer.marsJzwStyle = true // Turn on building special effects (built-in Shader code)

  // tiles3dLayer.marsJzwStyle = {
  // baseHeight: 0.0, // The base height of the object needs to be modified to a suitable building base height
  // heightRange: 280.0, // Highlight range (baseHeight ~ baseHeight + heightRange)
  // glowRange: 300.0 // The movement range of the halo
  // }
}

//customShader parameter method
function setStyle2() {
  tiles3dLayer.marsJzwStyle = false
  tiles3dLayer.customShader = new Cesium.CustomShader({
    lightingModel: Cesium.LightingModel.UNLIT,
    fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
      {
        vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC,1); // position

        // Note that when writing floating point numbers in the shader, they must have a decimal point, otherwise an error will be reported. For example, 0 needs to be written as 0.0, and 1 needs to be written as 1.0.
        float _baseHeight = 50.0; // The base height of the object needs to be modified to a suitable building base height.
        float _heightRange = 380.0; // Highlight range (_baseHeight ~ _baseHeight + _heightRange)
        float _glowRange = 400.0; // The movement range (height) of the halo

        //Building base color
        float mars_height = position.z - _baseHeight;
        float mars_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
        float mars_a12 = mars_height / _heightRange + sin(mars_a11) * 0.1;

        material.diffuse = vec3(0.0, 0.0, 1.0); // color
        material.diffuse *= vec3(mars_a12);//gradient

        // dynamic halo
        float time = fract(czm_frameNumber / 360.0);
        time = abs(time - 0.5) * 2.0;
        float mars_h = clamp(mars_height / _glowRange, 0.0, 1.0);
        float mars_diff = step(0.005, abs(mars_h - time));
        material.diffuse += material.diffuse * (1.0 - mars_diff);
      } `
  })
}

// customShader parameter mode night scene map
function setStyle3() {
  tiles3dLayer.marsJzwStyle = false
  tiles3dLayer.customShader = new Cesium.CustomShader({
    lightingModel: Cesium.LightingModel.UNLIT,
    varyings: {
      v_mars3d_normalMC: Cesium.VaryingType.VEC3
    },
    uniforms: {
      u_mars3d_texture: {
        value: new Cesium.TextureUniform({
          url: "/img/textures/buildings.png"
        }),
        type: Cesium.UniformType.SAMPLER_2D
      }
    },
    vertexShaderText: /* glsl */ `
    void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput){
        v_mars3d_normalMC = vsInput.attributes.normalMC;
      }`,
    fragmentShaderText: /* glsl If the texture direction is wrong, use the following */ `
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
      vec3 positionMC = fsInput.attributes.positionMC;
      if (dot(vec3(0.0, 0.0, 1.0), v_mars3d_normalMC) > 0.95) {
        //Processing the roof: uniformly process it into dark color.
        material.diffuse = vec3(0.079, 0.107, 0.111);
      } else {
        //Process four sides: paste the same picture
        float mars3d_width = 100.0;
        float mars3d_height = 100.0;
        float mars3d_textureX = 0.0;
        float mars3d_dotXAxis = dot(vec3(0.0, 1.0, 0.0), v_mars3d_normalMC);
        if (mars3d_dotXAxis > 0.52 || mars3d_dotXAxis < -0.52) {
          mars3d_textureX = mod(positionMC.x, mars3d_width) / mars3d_width;
        } else {
          mars3d_textureX = mod(positionMC.y, mars3d_width) / mars3d_width; //positionMC.z
        }
        float mars3d_textureY = mod(positionMC.z, mars3d_height) / mars3d_height; //positionMC.y
        material.diffuse = texture(u_mars3d_texture, vec2(mars3d_textureX, mars3d_textureY)).rgb;
      }
    }`
  })
}

// color change
function changeColor(color) {
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [["true", `color("${color}")`]]
    }
  })
}

// Turn on floodlight
function chkBloom(val) {
  bloomEffect.enabled = val
}

// Turn on lighting
function chkShadows(val) {
  map.viewer.shadows = val
  if (val) {
    setTimeout(function () {
      //Lighting along the direction of the camera
      map.scene.shadowMap._lightCamera = map.scene.camera
    }, 500)
  }
}

//Adjust brightness
function chkBrightness(val) {
  brightnessEffect.enabled = val
}

function alphaChange(value) {
  brightnessEffect.brightness = value
}
