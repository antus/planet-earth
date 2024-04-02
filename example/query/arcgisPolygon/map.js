// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let queryMapserver
let drawGraphic
let geoJsonLayer

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 31.837532, lng: 117.202653, alt: 10586, heading: 0, pitch: -90 }
  },
  control: {
    infoBox: false
  }
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

  // for reference
  const arcGisLayer = new mars3d.layer.ArcGisLayer({
    url: "//server.mars3d.cn/arcgis/rest/services/mars/guihua/MapServer",
    highlight: {
      clampToGround: true,
      fill: false,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#e000d9"
    },
    // popup: "all",
    opacity: 0.1
  })
  map.addLayer(arcGisLayer)

  // Query service
  queryMapserver = new mars3d.query.QueryArcServer({
    url: "http://server.mars3d.cn/arcgis/rest/services/mars/guihua/MapServer/0"
  })

  //Layer used to display query results (geojson)
  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Planning land",
    symbol: {
      type: "polygonP",
      styleOptions: {
        color: "rgba(205, 233, 247, 0.7)", // fill color
        clampToGround: true
      },
      styleField: "Land number",
      styleFieldOptions
    },
    // popup: "all",
    popup: "Name: {land name}<br />Number: {land number}<br />Type: {planned land}<br />Area: {muArea} acres"
  })
  map.addLayer(geoJsonLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

// Frame selection query rectangle
function drawRectangle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#00ffff",
      opacity: 0.3,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// Frame selection query circle
function drawCircle() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#00ffff",
      opacity: 0.3,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// Frame selection query multi-row
function drawPolygon() {
  clearAll()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00ffff",
      opacity: 0.3,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// clear data
function clearAll() {
  drawGraphic = null
  map.graphicLayer.clear()
  geoJsonLayer.clear()
}

// Query data
function queryData(queryVal) {
  if (drawGraphic == null) {
    globalMsg("Please draw the query area!")
    return
  }

  queryMapserver.query({
    column: "land name",
    text: queryVal,
    graphic: drawGraphic,
    page: false,
    success: (result) => {
      if (result.count === 0) {
        globalMsg("No relevant records found!")
        return
      }
      console.log("queried records", result)

      const drawGeoJSON = drawGraphic.toGeoJSON({ outline: true })

      const arrArea = []
      const arrFeatures = result.geojson.features
      for (let i = 0; i < arrFeatures.length; i++) {
        const feature = arrFeatures[i]

        try {
          const geojsonNew = turf.intersect(drawGeoJSON, feature) // Cutting

          if (geojsonNew) {
            feature.geometry = geojsonNew.geometry
          }
        } catch (e) {
          globalMsg("Cutting abnormality, please cut again")
          clearAll()
        }

        const area = turf.area(feature) || feature.properties.Shape_Area || 0
        feature.properties.muArea = mars3d.Util.formatNum(area * 0.0015, 2) // Square meters to acres

        // Data that need statistics
        arrArea.push({
          type: feature.properties.Land name,
          area: feature.properties.muArea
        })
      }

      // Display Data
      geoJsonLayer.load({ data: result.geojson })
      calculateArea(arrArea)
    },
    error: (error, msg) => {
      console.log("Service access error", error)
      globalAlert(msg, "Service access error")
    }
  })
}

// Statistics area data and displays it in tables and charts
function calculateArea(arr) {
  console.log("Data before calculation", arr)

  const objTemp = {}
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    if (!objTemp[item.type]) {
      objTemp[item.type] = { area: 0, count: 0 }
    }

    objTemp[item.type].area += item.area
    objTemp[item.type].count++
  }

  const arrTable = [] // type + area + quantity
  for (const type in objTemp) {
    const area = mars3d.Util.formatNum(objTemp[type].area, 2)
    arrTable.push({ type, area, count: objTemp[type].count })
  }
  eventTarget.fire("tableData", { list: arrTable })
}

//Plan surface shading configuration
const styleFieldOptions = {
  A1: {
    // Administrative office space
    color: "rgba(255,127,159,0.9)"
  },
  A2: {
    // Land for cultural facilities
    color: "rgba(255,159,127,0.9)"
  },
  A22: {
    // Land for cultural activities
    color: "rgba(255,159,127,0.9)"
  },
  A3: {
    // Land for education and scientific research
    color: "rgba(255,127,191,0.9)"
  },
  A31: {
    // Land for higher education institutions
    color: "rgba(255,127,191,0.9)"
  },
  A32: {
    // Land for secondary vocational schools
    color: "rgba(255,127,191,0.9)"
  },
  A33: {
    // Land for primary and secondary schools
    color: "rgba(255,255,127,0.9)"
  },
  A34: {
    //Special education land
    color: "rgba(255,127,191,0.9)"
  },
  A35: {
    //Scientific research land
    color: "rgba(255,127,191,0.9)"
  },
  A4: {
    //Sports land
    color: "rgba(255,127,0,0.9)"
  },
  A41: {
    //Sports venue land
    color: "rgba(255,127,0,0.9)"
  },
  A5: {
    //Medical and health land
    color: "rgba(255,127,127,0.9)"
  },
  A51: {
    //Hospital land
    color: "rgba(255,127,127,0.9)"
  },
  A52: {
    // Land for health and epidemic prevention
    color: "rgba(255,127,127,0.9)"
  },
  A59: {
    //Other medical and health land
    color: "rgba(255,127,127,0.9)"
  },
  A6: {
    // Social welfare land
    color: "rgba(165,82,103,0.9)"
  },
  A7: {
    // Land for cultural relics and historic sites
    color: "rgba(165,41,0,0.9)"
  },
  A9: {
    // religious land
    color: "rgba(165,82,103,0.9)"
  },
  B: {
    // Land for commercial service industry facilities
    color: "rgba(255,0,63,0.9)"
  },
  B1: {
    // Commercial land
    color: "rgba(255,0,63,0.9)"
  },
  B11: {
    //Retail commercial land
    color: "rgba(255,0,63,0.9)"
  },
  B12: {
    // Wholesale market land
    color: "rgba(255,0,63,0.9)"
  },
  B13: {
    //Catering area
    color: "rgba(255,0,63,0.9)"
  },
  B14: {
    // hotel land
    color: "rgba(255,0,63,0.9)"
  },
  B2: {
    //Business land
    color: "rgba(255,0,63,0.9)"
  },
  B21: {
    //Finance and insurance land
    color: "rgba(255,0,63,0.9)"
  },
  B29: {
    // Other business areas
    color: "rgba(255,0,63,0.9)"
  },
  B3: {
    // Entertainment and sports land
    color: "rgba(255,159,127,0.9)"
  },
  B31: {
    // entertainment land
    color: "rgba(255,159,127,0.9)"
  },
  B32: {
    // Recreation and sports land
    color: "rgba(255,159,127,0.9)"
  },
  B4: {
    // Land for public facilities business outlets
    color: "rgba(255,159,127,0.9)"
  },
  B41: {
    // Land for gas station
    color: "rgba(255,159,127,0.9)"
  },
  B9: {
    // Land for other service facilities
    color: "rgba(255,159,127,0.9)"
  },
  BR: {
    // Mixed commercial and residential land
    color: "rgba(255,0,63,0.9)"
  },
  E1: {
    // waters
    color: "rgba(127,255,255,0.9)"
  },
  E2: {
    // Agricultural and forestry land
    color: "rgba(41,165,0,0.9)"
  },
  E9: {
    //Other non-construction land
    color: "rgba(127,127,63,0.9)"
  },
  G: {
    // Green space and square land
    color: "rgba(0,127,0,0.9)"
  },
  G1: {
    // Park green space
    color: "rgba(0,255,63,0.9)"
  },
  G2: {
    // Protective green space
    color: "rgba(0,127,0,0.9)"
  },
  G3: {
    //Plaza land
    color: "rgba(128,128,128,0.9)"
  },
  H: {
    // construction land
    color: "rgba(165,124,0,0.9)"
  },
  H1: {
    // Construction land for urban and rural residential areas
    color: "rgba(165,124,0,0.9)"
  },
  H14: {
    //Village construction land
    color: "rgba(165,165,82,0.9)"
  },
  H2: {
    // Land for regional transportation facilities
    color: "rgba(192,192,192,0.9)"
  },
  H21: {
    // Railway land
    color: "rgba(192,192,192,0.9)"
  },
  H22: {
    // road land
    color: "rgba(192,192,192,0.9)"
  },
  H23: {
    // Port land
    color: "rgba(192,192,192,0.9)"
  },
  H3: {
    // Land for regional public facilities
    color: "rgba(82,165,82,0.9)"
  },
  H4: {
    // Special land
    color: "rgba(47,76,38,0.9)"
  },
  H41: {
    // military land
    color: "rgba(47,76,38,0.9)"
  },
  H42: {
    // Security land
    color: "rgba(47,76,38,0.9)"
  },
  H9: {
    //Other construction land
    color: "rgba(165,165,82,0.9)"
  },
  M: {
    // Industrial land
    color: "rgba(127,95,63,0.9)"
  },
  M1: {
    // Class I industrial land
    color: "rgba(127,95,63,0.9)"
  },
  M2: {
    // Class II industrial land
    color: "rgba(76,57,38,0.9)"
  },
  M4: {
    // Land for agricultural service facilities
    color: "rgba(153,38,0,0.9)"
  },
  R: {
    // Residential land
    color: "rgba(255,255,0,0.9)"
  },
  R1: {
    // Class I residential land
    color: "rgba(255,255,127,0.9)"
  },
  R2: {
    // Class II residential land
    color: "rgba(255,255,0,0.9)"
  },
  R21: {
    // Residential land
    color: "rgba(255,255,0,0.9)"
  },
  R22: {
    // Land for service facilities
    color: "rgba(255,255,0,0.9)"
  },
  RB: {
    // Mixed commercial and residential land
    color: "rgba(255,191,0,0.9)"
  },
  S: {
    // Land for roads and transportation facilities
    color: "rgba(128,128,128,0.9)"
  },
  S2: {
    //Urban rail transit land
    color: "rgba(128,128,128,0.9)"
  },
  S3: {
    // Transportation hub land
    color: "rgba(192,192,192,0.9)"
  },
  S4: {
    // Traffic station land
    color: "rgba(128,128,128,0.9)"
  },
  S41: {
    //Public transport station land
    color: "rgba(128,128,128,0.9)"
  },
  S42: {
    // Social parking lot land
    color: "rgba(128,128,128,0.9)"
  },
  S9: {
    // Land for other transportation facilities
    color: "rgba(63,111,127,0.9)"
  },
  U: {
    // Land for public facilities
    color: "rgba(0,95,127,0.9)"
  },
  U1: {
    // Supply facility land
    color: "rgba(0,95,127,0.9)"
  },
  U11: {
    //land for water supply
    color: "rgba(0,95,127,0.9)"
  },
  U12: {
    // power supply land
    color: "rgba(0,95,127,0.9)"
  },
  U13: {
    // Land for gas
    color: "rgba(0,95,127,0.9)"
  },
  U14: {
    // Heating land
    color: "rgba(0,95,127,0.9)"
  },
  U15: {
    // communication land
    color: "rgba(0,95,127,0.9)"
  },
  U2: {
    // Land for environmental facilities
    color: "rgba(0,95,127,0.9)"
  },
  U21: {
    // Drainage land
    color: "rgba(0,95,127,0.9)"
  },
  U22: {
    // Sanitation land
    color: "rgba(0,95,127,0.9)"
  },
  U3: {
    // Land for safety facilities
    color: "rgba(0,95,127,0.9)"
  },
  U4: {
    // Land for environmental facilities
    color: "rgba(0,95,127,0.9)"
  },
  U9: {
    //Other public facilities land
    color: "rgba(0,95,127,0.9)"
  },
  W: {
    // Warehousing land
    color: "rgba(159,127,255,0.9)"
  }
}
