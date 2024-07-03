// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let tiles3dLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.795446, lng: 117.219725, alt: 1816, heading: 15, pitch: -34 }
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

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "Hefei City Building",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    popup: "all"
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

function setStyleDef() {
  tiles3dLayer.customShader = undefined
}

function setStyle1() {
  globalMsg(`The current effect is: the model appears in different colors according to the viewing distance`)

  tiles3dLayer.customShader = new Cesium.CustomShader({
    lightingModel: Cesium.LightingModel.UNLIT,
    fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
      {
        material.diffuse = vec3(0.0, 0.0, 1.0);
        material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4;
      } `
  })
}

function setStyle2() {
  globalMsg(`The current effect is: dynamic gradient + dynamic halo special effects`)

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
        float mars_height = position.z - _baseHeight; //position.y
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

// Night scene texture
function setStyle3() {
  globalMsg(`The current effect is: the special effect of the night scene texture`)

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

//
function setStyle4() {
  globalMsg(`The current effect is: special effects of dynamic color changes`)

  // special effects
  const customShader = new Cesium.CustomShader({
    uniforms: {
      u_build0: {
        type: Cesium.UniformType.SAMPLER_2D,
        value: new Cesium.TextureUniform({
          url: "/img/textures/buildings-blue.png"
        })
      },
      u_build1: {
        type: Cesium.UniformType.SAMPLER_2D,
        value: new Cesium.TextureUniform({
          url: "/img/textures/buildings-colors.png"
        })
      }
    },
    varyings: {
      v_positionLC: Cesium.VaryingType.VEC4,
      v_featureId: Cesium.VaryingType.FLOAT
    },
    vertexShaderText: `
        void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
            v_positionLC = vec4(vsInput.attributes.positionMC.xyz, 1.0);
            v_featureId = v_featureId_0;
        }`,
    fragmentShaderText: `
        vec2 mars_rotate(vec2 uv, vec2 center, float rotation) {
            float dx = uv.x - center.x;
            float dy = uv.y - center.y;
            float ex = dx * cos(rotation) - dy * sin(rotation);
            float ey = dx * sin(rotation) + dy * cos(rotation);
            return vec2(ex + center.x,  ey + center.y);
        }
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
            vec3 positionEC = fsInput.attributes.positionEC;
            vec3 normalEC = fsInput.attributes.normalEC;
            vec2 uv = fsInput.attributes.texCoord_0;
            uv = mars_rotate(uv,vec2(0.5,0.5), 0.5);
            vec3 positionMC = fsInput.attributes.positionMC;
            float times = czm_frameNumber / 60.0;
            vec4 textureColor = texture(u_build0,vec2(fract(float(uv.s) - times), uv.t));
            vec4 textureColor2 = texture(u_build0,vec2(fract(uv.s),float(uv.t) - times));
            vec4 textureColor3 = texture(u_build1,vec2(fract(uv.s),float(uv.t) - times));
            // material
            material.diffuse += textureColor.rgb + textureColor2.rgb + textureColor3.rgb;
            material.alpha += textureColor.a + textureColor3.a;
        }  `
  })

  tiles3dLayer.customShader = customShader
}
