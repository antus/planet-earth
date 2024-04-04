const styleConfig = {
  // dotted
  label: {
    name: "text",
    primitive: true,
    style: [
      { name: "text", label: "content", type: "textarea", defval: "" },

      {
        name: "font_family",
        label: "Font",
        type: "combobox",
        defval: "Microsoft Yahei",
        data: [
          { label: "Microsoft Yahei", value: "Microsoft Yahei" },
          { label: "宋体", value: "宋体" },
          { label: "楷体", value: "楷体" },
          { label: "official script", value: "official script" },
          { label: "黑体", value: "黑体" }
        ]
      },
      { name: "font_size", label: "font size", type: "number", min: 3, step: 1, defval: 30.0 },
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

      { name: "color", label: "color", type: "color", defval: "#ffffff" },
      { name: "outline", label: "Color lining or not", type: "radio", defval: false },
      {
        name: "outlineColor",
        label: "lining color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },
      {
        name: "outlineWidth",
        label: "Color width",
        type: "number",
        min: 1,
        max: 5,
        step: 1,
        defval: 3.0,
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },

      {
        name: "background",
        label: "whether background",
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
        name: "backgroundPadding",
        label: "background padding",
        type: "number",
        step: 1,
        defval: 5,
        show(style, allStyle, graphicType) {
          return style.background
        }
      },

      { name: "pixelOffsetX", label: "Lateral offset pixel", type: "number", step: 1, defval: 0.0 },
      { name: "pixelOffsetY", label: "Vertical offset pixel", type: "number", step: 1, defval: 0.0 },

      {
        name: "scaleByDistance",
        label: "Whether to scale according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "scaleByDistance_far",
        label: "upper limit",
        type: "number",
        step: 1,
        defval: 1000000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_farValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 0.1,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_near",
        label: "lower limit",
        type: "number",
        step: 1,
        defval: 1000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_nearValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 1.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.diffHeight || style.diffHeight !== 0
        }
      },
      // {
      //   name: "heightReference",
      // label: "Floor-mounted method",
      //   type: "combobox",
      //   valType: "number",
      //   defval: 0,
      //   data: [
      // { label: "Not attached to the ground", value: 0 },
      // { label: "Attach terrain and model at the same time", value: 1 },
      // { label: "Top terrain only", value: 3 },
      // { label: "Only paste the model", value: 5 }
      //   ],
      //   show(style, allStyle, graphicType) {
      //     return !style.diffHeight || style.diffHeight !== 0
      //   }
      // },

      { name: "visibleDepth", label: "Whether it is blocked", type: "radio", defval: true },
      {
        name: "addHeight",
        label: "offset height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return graphicType !== "point" && graphicType !== "billboard" && graphicType !== "label"
        }
      }
    ]
  },
  canvasLabel: {
    name: "Canvas text",
    style: [
      { name: "text", label: "content", type: "textarea", defval: "" },

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
      { name: "font_size", label: "font size", type: "number", min: 3, step: 1, defval: 30.0 },
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

      { name: "color", label: "color", type: "color", defval: "#ffffff" },
      { name: "stroke", label: "Color lining or not", type: "radio", defval: false },
      {
        name: "strokeColor",
        label: "lining color",
        type: "color",
        defval: "#000000",
        show(style, allStyle, graphicType) {
          return style.stroke
        }
      },
      {
        name: "strokeWidth",
        label: "Color width",
        type: "number",
        min: 1,
        max: 5,
        step: 1,
        defval: 3.0,
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
        name: "backgroundPadding",
        label: "background padding",
        type: "number",
        step: 1,
        defval: 5,
        show(style, allStyle, graphicType) {
          return style.background
        }
      },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 1,
        max: 10,
        step: 1,
        defval: 4.0,
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },

      { name: "pixelOffsetX", label: "Lateral offset pixel", type: "number", step: 1, defval: 0.0 },
      { name: "pixelOffsetY", label: "Vertical offset pixel", type: "number", step: 1, defval: 0.0 },

      {
        name: "scaleByDistance",
        label: "Whether to scale according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "scaleByDistance_far",
        label: "upper limit",
        type: "number",
        step: 1,
        defval: 1000000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_farValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 0.1,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_near",
        label: "lower limit",
        type: "number",
        step: 1,
        defval: 1000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_nearValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 1.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.diffHeight || style.diffHeight !== 0
        }
      },
      { name: "visibleDepth", label: "Whether it is blocked", type: "radio", defval: true }
    ]
  },
  point: {
    name: "Point mark",
    primitive: true,
    style: [
      { name: "pixelSize", label: "pixel size", type: "number", step: 1, defval: 10.0 },
      { name: "color", label: "color", type: "color", defval: "#3388ff" },

      { name: "outline", label: "Border or not", type: "radio", defval: true },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 0,
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },

      {
        name: "scaleByDistance",
        label: "Whether to scale according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "scaleByDistance_far",
        label: "upper limit",
        type: "number",
        step: 1,
        defval: 1000000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_farValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 0.1,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_near",
        label: "lower limit",
        type: "number",
        step: 1,
        defval: 1000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_nearValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 1.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.diffHeight || style.diffHeight !== 0
        }
      },
      { name: "visibleDepth", label: "Whether it is blocked", type: "radio", defval: true }
    ]
  },
  billboard: {
    name: "icon point mark",
    primitive: true,
    extends: ["divBillboard", "canvasBillboard"],
    style: [
      { name: "opacity", label: "transparency", type: "slider", defval: 1.0, min: 0, max: 1, step: 0.01 },
      { name: "scale", label: "size ratio", type: "number", step: 1, defval: 1.0 },
      { name: "rotationDegree", label: "rotation angle", type: "number", step: 1, defval: 0.0 },

      {
        name: "horizontalOrigin",
        label: "horizontal alignment",
        type: "combobox",
        valType: "number",
        defval: 0,
        data: [
          { label: "left", value: -1 },
          { label: "centered", value: 0 },
          { label: "right", value: 1 }
        ]
      },
      {
        name: "verticalOrigin",
        label: "vertical alignment",
        type: "combobox",
        valType: "number",
        defval: 1,
        data: [
          { label: "Top", value: -1 },
          { label: "centered", value: 0 },
          { label: "bottom", value: 1 }
        ]
      },

      {
        name: "scaleByDistance",
        label: "Whether to scale according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "scaleByDistance_far",
        label: "upper limit",
        type: "number",
        step: 1,
        defval: 1000000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_farValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 0.1,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_near",
        label: "lower limit",
        type: "number",
        step: 1,
        defval: 1000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_nearValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 1.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.diffHeight || style.diffHeight !== 0
        }
      },
      { name: "visibleDepth", label: "Whether it is blocked", type: "radio", defval: true },

      { name: "image", label: "icon", type: "label", defval: "" }
    ]
  },
  div: {
    name: "DIV point mark",
    extends: ["divBoderLabel", "divLightPoint", "divUpLabel", "popup", "tooltip", "divIndicator"],
    style: [
      {
        name: "color",
        label: "color",
        type: "color",
        defval: "#00ffff",
        show(style, allStyle, graphicType) {
          return graphicType === "divLightPoint" || graphicType === "divBoderLabel" || graphicType === "divUpLabel"
        }
      },
      {
        name: "boderColor",
        label: "border color",
        type: "color",
        defval: "#00ffff",
        show(style, allStyle, graphicType) {
          return graphicType === "divBoderLabel"
        }
      },
      {
        name: "size",
        label: "size",
        type: "number",
        step: 1,
        defval: 10,
        show(style, allStyle, graphicType) {
          return graphicType === "divLightPoint"
        }
      },

      {
        name: "horizontalOrigin",
        label: "horizontal positioning",
        type: "combobox",
        valType: "number",
        defval: 0,
        data: [
          { label: "left", value: 1 },
          { label: "centered", value: 0 },
          { label: "right", value: -1 }
        ]
      },
      {
        name: "verticalOrigin",
        label: "vertical positioning",
        type: "combobox",
        valType: "number",
        defval: 0,
        data: [
          { label: "Top", value: -1 },
          { label: "centered", value: 0 },
          { label: "bottom", value: 1 }
        ]
      },

      {
        name: "scaleByDistance",
        label: "Whether to scale according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "scaleByDistance_far",
        label: "upper limit",
        type: "number",
        step: 1,
        defval: 1000000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_farValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 0.1,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_near",
        label: "lower limit",
        type: "number",
        step: 1,
        defval: 1000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_nearValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 1.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.diffHeight || style.diffHeight !== 0
        }
      },
      { name: "testPoint", label: "Whether to display test points", type: "radio", defval: false },
      { name: "html", label: "Html text", type: "label", defval: "" }
    ]
  },
  divPlane: {
    name: "DIV three-dimensional plane",
    style: [
      { name: "scale", label: "scale", type: "number", step: 1, defval: 1.0 },
      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 90.0 },

      {
        name: "horizontalOrigin",
        label: "horizontal positioning",
        type: "combobox",
        valType: "number",
        defval: 0,
        data: [
          { label: "left", value: 1 },
          { label: "centered", value: 0 },
          { label: "right", value: -1 }
        ]
      },
      {
        name: "verticalOrigin",
        label: "vertical positioning",
        type: "combobox",
        valType: "number",
        defval: 0,
        data: [
          { label: "Top", value: -1 },
          { label: "centered", value: 0 },
          { label: "bottom", value: 1 }
        ]
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.diffHeight || style.diffHeight !== 0
        }
      },

      { name: "testPoint", label: "Whether to display test points", type: "radio", defval: false },
      { name: "html", label: "Html text", type: "label", defval: "" }
    ]
  },

  fontBillboard: {
    name: "Font point mark",
    style: [
      { name: "iconClass", label: "Class style", type: "label", defval: "fa fa-automobile" },
      { name: "iconSize", label: "icon size", type: "number", step: 1, defval: 50 },

      { name: "color", label: "color", type: "color", defval: "#00ffff" },

      {
        name: "horizontalOrigin",
        label: "horizontal alignment",
        type: "combobox",
        valType: "number",
        defval: 0,
        data: [
          { label: "left", value: 1 },
          { label: "centered", value: 0 },
          { label: "right", value: -1 }
        ]
      },
      {
        name: "verticalOrigin",
        label: "vertical alignment",
        type: "combobox",
        valType: "number",
        defval: 1,
        data: [
          { label: "Top", value: -1 },
          { label: "centered", value: 0 },
          { label: "bottom", value: 1 }
        ]
      },

      { name: "rotationDegree", label: "rotation angle", type: "number", step: 1, defval: 0.0 },

      {
        name: "scaleByDistance",
        label: "Whether to scale according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "scaleByDistance_far",
        label: "upper limit",
        type: "number",
        step: 1,
        defval: 1000000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_farValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 0.1,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_near",
        label: "lower limit",
        type: "number",
        step: 1,
        defval: 1000.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },
      {
        name: "scaleByDistance_nearValue",
        label: "proportion value",
        type: "number",
        step: 1,
        defval: 1.0,
        show(style, allStyle, graphicType) {
          return style.scaleByDistance
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.diffHeight || style.diffHeight !== 0
        }
      },
      { name: "visibleDepth", label: "Whether it is blocked", type: "radio", defval: true }
    ]
  },
  model: {
    name: "gltf model",
    primitive: true,
    style: [
      { name: "url", label: "path", type: "label", defval: "" },
      { name: "scale", label: "scale", type: "number", step: 1, defval: 1.0 },
      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      { name: "minimumPixelSize", label: "minimum pixel size", type: "number", step: 1, defval: 0.0 },

      {
        name: "opacity",
        label: "transparency",
        type: "slider",
        defval: 1.0,
        min: 0,
        max: 1,
        step: 0.01
      },

      {
        name: "silhouette",
        label: "Whether it is outline",
        type: "radio",
        defval: false
      },
      {
        name: "silhouetteColor",
        label: "outline color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.silhouette
        }
      },
      {
        name: "silhouetteSize",
        label: "outline width",
        type: "number",
        step: 1,
        defval: 2.0,
        show(style, allStyle, graphicType) {
          return style.silhouette
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      { name: "runAnimations", label: "Whether to animate", type: "radio", defval: true },

      { name: "hasShadows", label: "Whether there are shadows", type: "radio", defval: true },
      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.diffHeight || style.diffHeight !== 0
        }
      }
    ]
  },
  circle: {
    name: "circle",
    primitive: true,
    style: [
      { name: "radius", label: "radius", type: "number", step: 1, defval: 0.0 },
      {
        name: "height",
        label: "height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "diffHeight",
        label: "stereo height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },

      {
        name: "fill",
        label: "Whether to fill",
        type: "radio",
        defval: true,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Grid", value: "Grid" },
          { label: "Stripe", value: "Stripe" },
          { label: "Checkerboard", value: "Checkerboard" },

          { label: "Zoom Diffusion Line", value: "ScanLine" },
          { label: "Radius Scan", value: "CircleScan" },
          { label: "Ripple Diffusion", value: "CircleWave" },
          { label: "Radar Line", value: "RadarLine" },
          { label: "Wave radar scan", value: "RadarWave" }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },
      {
        name: "stRotationDegree",
        label: "Fill direction",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0,
        show: (style) => {
          return style.fill !== false && style.materialType !== "Color"
        }
      },
      {
        name: "rotationDegree",
        label: "rotation angle",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.fill !== false
        }
      },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1.0,
        show(style, allStyle, graphicType) {
          return style.outline && !style.outlineStyle
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline && (style.diffHeight || !style.outlineStyle)
        }
      },
      {
        name: "outlineStyle",
        next: "width",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1.0,
        contant: "outlineWidth",
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },
      {
        name: "outlineStyle",
        next: "materialType",
        label: "border material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid color", value: "Color", contant: "outlineColor", defval: "#fff" },
          { label: "Cross Interval", value: "LineCross" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Color line", value: "PolylineOutline" },
          { label: "Glow", value: "PolylineGlow" },
          { label: "LineBloom", value: "LineBloom" },
          { label: "Flow Color", value: "LineFlowColor" },

          { label: "Flow line", value: "LineFlow", defval: { image: "img/textures/fence-line.png", repeat_x: 10 } },
          { label: "Flow fence", value: "LineFlow-1", defval: { image: "img/textures/fence.png", repeat_x: 10 } }
        ],
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false
        // show(style, allStyle, graphicType) {
        // return false // Face cannot be switched
        // }
      },
      {
        name: "zIndex",
        label: "hierarchical order",
        type: "number",
        min: 0,
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.clampToGround
        }
      }
    ]
  },
  ellipse: {
    name: "ellipse",
    style: [
      { name: "semiMinorAxis", label: "short radius", type: "number", step: 1, defval: 0.0 },
      { name: "semiMajorAxis", label: "long radius", type: "number", step: 1, defval: 0.0 },
      {
        name: "diffHeight",
        label: "stereo height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },

      {
        name: "fill",
        label: "Whether to fill",
        type: "radio",
        defval: true,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Grid", value: "Grid" },
          { label: "Stripe", value: "Stripe" },
          { label: "Checkerboard", value: "Checkerboard" },

          { label: "Zoom Diffusion Line", value: "ScanLine" },
          { label: "Radius Scan", value: "CircleScan" },
          { label: "Ripple Diffusion", value: "CircleWave" },
          { label: "Radar Line", value: "RadarLine" },
          { label: "Wave radar scan", value: "RadarWave" }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },
      {
        name: "stRotationDegree",
        label: "Fill direction",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0,
        show: (style) => {
          return style.fill !== false && style.materialType !== "Color"
        }
      },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1,
        show(style, allStyle, graphicType) {
          return style.outline && !style.outlineStyle
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline && (style.diffHeight || !style.outlineStyle)
        }
      },
      {
        name: "outlineStyle",
        next: "width",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1.0,
        contant: "outlineWidth",
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },
      {
        name: "outlineStyle",
        next: "materialType",
        label: "border material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid color", value: "Color", contant: "outlineColor", defval: "#fff" },
          { label: "Cross Interval", value: "LineCross" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Color line", value: "PolylineOutline" },
          { label: "Glow", value: "PolylineGlow" },
          { label: "LineBloom", value: "LineBloom" },
          { label: "Flow Color", value: "LineFlowColor" },

          { label: "Flow line", value: "LineFlow", defval: { image: "img/textures/fence-line.png", repeat_x: 10 } },
          { label: "Flow fence", value: "LineFlow-1", defval: { image: "img/textures/fence.png", repeat_x: 10 } }
        ],
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },

      { name: "rotationDegree", label: "rotation angle", type: "number", step: 1, defval: 0.0 },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return false // Face cannot be switched
        }
      },
      {
        name: "zIndex",
        label: "hierarchical order",
        type: "number",
        min: 0,
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.clampToGround
        }
      }
    ]
  },
  cylinder: {
    name: "cone",
    primitive: true,
    style: [
      { name: "topRadius", label: "top radius", type: "number", step: 1, defval: 0.0 },
      { name: "bottomRadius", label: "bottom radius", type: "number", step: 1, defval: 100.0 },
      { name: "length", label: "cone height", type: "number", step: 1, defval: 100.0 },

      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Ripple Diffusion", value: "CircleWave" },
          { label: "Stripe Diffusion", value: "CylinderWave" }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },
      { name: "slices", label: "number of edges", type: "number", step: 1, defval: 128 },
      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      }
    ]
  },
  frustum: {
    name: "Four-sided pyramid",
    style: [
      { name: "color", label: "color", type: "color", defval: "rgba(0,255,0,0.4)" },
      { name: "length", label: "length", type: "number", min: 1.0, max: 999999999.0, step: 1.0, defval: 1.0 },
      { name: "angle", label: "angle 1", type: "slider", min: 0.1, max: 89.0, step: 0.01, defval: 1.0 },
      { name: "angle2", label: "angle2", type: "slider", min: 0.1, max: 89.0, step: 0.01, defval: 1.0 },

      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline
        }
      }
    ]
  },
  ellipsoid: {
    name: "sphere",
    primitive: true,
    style: [
      { name: "radii_x", label: "X radius", type: "number", step: 1, defval: 100.0 },
      { name: "radii_y", label: "Y radius", type: "number", step: 1, defval: 100.0 },
      { name: "radii_z", label: "Z radius", type: "number", step: 1, defval: 100.0 },

      { name: "innerRadii_x", label: "inner X radius", type: "number", step: 1, defval: 0.0 },
      { name: "innerRadii_y", label: "inner Y radius", type: "number", step: 1, defval: 0.0 },
      { name: "innerRadii_z", label: "inner Z radius", type: "number", step: 1, defval: 0.0 },

      { name: "minimumClockDegree", label: "minimum clock angle", type: "number", defval: 0.0 },
      { name: "maximumClockDegree", label: "Maximum clock angle", type: "number", defval: 360.0 },
      { name: "minimumConeDegree", label: "minimum cone angle", type: "number", defval: 0.0 },
      { name: "maximumConeDegree", label: "Maximum cone angle", type: "number", defval: 180.0 },

      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      {
        name: "fill",
        label: "Whether to fill",
        type: "radio",
        defval: true,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Grid", value: "Grid" },
          { label: "Stripe", value: "Stripe" },
          { label: "Ripple", value: "EllipsoidWave" },
          { label: "Electric Arc", value: "EllipsoidElectric" }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1,
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      }
    ]
  },
  plane: {
    name: "Plane",
    primitive: true,
    style: [
      { name: "dimensions_x", label: "length", type: "number", step: 1, defval: 100.0 },
      { name: "dimensions_y", label: "width", type: "number", step: 1, defval: 100.0 },

      {
        name: "plane_normal",
        label: "direction",
        type: "combobox",
        defval: "z",
        data: [
          { label: "X-axis", value: "x" },
          { label: "Y-axis", value: "y" },
          { label: "Z-axis", value: "z" }
        ]
      },
      { name: "plane_distance", label: "offset distance", type: "number", step: 1, defval: 0.0 },

      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      {
        name: "fill",
        label: "Whether to fill",
        type: "radio",
        defval: true,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Grid", value: "Grid" },
          { label: "Stripe", value: "Stripe" },
          { label: "Checkerboard", value: "Checkerboard" }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1,
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      }
    ]
  },
  doubleSidedPlane: {
    name: "Double-sided rendering image plane",
    primitive: true,
    style: [
      { name: "image", label: "Filled image", type: "label" },
      { name: "opacity", label: "transparency", type: "slider", min: 0, max: 1, step: 0.1, defval: 1 },
      { name: "noWhite", label: "Do not display white", type: "radio", defval: true },

      { name: "dimensions_x", label: "length", type: "number", step: 1, defval: 100.0 },
      { name: "dimensions_y", label: "width", type: "number", step: 1, defval: 100.0 },

      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 }
    ]
  },
  box: {
    name: "box",
    primitive: true,
    style: [
      { name: "dimensions_x", label: "Box length", type: "number", step: 1, defval: 100.0 },
      { name: "dimensions_y", label: "box width", type: "number", step: 1, defval: 100.0 },
      { name: "dimensions_z", label: "Box Height", type: "number", step: 1, defval: 100.0 },

      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      {
        name: "fill",
        label: "Whether to fill",
        type: "radio",
        defval: true,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Grid", value: "Grid" },
          { label: "Stripe", value: "Stripe" },
          { label: "Checkerboard", value: "Checkerboard" }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      }
    ]
  },
  particleSystem: {
    name: "Particle Effect",
    style: [
      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      { name: "particleSize", label: "particle size", type: "slider", defval: 1.0, min: 0, max: 60.0, step: 1 },
      { name: "emissionRate", label: "emission rate", type: "slider", defval: 100.0, min: 0.0, max: 500.0, step: 1 },
      { name: "gravity", label: "Gravity factor", type: "slider", defval: 0.0, min: -20.0, max: 20.0, step: 0.1 },
      { name: "transX", label: "Offset valueX", type: "slider", defval: 0.0, min: -50.0, max: 50.0, step: 0.1 },
      { name: "transY", label: "Offset value Y", type: "slider", defval: 0.0, min: -50.0, max: 50.0, step: 0.1 },
      { name: "transZ", label: "Offset value Z", type: "slider", defval: 0.0, min: -50.0, max: 50.0, step: 0.1 },

      { name: "startScale", label: "StartScale", type: "slider", defval: 1.0, min: 0.0, max: 10.0, step: 1 },
      { name: "endScale", label: "EndScale", type: "slider", defval: 1.0, min: 0.0, max: 10.0, step: 1 },
      { name: "minimumParticleLife", label: "minimum life", type: "slider", defval: 3.0, min: 0.1, max: 30.0, step: 0.1 },
      { name: "maximumParticleLife", label: "maximum life", type: "slider", defval: 6.0, min: 0.1, max: 30.0, step: 0.1 }
    ]
  },
  cloud: {
    name: "cumulus",
    style: [
      { name: "scaleX", label: "scaleX", type: "number", step: 1, defval: 1.0 },
      { name: "scaleY", label: "scaleY", type: "number", step: 1, defval: 1.0 },
      { name: "maximumSizeX", label: "maximum sizeX", type: "number", step: 1, defval: 1.0 },
      { name: "maximumSizeY", label: "maximum size Y", type: "number", step: 1, defval: 1.0 },
      { name: "maximumSizeZ", label: "maximum size Z", type: "number", step: 1, defval: 1.0 },
      { name: "slice", label: "slice", type: "slider", defval: 1.0, min: 0, max: 1, step: 0.01 },
      { name: "brightness", label: "brightness", type: "slider", defval: 1.0, min: 0, max: 1, step: 0.01 }
    ]
  },
  lightCone: {
    name: "Light Cone",
    style: [
      { name: "color", label: "color", type: "color", defval: "#00ffff" },
      { name: "radius", label: "bottom radius", type: "number", min: 1.0, max: 999999999, step: 1, defval: 100.0 },
      { name: "height", label: "Cone Height", type: "number", min: 1.0, max: 999999999.0, step: 1, defval: 1000.0 },
      { name: "setHeight", label: "Specify coordinate height", type: "number", min: 0.0, max: 999999999.0, step: 1, defval: 0.0 }
    ]
  },
  tetrahedron: {
    name: "tetrahedron",
    style: [
      { name: "color", label: "color", type: "color", defval: "#000000" },
      { name: "width", label: "top size", type: "number", step: 1, defval: 20.0 },
      { name: "height", label: "vertebral body height", type: "number", step: 1, defval: 30.0 },

      { name: "animation", label: "whether to animate", type: "radio", defval: true },
      {
        name: "moveHeight",
        label: "animation height",
        type: "number",
        step: 1,
        defval: 30.0,
        show(style, allStyle, graphicType) {
          return style.animation
        }
      },
      {
        name: "moveDuration",
        label: "animation duration",
        type: "number",
        min: 1.0,
        max: 999999999,
        step: 1,
        defval: 2.0,
        show(style, allStyle, graphicType) {
          return style.animation
        }
      },
      {
        name: "rotationAngle",
        label: "rotation angle",
        type: "number",
        step: 1,
        defval: 1.0,
        show(style, allStyle, graphicType) {
          return style.animation
        }
      }
    ]
  },
  rectangularSensor: {
    name: "Phaseded Array Radar Range",
    style: [
      { name: "color", label: "color", type: "color", defval: "#00FF00" },
      { name: "lineColor", label: "edge color", type: "color", defval: "#ffffff" },
      { name: "radius", label: "radius", type: "number", min: 1.0, max: 999999999, step: 1, defval: 1.0 },

      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      { name: "xHalfAngleDegree", label: "upper and lower angle", type: "slider", min: 0.0, max: 89.0, step: 0.01, defval: 1.0 },
      { name: "yHalfAngleDegree", label: "left and right angle", type: "slider", min: 0.0, max: 89.0, step: 0.01, defval: 1.0 },
      { name: "showScanPlane", label: "ScanPlane", type: "radio", defval: false },
      {
        name: "scanPlaneColor",
        label: "Scan surface color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.showScanPlane
        }
      },
      {
        name: "scanPlaneMode",
        label: "Scanning surface direction",
        type: "combobox",
        defval: "vertical",
        data: [
          { label: "vertical direction", value: "vertical" },
          { label: "horizontal", value: "horizontal" }
        ],
        show(style, allStyle, graphicType) {
          return style.showScanPlane
        }
      },
      {
        name: "scanPlaneRate",
        label: "scan rate",
        type: "number",
        min: 1.0,
        max: 100,
        step: 0.1,
        defval: 3.0,
        show(style, allStyle, graphicType) {
          return style.showScanPlane
        }
      }
    ]
  },
  camberRadar: {
    name: "Hyperboloid Radar Range",
    style: [
      { name: "color", label: "color", type: "color", defval: "#ffffff" },
      { name: "radius", label: "Inner surface radius", type: "number", min: 1.0, max: 999999999.0, step: 1, defval: 1.0, toFixed: 1 },
      {
        name: "startRadius",
        label: "Outer surface radius",
        type: "number",
        min: 1.0,
        max: 999999999.0,
        step: 1,
        defval: 1.0,
        toFixed: 1
      },

      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      { name: "startFovH", label: "Left cross-section angle", type: "slider", min: -180.0, max: 180.0, step: 0.01, defval: 1.0 },
      { name: "endFovH", label: "right cross-section angle", type: "slider", min: -180.0, max: 180.0, step: 0.01, defval: 1.0 },
      { name: "startFovV", label: "vertical starting angle", type: "slider", min: 0.0, max: 90.0, step: 0.01, defval: 1.0 },
      { name: "endFovV", label: "vertical end angle", type: "slider", min: 0.0, max: 90.0, step: 0.01, defval: 1.0 }
    ]
  },

  jammingRadar: {
    name: "Custom jamming radar",
    style: [
      { name: "scale", label: "size ratio", type: "slider", min: 0.1, max: 10.0, step: 0.1, defval: 1.0 },
      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "autoColor", label: "Whether there is a built-in gradient color", type: "radio", defval: true },
      {
        name: "color",
        label: "color",
        type: "color",
        defval: "rgba(255,0,0,0.5)",
        show(style, allStyle, graphicType) {
          return !style.autoColor
        }
      },
      {
        name: "outline",
        label: "Whether to display edges",
        type: "radio",
        defval: false
      },
      {
        name: "outlineColor",
        label: "edge color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return !style.autoColor
        }
      }
    ]
  },

  fixedJammingRadar: {
    name: "Fixed algorithm jamming radar",
    style: [
      { name: "scale", label: "size ratio", type: "slider", min: 0.1, max: 10.0, step: 0.1, defval: 1.0 },
      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "autoColor", label: "Whether there is a built-in gradient color", type: "radio", defval: true },
      {
        name: "color",
        label: "color",
        type: "color",
        defval: "rgba(255,0,0,0.5)",
        show(style, allStyle, graphicType) {
          return !style.autoColor
        }
      },
      {
        name: "outline",
        label: "Whether to display edges",
        type: "radio",
        defval: false
      },
      {
        name: "outlineColor",
        label: "edge color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return !style.autoColor
        }
      },

      { name: "pt", label: "transmit power", type: "number", defval: 8e6 },
      { name: "gt", label: "Antenna main lobe gain", type: "number", defval: 500 },
      { name: "lambda", label: "Signal wavelength (lambda)", type: "number", defval: 0.056 },
      { name: "sigma", label: "Reflection cross-sectional area (sigma)", type: "number", defval: 3 },
      { name: "n", label: "Pulse accumulation number", type: "number", defval: 16 },
      { name: "k", label: "Boltzmann's constant", type: "number", defval: 138e-25 },
      { name: "t0", label: "Absolute temperature", type: "number", defval: 290 },
      { name: "bn", label: "Receiver passband width", type: "number", defval: 16e5 },
      { name: "fn", label: "Receiver noise figure", type: "number", defval: 5 },
      { name: "sn", label: "Minimum detectable signal-to-noise ratio of the receiver", type: "number", defval: 2 }
    ]
  },

  satellite: {
    name: "satellite",
    primitive: false,
    style: [
      { name: "tle1", label: "tle1", type: "label", defval: "" },
      { name: "tle2", label: "tle2", type: "label", defval: "" },
      {
        name: "path_show",
        label: "Whether to display the path",
        type: "radio",
        defval: false
      },
      {
        name: "path_width",
        label: "Path line width",
        type: "number",
        step: 1,
        defval: 4.0,
        show(style, allStyle, graphicType) {
          return style.path_show
        }
      },
      {
        name: "path_color",
        label: "path color",
        type: "color",
        defval: "#3388ff",
        show(style, allStyle, graphicType) {
          return style.path_show
        }
      },

      {
        name: "model_show",
        label: "Whether to display the model",
        type: "radio",
        defval: false
      },
      {
        name: "model_url",
        label: "model path",
        type: "label",
        defval: "",
        show(style, allStyle, graphicType) {
          return style.model_show
        }
      },
      {
        name: "model_heading",
        label: "directional angle",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.model_show
        }
      },
      {
        name: "model_pitch",
        label: "Pitch angle",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.model_show
        }
      },
      {
        name: "model_roll",
        label: "Tumbling angle",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.model_show
        }
      },
      {
        name: "model_scale",
        label: "proportion",
        type: "number",
        step: 1,
        defval: 1.0,
        show(style, allStyle, graphicType) {
          return style.model_show
        }
      },
      {
        name: "model_minimumPixelSize",
        label: "Minimum pixel size",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.model_show
        }
      },
      {
        name: "model_distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return style.model_show
        }
      },
      {
        name: "model_distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.model_show && style.model_distanceDisplayCondition
        }
      },
      {
        name: "model_distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.model_show && style.model_distanceDisplayCondition
        }
      },
      {
        name: "cone_show",
        label: "Whether to display the visual frustum",
        type: "radio",
        defval: false
      },
      {
        name: "cone_angle1",
        label: "Visual frustum half field angle 1",
        type: "slider",
        min: 0.1,
        max: 80,
        step: 0.01,
        defval: 5,
        show(style, allStyle, graphicType) {
          return style.cone_show
        }
      },
      {
        name: "cone_angle2",
        label: "Visual frustum half field angle 2",
        type: "slider",
        min: 0.1,
        max: 80,
        step: 0.01,
        defval: 5,
        show(style, allStyle, graphicType) {
          return style.cone_show
        }
      },
      {
        name: "cone_color",
        label: "Optical cone color",
        type: "color",
        defval: "rgba(255,255,0,0.4)",
        show(style, allStyle, graphicType) {
          return style.cone_show
        }
      }
    ]
  },
  conicSensor: {
    name: "Satellite Cone",
    style: [
      { name: "color", label: "color", type: "color", defval: "rgba(255,0,0,0.4)" },
      { name: "length", label: "length", type: "number", min: 1.0, max: 999999999.0, step: 1.0, defval: 1.0 },
      { name: "angle", label: "angle", type: "slider", min: 1.0, max: 89.0, step: 0.01, defval: 1.0 },
      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      { name: "topShow", label: "Show top cover", type: "radio", defval: true },
      { name: "shadowShow", label: "Ground projection", type: "radio", defval: false }
    ]
  },
  rectSensor: {
    name: "Satellite Pyramid",
    style: [
      { name: "color", label: "color", type: "color", defval: "rgba(0,255,0,0.4)" },
      { name: "length", label: "length", type: "number", min: 1.0, max: 999999999.0, step: 1.0, defval: 1.0 },
      { name: "angle1", label: "angle1", type: "slider", min: 0.1, max: 89.0, step: 0.01, defval: 1.0 },
      { name: "angle2", label: "angle2", type: "slider", min: 0.1, max: 89.0, step: 0.01, defval: 1.0 },

      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },

      { name: "topShow", label: "Show top cover", type: "radio", defval: true }
    ]
  },
  pointLight: {
    name: "Point light source",
    style: [
      { name: "color", label: "Light Color", type: "color", defval: "rgba(0,255,0,0.4)" },
      { name: "intensity", label: "light intensity", type: "number", min: 1.0, max: 10000.0, step: 1, defval: 1.0 },
      { name: "radius", label: "Point light radius", type: "number", min: 1.0, max: 10000.0, step: 1, defval: 1.0 }
    ]
  },
  spotLight: {
    name: "spotlight",
    style: [
      { name: "color", label: "Light Color", type: "color", defval: "rgba(0,255,0,0.4)" },
      { name: "intensity", label: "light intensity", type: "number", min: 1.0, max: 999999999.0, step: 1, defval: 1.0 },
      { name: "radius", label: "spotlight radius", type: "number", min: 1.0, max: 999999999.0, step: 1, defval: 1.0 },
      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "innerCone", label: "inner cone angle", type: "slider", min: 0.0, max: 45, step: 0.1, defval: 10.0 },
      { name: "outerCone", label: "outer cone angle", type: "slider", min: 0.0, max: 45, step: 0.1, defval: 10.0 }
    ]
  },

  pointVisibility: {
    name: "Circular visual area",
    style: [
      { name: "radius", label: "radius", type: "slider", min: 1.0, max: 3000.0, step: 1, defval: 1.0 },
      { name: "showFrustum", label: "View frustum frame", type: "radio", defval: false }
    ]
  },
  coneVisibility: {
    name: "Sector-shaped visible area",
    style: [
      { name: "radius", label: "radius", type: "slider", min: 1.0, max: 3000.0, step: 1, defval: 1.0 },
      { name: "heading", label: "directional angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "pitch", label: "pitch angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "roll", label: "roll angle", type: "slider", min: 0.0, max: 360.0, step: 0.01, defval: 0.0 },
      { name: "showFrustum", label: "View frustum frame", type: "radio", defval: false }
    ]
  },

  viewDome: {
    name: "Openness Analysis Ball",
    style: [
      { name: "radius", label: "radius", type: "number", min: 1.0, max: 999999999.0, step: 1, defval: 1.0 },
      { name: "visibleColor", label: "Visible area color", type: "color", defval: "rgba(0,183,239, 0.5)" },
      { name: "hiddenColor", label: "Invisible area color", type: "color", defval: "rgba(227,108,9, 0.5)" }
    ]
  },

  // linear
  polyline: {
    name: "line",
    primitive: true,
    extends: ["curve", "brushLine", "distanceMeasure", "heightMeasure"],
    style: [
      { name: "width", label: "line width", type: "number", step: 1, defval: 4.0 },
      {
        name: "materialType",
        label: "Linetype",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "solid line", value: "Color" },
          { label: "Dash Line", value: "PolylineDash" },
          { label: "Color line", value: "PolylineOutline" },
          { label: "Arrow", value: "PolylineArrow" },
          { label: "Glow", value: "PolylineGlow" },

          { label: "OD line", value: "ODLine" },
          { label: "LineFlicker", value: "LineFlicker" },
          { label: "LineTrail", value: "LineTrail" },
          { label: "LineBloom", value: "LineBloom" },
          { label: "Flow Color", value: "LineFlowColor" },

          { label: "flow blue", value: "LineFlow", defval: { image: "img/textures/line-arrow-blue.png", repeat_x: 10 } },
          { label: "Flow dovetail", value: "LineFlow-2", defval: { image: "img/textures/line-arrow-dovetail.png", repeat_x: 10 } },
          { label: "Flow arrow", value: "LineFlow-3", defval: { image: "img/textures/line-arrow-right.png", repeat_x: 10 } },
          { label: "flow aqua", value: "LineFlow-4", defval: { image: "img/textures/line-color-aqua.png", repeat_x: 10 } },
          { label: "flow azure", value: "LineFlow-5", defval: { image: "img/textures/line-color-azure.png", repeat_x: 10 } },
          { label: "flow red", value: "LineFlow-6", defval: { image: "img/textures/line-color-red.png", color: "#ff0000", repeat_x: 10 } },
          { label: "Flow yellow", value: "LineFlow-7", defval: { image: "img/textures/line-color-yellow.png", color: "#ffff00", repeat_x: 10 } },
          { label: "Flow colour", value: "LineFlow-8", defval: { image: "img/textures/line-colour.png", repeat_x: 10 } },
          { label: "flow-gradual", value: "LineFlow-9", defval: { image: "img/textures/line-gradual.png", repeat_x: 10 } },
          { label: "flow pulse", value: "LineFlow-10", defval: { image: "img/textures/line-pulse.png" } },
          { label: "Flowing sprite", value: "LineFlow-11", defval: { image: "img/textures/line-sprite.png", repeat_x: 10 } },
          { label: "Flow tarans", value: "LineFlow-13", defval: { image: "img/textures/line-tarans.png" } },
          { label: "Flow vertebral", value: "LineFlow-14", defval: { image: "img/textures/line-vertebral.png", repeat_x: 10 } },
          { label: "Flow vertebral-blue", value: "LineFlow-15", defval: { image: "img/textures/line-vertebral-blue.png", repeat_x: 10 } },
          { label: "Flow fence-line", value: "LineFlow-16", defval: { image: "img/textures/fence-line.png", repeat_x: 10 } },
          { label: "Flow transarrow", value: "LineFlow-17", defval: { image: "img/textures/line-arrow-trans.png", repeat_x: 10 } }
        ],
        show(style, allStyle, graphicType) {
          return this.data.some((item) => item.value === style.materialType)
        }
      },
      { name: "closure", label: "whether to close", type: "radio", defval: false },
      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.diffHeight || style.diffHeight !== 0
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "zIndex",
        label: "hierarchical order",
        type: "number",
        min: 0,
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.clampToGround
        }
      }
    ]
  },
  path: {
    name: "path",
    style: [
      { name: "width", label: "line width", type: "number", step: 1, defval: 4.0 },
      { name: "color", label: "color", type: "color", defval: "#3388ff" },
      { name: "leadTime", label: "before track", type: "number", step: 1, defval: 0.0 },
      { name: "trailTime", label: "trail retention", type: "number", step: 1, defval: 9999 }
    ]
  },
  polylineVolume: {
    name: "Pipeline",
    primitive: true,
    style: [
      {
        name: "shape",
        label: "shape",
        type: "combobox",
        defval: "pipeline",
        data: [
          { label: "Hollow Pipe", value: "pipeline" },
          { label: "solid tube", value: "circle" },
          { label: "star tube", value: "star" }
        ]
      },
      { name: "radius", label: "radius", type: "number", step: 1, defval: 10.0 },
      {
        name: "thicknes",
        label: "Thickness",
        type: "number",
        step: 1,
        defval: 3.0,
        show(style, allStyle, graphicType) {
          return style.shape === "pipeline"
        }
      },
      {
        name: "slices",
        label: "number of edges",
        type: "number",
        min: 1,
        max: 360,
        step: 1,
        defval: 90
      },

      {
        name: "startAngle",
        label: "Start angle",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.1,
        defval: 0.0
      },

      {
        name: "materialType",
        label: "Material type",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "solid line", value: "Color" },
          { label: "LineTrail", value: "LineTrail" },
          { label: "LineBloom", value: "LineBloom" },
          { label: "Flow Color", value: "LineFlowColor" },

          { label: "Flow line", value: "LineFlow", defval: { image: "img/textures/fence-line.png", repeat_x: 10 } },
          { label: "Flow fence", value: "LineFlow-1", defval: { image: "img/textures/fence.png", repeat_x: 10 } }
        ],
        show(style, allStyle, graphicType) {
          return this.data.some((item) => item.value === style.materialType)
        }
      },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1,
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#000000",
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      }
    ]
  },
  wall: {
    name: "Wall",
    primitive: true,
    style: [
      { name: "diffHeight", label: "Wall Height", type: "number", step: 1, defval: 100.0 },

      { name: "fill", label: "Whether to fill", type: "radio", defval: true },
      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Grid", value: "Grid" },
          { label: "Stripe", value: "Stripe" },
          { label: "Checkerboard", value: "Checkerboard" },
          { label: "Text", value: "Text" },

          { label: "WallScroll", value: "WallScroll" },

          { label: "Flow arrow", value: "LineFlow", defval: { image: "img/textures/arrow.png", repeat_x: 10 } },
          { label: "Flow arrowh", value: "LineFlow-1", defval: { image: "img/textures/arrow-h.png", repeat_x: 10 } },
          { label: "Flow fence", value: "LineFlow-2", defval: { image: "img/textures/fence.png", axisY: true } },
          { label: "Flow line", value: "LineFlow-3", defval: { image: "img/textures/fence-line.png", axisY: true } }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },

      { name: "closure", label: "whether to close", type: "radio", defval: false },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        defval: 1.0,
        show(data) {
          return data.outline === true
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(data) {
          return data.outline === true
        }
      },
      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false
      }
    ]
  },
  scrollWall: {
    name: "Revolving Lantern Wall",
    style: [
      { name: "diffHeight", label: "Wall Height", type: "number", step: 1, defval: 100.0 },
      { name: "color", label: "color", type: "color", defval: "#3388ff" },
      { name: "speed", label: "speed", type: "number", step: 1, defval: 10 },
      { name: "reverse", label: "direction", type: "radio", defval: true },
      {
        name: "style",
        label: "style",
        type: "combobox",
        defval: 1,
        data: [
          { label: "Style 1", value: 1 },
          { label: "Style 2", value: 2 }
        ]
      }
    ]
  },
  thickWall: {
    name: "Thickness Wall",
    style: [
      { name: "diffHeight", label: "Wall Height", type: "number", step: 100, defval: 9999.0 },
      { name: "width", label: "Wall Thickness", type: "number", step: 1, defval: 9999.0 },
      { name: "color", label: "color", type: "color", defval: "#3388ff" },
      { name: "opacity", label: "transparency", type: "number", step: 0.1, min: 0.0, max: 1.0, defval: 1.0 },
      { name: "closure", label: "whether to close", type: "radio", defval: false },
      { name: "hasShadows", label: "Whether there are shadows", type: "radio", defval: false }
    ]
  },
  diffuseWall: {
    name: "Diffusion Wall",
    style: [
      { name: "diffHeight", label: "Wall Height", type: "number", step: 1, defval: 100.0 },
      { name: "color", label: "color", type: "color", defval: "#3388ff" },
      { name: "speed", label: "speed", type: "number", step: 1, defval: 10 }
    ]
  },

  corridor: {
    name: "corridor",
    primitive: true,
    style: [
      {
        name: "height",
        label: "elevation",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "diffHeight",
        label: "stereo height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },

      { name: "width", label: "Corridor width", type: "number", step: 1, defval: 100.0 },
      {
        name: "cornerType",
        label: "vertex style",
        type: "combobox",
        valType: "number",
        defval: 0,
        data: [
          { label: "Sleek", value: 0 },
          { label: "miter", value: 1 },
          { label: "miter", value: 2 }
        ]
      },

      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Grid", value: "Grid" }
        ],
        show(style, allStyle, graphicType) {
          return this.data.some((item) => item.value === style.materialType)
        }
      },

      {
        name: "outline",
        label: "Whether there is a border",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1,
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          // return !style.diffHeight || style.diffHeight !== 0
          return false //Cannot switch
        }
      },
      {
        name: "zIndex",
        label: "hierarchical order",
        type: "number",
        min: 0,
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.clampToGround
        }
      }
    ]
  },
  road: {
    name: "road",
    style: [
      { name: "opacity", label: "transparency", type: "slider", min: 0.0, max: 1.0, step: 0.1, defval: 1.0 },
      { name: "width", label: "road width", type: "number", min: 0.0, step: 1, defval: 1.0 },
      { name: "height", label: "road height", type: "number", min: 0.0, step: 1, defval: 1.0 }
    ]
  },

  // planar
  rectangle: {
    name: "rectangle",
    primitive: true,
    style: [
      {
        name: "height",
        label: "elevation",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "diffHeight",
        label: "stereo height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },

      {
        name: "fill",
        label: "Whether to fill",
        type: "radio",
        defval: true,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Grid", value: "Grid" },
          { label: "Stripe", value: "Stripe" },
          { label: "Checkerboard", value: "Checkerboard" },

          { label: "Text", value: "Text" }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1,
        show(style, allStyle, graphicType) {
          return style.outline && !style.outlineStyle
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show(style, allStyle, graphicType) {
          return style.outline && (style.diffHeight || !style.outlineStyle)
        }
      },
      {
        name: "outlineStyle",
        next: "width",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1.0,
        contant: "outlineWidth",
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },
      {
        name: "outlineStyle",
        next: "materialType",
        label: "border material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid color", value: "Color", contant: "outlineColor", defval: "#fff" },
          { label: "Cross Interval", value: "LineCross" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Color line", value: "PolylineOutline" },
          { label: "Glow", value: "PolylineGlow" },
          { label: "LineBloom", value: "LineBloom" },
          { label: "Flow Color", value: "LineFlowColor" },

          { label: "Flow line", value: "LineFlow", defval: { image: "img/textures/fence-line.png", repeat_x: 10 } },
          { label: "Flow fence", value: "LineFlow-1", defval: { image: "img/textures/fence.png", repeat_x: 10 } }
        ],
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },

      { name: "rotationDegree", label: "rotation angle", type: "number", step: 1, defval: 0.0 },
      {
        name: "stRotationDegree",
        label: "Material angle",
        type: "number",
        step: 1,
        defval: 0.0,
        show: (style) => {
          return style.fill !== false && style.materialType !== "Color"
        }
      },
      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false
        // show(style, allStyle, graphicType) {
        // return false // Face cannot be switched
        // }
      },
      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "zIndex",
        label: "hierarchical order",
        type: "number",
        min: 0,
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.clampToGround
        }
      }
    ]
  },
  polygon: {
    name: "面",
    primitive: true,
    extends: [
      "video2D",
      "attackArrow",
      "attackArrowPW",
      "attackArrowYW",
      "closeVurve",
      "straightArrow",
      "doubleArrow",
      "fineArrow",
      "fineArrowYW",
      "areaMeasure",
      "gatheringPlace",
      "isosTriangle",
      "lune",
      "regular"
    ],
    style: [
      {
        name: "diffHeight",
        label: "stereo height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },

      {
        name: "fill",
        label: "Whether to fill",
        type: "radio",
        defval: true,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Grid", value: "Grid" },
          { label: "Stripe", value: "Stripe" },
          { label: "Checkerboard", value: "Checkerboard" },
          { label: "Text", value: "Text" },

          { label: "Gradient Surface", value: "PolyGradient" },
          { label: "Water", value: "Water" },
          { label: "Blue light water surface", value: "WaterLight" }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },

      {
        name: "stRotationDegree",
        label: "Fill direction",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0,
        show: (style) => {
          return style.fill !== false && style.materialType !== "Color"
        }
      },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1.0,
        show: (style) => {
          return style.outline && !style.outlineStyle
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show: (style) => {
          return style.outline && (style.diffHeight || !style.outlineStyle)
        }
      },
      {
        name: "outlineStyle",
        next: "width",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1.0,
        contant: "outlineWidth",
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },
      {
        name: "outlineStyle",
        next: "materialType",
        label: "border material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid color", value: "Color", contant: "outlineColor", defval: "#fff" },
          { label: "Cross Interval", value: "LineCross" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Color line", value: "PolylineOutline" },
          { label: "Glow", value: "PolylineGlow" },
          { label: "LineBloom", value: "LineBloom" },
          { label: "Flow Color", value: "LineFlowColor" },

          { label: "Flow line", value: "LineFlow", defval: { image: "img/textures/fence-line.png", repeat_x: 10 } },
          { label: "Flow fence", value: "LineFlow-1", defval: { image: "img/textures/fence.png", repeat_x: 10 } }
        ],
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },

      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false
        // show(style, allStyle, graphicType) {
        // return false // Face cannot be switched
        // }
      },
      {
        name: "zIndex",
        label: "hierarchical order",
        type: "number",
        min: 0,
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.clampToGround
        }
      }
    ]
  },
  sector: {
    name: "Sector",
    style: [
      {
        name: "radius",
        label: "radius",
        type: "number",
        toFixed: 2,
        step: 0.1,
        defval: 0.0
      },
      {
        name: "startAngle",
        label: "Start angle",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0
      },
      {
        name: "endAngle",
        label: "End angle",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0
      },
      {
        name: "noCenter",
        label: "Not connected to the center point",
        type: "radio",
        defval: false
      },

      {
        name: "diffHeight",
        label: "stereo height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },

      {
        name: "fill",
        label: "Whether to fill",
        type: "radio",
        defval: true,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "materialType",
        label: "Fill material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid Color", value: "Color" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Grid", value: "Grid" },
          { label: "Stripe", value: "Stripe" },
          { label: "Checkerboard", value: "Checkerboard" },
          { label: "Text", value: "Text" },

          { label: "Gradient Surface", value: "PolyGradient" },
          { label: "Water", value: "Water" },
          { label: "Blue light water surface", value: "WaterLight" }
        ],
        show(style, allStyle, graphicType) {
          return style.fill !== false && this.data.some((item) => item.value === style.materialType)
        }
      },

      {
        name: "stRotationDegree",
        label: "Fill direction",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0,
        show: (style) => {
          return style.fill !== false && style.materialType !== "Color"
        }
      },

      { name: "outline", label: "Border or not", type: "radio", defval: false },
      {
        name: "outlineWidth",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1.0,
        show: (style) => {
          return style.outline && !style.outlineStyle
        }
      },
      {
        name: "outlineColor",
        label: "border color",
        type: "color",
        defval: "#ffffff",
        show: (style) => {
          return style.outline && (style.diffHeight || !style.outlineStyle)
        }
      },
      {
        name: "outlineStyle",
        next: "width",
        label: "border width",
        type: "number",
        min: 0,
        step: 1,
        defval: 1.0,
        contant: "outlineWidth",
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },
      {
        name: "outlineStyle",
        next: "materialType",
        label: "border material",
        type: "combobox",
        defval: "Color",
        data: [
          { label: "Solid color", value: "Color", contant: "outlineColor", defval: "#fff" },
          { label: "Cross Interval", value: "LineCross" },
          { label: "Picture", value: "Image", defval: { image: "img/tietu/gugong.jpg" } },
          { label: "Color line", value: "PolylineOutline" },
          { label: "Glow", value: "PolylineGlow" },
          { label: "LineBloom", value: "LineBloom" },
          { label: "Flow Color", value: "LineFlowColor" },

          { label: "Flow line", value: "LineFlow", defval: { image: "img/textures/fence-line.png", repeat_x: 10 } },
          { label: "Flow fence", value: "LineFlow-1", defval: { image: "img/textures/fence.png", repeat_x: 10 } }
        ],
        show(style, allStyle, graphicType) {
          return style.outline && !style.diffHeight
        }
      },

      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },

      {
        name: "hasShadows",
        label: "Whether it is shadowed",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },

      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return false // Face cannot be switched
        }
      },
      {
        name: "zIndex",
        label: "hierarchical order",
        type: "number",
        min: 0,
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.clampToGround
        }
      }
    ]
  },
  pit: {
    name: "well",
    style: [
      { name: "diffHeight", label: "well depth", type: "number", step: 1, defval: 0.0 },
      { name: "splitNum", label: "Interpolation number", type: "number", step: 1, defval: 50 },
      { name: "image", label: "Wall texture", type: "label" },
      { name: "imageBottom", label: "Bottom map", type: "label" }
    ]
  },
  water: {
    name: "water surface",
    style: [
      { name: "opacity", label: "transparency", type: "slider", min: 0.0, max: 1.0, step: 0.1, defval: 1.0 },

      { name: "baseWaterColor", label: "base color", type: "color", defval: "#123e59" },
      { name: "blendColor", label: "BlendColor", type: "color", defval: "#123e59" },
      { name: "normalMap", label: "Reflection Picture", type: "label", defval: "img/textures/waterNormals.jpg" },
      { name: "frequency", label: "wavenumber", type: "number", min: 1, max: 100000, step: 1, defval: 9000 },
      { name: "amplitude", label: "water wave amplitude", type: "number", min: 0, max: 100, step: 1, defval: 5.0 },
      { name: "animationSpeed", label: "animation speed", type: "slider", min: 0, max: 1, step: 0.01, defval: 0.03 },
      { name: "specularIntensity", label: "reflection intensity", type: "slider", min: 0, max: 1, step: 0.1, defval: 0.5 },

      {
        name: "stRotationDegree",
        label: "Fill direction",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0,
        show: (style) => {
          return style.fill !== false && style.materialType !== "Color"
        }
      },

      {
        name: "offsetHeight",
        label: "offset height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },
      {
        name: "diffHeight",
        label: "stereo height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return !style.clampToGround
        }
      },

      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return false // Face cannot be switched
        }
      },
      {
        name: "zIndex",
        label: "hierarchical order",
        type: "number",
        min: 0,
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.clampToGround
        }
      }
    ]
  },
  video: {
    name: "video",
    style: [
      {
        name: "diffHeight",
        label: "stereo height",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return graphicType === "wall"
        }
      },
      {
        name: "stRotationDegree",
        label: "Fill direction",
        type: "slider",
        min: 0.0,
        max: 360.0,
        step: 0.01,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.fill !== false && !style.diffHeight
        }
      },
      {
        name: "distanceDisplayCondition",
        label: "Whether to display according to the viewing distance",
        type: "radio",
        defval: false
      },
      {
        name: "distanceDisplayCondition_far",
        label: "maximum distance",
        type: "number",
        step: 1,
        defval: 100000.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "distanceDisplayCondition_near",
        label: "minimum distance",
        type: "number",
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.distanceDisplayCondition
        }
      },
      {
        name: "clampToGround",
        label: "Whether it is attached to the floor",
        type: "radio",
        defval: false,
        show(style, allStyle, graphicType) {
          return false // Face cannot be switched
        }
      },
      {
        name: "zIndex",
        label: "hierarchical order",
        type: "number",
        min: 0,
        step: 1,
        defval: 0.0,
        show(style, allStyle, graphicType) {
          return style.clampToGround
        }
      }
    ]
  },
  reflectionWater: {
    name: "Reflecting Water",
    style: [
      { name: "color", label: "Water color", type: "color", defval: "#7badd0" },
      { name: "opacity", label: "transparency", type: "slider", min: 0.0, max: 1.0, step: 0.1, defval: 0.9 },
      { name: "normalMap", label: "Water perturbation normal map", type: "label", defval: "img/textures/waterNormals.jpg" },
      { name: "reflectivity", label: "reflectivity", type: "slider", min: 0.0, max: 1.0, step: 0.1, defval: 0.5 },
      { name: "ripple", label: "ripple size", type: "number", min: 0.0, max: 1000.0, step: 1, defval: 50.0 },
      { name: "shiny", label: "light intensity", type: "number", min: 1.0, max: 1000.0, step: 1.0, defval: 100.0 },
      { name: "animationSpeed", label: "animation speed", type: "number", min: 0.1, max: 10.0, step: 0.1, defval: 1.0 },
      { name: "specularIntensity", label: "reflection intensity", type: "slider", min: 0.0, max: 0.9, step: 0.01, defval: 0.3 },
      { name: "distortion", label: "Reflection distortion degree", type: "number", min: 0.0, max: 10.0, step: 0.1, defval: 3.7 }
    ]
  }
}

// When some vectors correspond to the same configuration as other basic types, copy the configuration
for (const key in styleConfig) {
  styleConfig[key].type = key // Identification type
  if (styleConfig[key].primitive) {
    styleConfig[key + "P"] = styleConfig[key]
  }
  if (styleConfig[key].extends) {
    styleConfig[key].extends.forEach((element) => {
      styleConfig[element] = styleConfig[key]
    })
  }
}

window.styleConfig = styleConfig
// export default styleConfig
