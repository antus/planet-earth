// API documentation corresponding to the material: https://mars3d.cn/api/MaterialType.html
const materialConfig = {
  Color: [{ name: "color", label: "color", type: "color", defval: "#3388ff" }],

  PolylineDash: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "gapColor", label: "gap color", type: "color", defval: "rgba(255,255,255,0)" },
    { name: "dashLength", label: "Length between dashes", type: "number", step: 1, defval: 16.0 }
  ],
  PolylineOutline: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "outlineColor", label: "Color", type: "color", defval: "rgba(255,255,255,0)" },
    { name: "outlineWidth", label: "lining width", type: "number", min: 0, max: 20, step: 1, defval: 1.0 }
  ],
  PolylineArrow: [{ name: "color", label: "color", type: "color", defval: "#3388ff" }],
  PolylineGlow: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "glowPower", label: "Highlight intensity", type: "number", min: 0, max: 1, step: 0.1, defval: 0.25 },
    { name: "taperPower", label: "Gradient Effect", type: "number", min: 0, max: 20, step: 0.1, defval: 1.0 }
  ],
  LineFlow: [
    { name: "image", label: "image", type: "label", defval: "img/textures/fence.png" },
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 },

    {
      name: "repeat_x",
      label: "X number of repeats",
      type: "number",
      step: 1,
      defval: 1,
      show(style, allStyle, graphicType) {
        return !style.axisY
      }
    },
    {
      name: "repeat_y",
      label: "Y repeat quantity",
      type: "number",
      step: 1,
      defval: 1,
      show(style, allStyle, graphicType) {
        return style.axisY
      }
    },

    { name: "axisY", label: "Y-axis upward", type: "radio", defval: false }
  ],
  LineFlowColor: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "alpha", label: "transparency", type: "slider", min: 0, max: 1, step: 0.1, defval: 1 },
    { name: "percent", label: "proportion", type: "number", min: 0, max: 1, step: 0.01, defval: 0.04 },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 },
    { name: "startTime", label: "start time", type: "number", step: 1, defval: 0 }
  ],
  ODLine: [
    { name: "color", label: "color", type: "color", defval: "#ff0000" },
    { name: "bgColor", label: "Background Color", type: "color", defval: "#000000" },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 },
    { name: "startTime", label: "start time", type: "number", step: 1, defval: 0 },
    {
      name: "bidirectional",
      label: "Run form",
      type: "combobox",
      defval: "0",
      data: [
        { label: "Forward motion", type: "number", value: "0" },
        { label: "Reverse motion", type: "number", value: "1" },
        { label: "two-way movement", type: "number", value: "2" }
      ]
    }
  ],
  LineFlicker: [
    { name: "color", label: "flood color", type: "color", defval: "#3388ff" },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 }
  ],
  LineTrail: [
    { name: "color", label: "track color", type: "color", defval: "#3388ff" },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 }
  ],
  LineBloom: [
    { name: "color", label: "flood color", type: "color", defval: "#3388ff" },
    { name: "glow", label: "Flood intensity", type: "number", step: 1, defval: 1 },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 }
  ],

  WallScroll: [
    { name: "image", label: "image", type: "label", defval: "img/textures/fence.png" },
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "count", label: "quantity", type: "number", min: 0, step: 1, defval: 1 },
    { name: "speed", label: "speed", type: "number", min: 0, step: 1, defval: 10 },
    { name: "reverse", label: "direction up", type: "radio", defval: false },
    { name: "bloom", label: "whether to bloom", type: "radio", defval: false },
    { name: "axisY", label: "Y-axis upward", type: "radio", defval: false }
  ],

  Image: [
    { name: "image", label: "image", type: "label", defval: "" },
    { name: "transparent", label: "whether it is transparent", type: "radio", defval: false },
    {
      name: "opacity",
      label: "transparency",
      type: "slider",
      min: 0,
      max: 1,
      step: 0.1,
      defval: 1,
      show(style, allStyle, graphicType) {
        return style.transparent === true
      }
    },
    { name: "repeat_x", label: "X number of repetitions", type: "number", step: 1, defval: 1 },
    { name: "repeat_y", label: "Number of repetitions of Y", type: "number", step: 1, defval: 1 }
  ],
  Text: [
    {
      name: "text",
      label: "text content",
      type: "textarea",
      defval: "text"
    },
    {
      name: "font_family",
      label: "Font",
      type: "combobox",
      defval: "楷体",
      data: [
        { label: "Microsoft Yahei", value: "Microsoft Yahei" },
        { label: "宋体", value: "宋体" },
        { label: "楷体", value: "楷体" },
        { label: "official script", value: "official script" },
        { label: "黑体", value: "黑体" }
      ]
    },
    { name: "font_size", label: "font size", type: "number", step: 1, defval: 100 },
    {
      name: "font_weight",
      label: "Whether to bold",
      type: "combobox",
      defval: "normal",
      data: [
        { label: "is", value: "bold" },
        { label: "No", value: "normal" }
      ]
    },
    {
      name: "font_style",
      label: "Whether italics",
      type: "combobox",
      defval: "normal",
      data: [
        { label: "Yes", value: "italic" },
        { label: "No", value: "normal" }
      ]
    },
    { name: "color", label: "text color", type: "color", defval: "#FFFF00" },

    { name: "stroke", label: "Whether to stroke", type: "radio", defval: false },
    {
      name: "strokeColor",
      label: "stroke color",
      type: "color",
      defval: "#ffffff",
      show(style, allStyle, graphicType) {
        return style.stroke
      }
    },
    {
      name: "strokeWidth",
      label: "stroke width",
      type: "number",
      min: 1,
      max: 5,
      step: 1,
      defval: 1,
      show(style, allStyle, graphicType) {
        return style.stroke
      }
    },

    {
      name: "background",
      label: "Background or not",
      type: "radio",
      defval: false
    },
    {
      name: "backgroundColor",
      label: "background color",
      type: "color",
      defval: "#000000",
      show(style, allStyle, graphicType) {
        return style.background
      }
    },
    {
      name: "padding",
      label: "background padding",
      type: "number",
      step: 1,
      defval: 5,
      show(style, allStyle, graphicType) {
        return style.background
      }
    }
  ],
  Grid: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "cellAlpha", label: "Fill transparency", type: "slider", min: 0, max: 1, step: 0.1, defval: 0.1 },
    { name: "lineCount", label: "number of grids", type: "number", step: 1, defval: 10 },
    { name: "lineThickness", label: "grid width", type: "number", step: 1, defval: 2 }
  ],
  Checkerboard: [
    { name: "evenColor", label: "main color", type: "color", defval: "#000000" },
    { name: "oddColor", label: "Color", type: "color", defval: "#ffffff" },
    { name: "repeat_x", label: "Horizontal quantity", type: "number", step: 1, defval: 10 },
    { name: "repeat_y", label: "vertical quantity", type: "number", step: 1, defval: 10 }
  ],
  Stripe: [
    { name: "evenColor", label: "main color", type: "color", defval: "#000000" },
    { name: "oddColor", label: "Color", type: "color", defval: "#ffffff" },
    { name: "repeat", label: "quantity", type: "number", step: 1, defval: 10 },
    { name: "orientation", label: "orientation", type: "radio", defval: false },
    { name: "offset", label: "starting position", type: "number", step: 1, defval: 0 }
  ],
  PolyGradient: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "alphaPower", label: "Transparency coefficient", type: "number", min: 0, max: 50, step: 0.1, defval: 1.5 },
    { name: "diffusePower", label: "diffusion coefficient", type: "number", min: 0, max: 50, step: 0.1, defval: 1.6 }
  ],
  PolyAsphalt: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "size", label: "Transparency coefficient", type: "number", min: 0, max: 10, step: 0.01, defval: 0.02 },
    { name: "frequency", label: "diffusion coefficient", type: "number", min: 0, max: 10, step: 0.01, defval: 0.2 }
  ],
  PolyBlob: [
    { name: "evenColor", label: "main color", type: "color", defval: "#000000" },
    { name: "oddColor", label: "Color", type: "color", defval: "#ffffff" },
    { name: "frequency", label: "diffusion coefficient", type: "number", min: 0, max: 50, step: 0.1, defval: 10.0 }
  ],
  PolyWood: [
    { name: "evenColor", label: "main color", type: "color", defval: "#000000" },
    { name: "oddColor", label: "Color", type: "color", defval: "#ffffff" },
    { name: "frequency", label: "diffusion coefficient", type: "number", min: 0, max: 50, step: 0.1, defval: 10.0 },
    { name: "noiseScale", label: "noise scale", type: "number", min: 0, max: 50, step: 0.01, defval: 0.7 },
    { name: "grainFrequency", label: "Grain Frequency", type: "number", min: 0, max: 100, step: 0.1, defval: 27 }
  ],
  Water: [
    { name: "baseWaterColor", label: "base color", type: "color", defval: "#123e59" },
    { name: "blendColor", label: "BlendColor", type: "color", defval: "#123e59" },
    { name: "normalMap", label: "Reflection Picture", type: "label", defval: "img/textures/waterNormals.jpg" },
    { name: "frequency", label: "wavenumber", type: "number", min: 1, max: 100000, step: 1, defval: 9000 },
    { name: "amplitude", label: "water wave amplitude", type: "number", min: 0, max: 100, step: 1, defval: 5.0 },
    { name: "animationSpeed", label: "animation speed", type: "slider", min: 0, max: 1, step: 0.01, defval: 0.03 },
    { name: "specularIntensity", label: "reflection intensity", type: "slider", min: 0, max: 1, step: 0.1, defval: 0.5 }
  ],
  WaterLight: [
    { name: "specularMap", label: "reflection picture", type: "label", defval: "img/textures/poly-stone.jpg" },
    { name: "alpha", label: "transparency", type: "slider", min: 0, max: 1, step: 0.1, defval: 0.2 }
  ],

  RectSlide: [
    { name: "image", label: "image", type: "label", defval: "" },
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "speed", label: "Number of refresh seconds", type: "number", step: 1, defval: 60 },
    { name: "pure", label: "Whether it is pure color", type: "radio", defval: false }
  ],

  ScanLine: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "speed", label: "speed", type: "number", min: 0, step: 1, defval: 10 }
  ],
  CircleScan: [
    { name: "image", label: "image", type: "label", defval: "img/textures/circle-scan.png" },
    { name: "color", label: "color", type: "color", defval: "#3388ff" }
  ],
  CircleWave: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "count", label: "quantity", type: "number", step: 1, defval: 1 },
    { name: "gradient", label: "Inter-circle coefficient", type: "slider", min: 0, max: 1, step: 0.1, defval: 0.1 },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 }
  ],
  RadarLine: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "speed", label: "speed", type: "number", min: 0, step: 1, defval: 10 }
  ],

  CylinderWave: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "repeat", label: "number of circles", type: "number", step: 1, defval: 30 },
    { name: "thickness", label: "circle width ratio", type: "slider", min: 0.01, max: 0.99, step: 0.01, defval: 0.3 },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 }
  ],

  EllipsoidWave: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 }
  ],
  EllipsoidElectric: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "speed", label: "speed", type: "number", step: 1, defval: 10 }
  ],
  LineCross: [
    { name: "color", label: "color", type: "color", defval: "#3388ff" },
    { name: "dashLength", label: "length", type: "number", step: 1, defval: 64 },
    { name: "maskLength", label: "interval", type: "number", step: 1, defval: 9 },
    { name: "centerPower", label: "center percentage", type: "number", step: 0.1, defval: 0.1 },
    { name: "dashPower", label: "dash percentage", type: "number", step: 0.1, defval: 0.1 }
  ]
}

// When some vectors correspond to the same configuration as other basic types, copy the configuration
materialConfig.Image2 = materialConfig.Image
materialConfig.PolyFacet = materialConfig.PolyBlob
materialConfig.PolyGrass = materialConfig.PolyBlob
materialConfig.RadarWave = materialConfig.RadarLine

window.materialConfig = materialConfig
// export default materialConfig
