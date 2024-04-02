// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tiles3dLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.2322, lng: 121.44363, alt: 1989, heading: 87, pitch: -25 }
  },
  control: {
    baseLayerPicker: true,
    terrainProviderViewModels: mars3d.LayerUtil.getTerrainProviderViewModels()
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
  map.basemap = 2017 // switch to blue basemap

  globalNotify(
    "Known Issue Tips",
    `For example, if the layer is not displayed or the service URL access times out, it is because the national surveying and mapping authorities currently block foreign map services that have not been reviewed and approved.
     You can use it if you need to circumvent the firewall or refer to the sample code to replace the local service address. `
  )

  tiles3dLayer = new mars3d.layer.OsmBuildingsLayer({
    highlight: {
      type: "click",
      color: "#00FF00"
    },
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  setStyle1()
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function setStyle1() {
  tiles3dLayer.customShader = undefined
  tiles3dLayer.style = undefined
}

function setStyle2() {
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
  // tiles3dLayer.reload()
}

function setStyle3() {
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
    fragmentShaderText: /* glsl */ `
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
          mars3d_textureX = mod(positionMC.y, mars3d_width) / mars3d_width;
        }
        float mars3d_textureY = mod(positionMC.z, mars3d_height) / mars3d_height;
        material.diffuse = texture(u_mars3d_texture, vec2(mars3d_textureX, mars3d_textureY)).rgb;
      }
    }`
  })
  // tiles3dLayer.reload()
}

function selectColor(col) {
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [["true", `color("${col}")`]]
    }
  })
}

function setStyle4() {
  tiles3dLayer.customShader = new Cesium.CustomShader({
    uniforms: {
      u_envTexture: {
        value: new Cesium.TextureUniform({
          url: "/img/textures/sky.jpg"
        }),
        type: Cesium.UniformType.SAMPLER_2D
      },
      u_envTexture2: {
        value: new Cesium.TextureUniform({
          url: "/img/textures/buildings-kj.jpg"
        }),
        type: Cesium.UniformType.SAMPLER_2D
      },
      u_isDark: {
        value: true,
        type: Cesium.UniformType.BOOL
      }
    },
    mode: Cesium.CustomShaderMode.REPLACE_MATERIAL,
    lightingModel: Cesium.LightingModel.UNLIT,
    fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
            vec3 positionMC = fsInput.attributes.positionMC;
            vec3 positionEC = fsInput.attributes.positionEC;
            vec3 normalEC = fsInput.attributes.normalEC;
            vec3 posToCamera = normalize(-positionEC);
            vec3 coord = normalize(vec3(czm_inverseViewRotation * reflect(posToCamera, normalEC)));
            float ambientCoefficient = 0.3;
            float diffuseCoefficient = max(0.0, dot(normalEC, czm_sunDirectionEC) * 1.0);
            if(u_isDark){
                // dark
                vec4 darkRefColor = texture(u_envTexture2, vec2(coord.x, (coord.z - coord.y) / 2.0));
                material.diffuse = mix(mix(vec3(0.3), vec3(0.1,0.2,0.4),clamp(positionMC.z / 200., 0.0, 1.0)) , darkRefColor.rgb ,0.3);
                material.diffuse *= 0.2;
                // Note that floating point numbers written in the shader must have a decimal point, otherwise an error will be reported. For example, 0 needs to be written as 0.0 and 1 needs to be written as 1.0.
                float _baseHeight = 0.0; // The base height of the object needs to be modified to a suitable building base height.
                float _heightRange = 20.0; // Highlight range (_baseHeight ~ _baseHeight + _heightRange)
                float _glowRange = 300.0; // The movement range (height) of the halo
                //Building base color
                float czm_height = positionMC.z - _baseHeight;
                float czm_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                float czm_a12 = czm_height / _heightRange + sin(czm_a11) * 0.1;

                float times = czm_frameNumber / 60.0;
                material.diffuse *= vec3(czm_a12);//gradient
                // dynamic halo
                float time = fract(czm_frameNumber / 360.0);
                time = abs(time - 0.5) * 2.0;
                float czm_h = clamp(czm_height / _glowRange, 0.0, 1.0);
                float czm_diff = step(0.005, abs(czm_h - time));
                material.diffuse += material.diffuse * (1.0 - czm_diff);
            } else {
                // day
                vec4 dayRefColor = texture(u_envTexture, vec2(coord.x, (coord.z - coord.y) / 3.0));
                material.diffuse = mix(mix(vec3(0.000), vec3(0.5),clamp(positionMC.z / 300., 0.0, 1.0)) , dayRefColor.rgb ,0.3);
                material.diffuse *= min(diffuseCoefficient + ambientCoefficient, 1.0);
            }
            material.alpha = 1.0;
        } `
  })
}
