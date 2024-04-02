// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var graphicLayer // vector layer object
let allCount
let lastSelectWX

// Need to override the map attribute parameters in config.json (the merge is automatically handled in the current example framework)
var mapOptions = {
  scene: {
    center: { lat: 29.646563, lng: 96.25028, alt: 150004581, heading: 352, pitch: -90 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 500000000,
      constrainedAxis: false //Remove restrictions on mouse operations in the north and south poles
    },
    clock: {
      multiplier: 2 // speed
    }
  },
  control: {
    clockAnimate: true, // Clock animation control (lower left corner)
    timeline: true, // Whether to display the timeline control
    compass: { top: "50px", left: "5px" }
  },
  terrain: false
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
  map.toolbar.style.bottom = "55px" // Modify the style of the toolbar control

  //Modify the skybox
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/5/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/5/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/5/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/5/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/5/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/5/tycho2t3_80_pz.jpg"
    }
  })

  //Access the backend interface and get data
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tle.json" })
    .then(function (arr) {
      initData(arr.list)
    })
    .catch(function () {
      globalMsg("Abnormal acquisition of space target orbit data!")
    })

  // Click on an empty space on the map
  map.on(mars3d.EventType.clickMap, function (event) {
    if (lastSelectWX) {
      //Reset the last selected track style
      lastSelectWX.remove()
      lastSelectWX = null
    }
    eventTarget.fire("clickMap")
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

function initData(arr) {
  allCount = arr.length
  globalMsg("Current number of outer space objects: " + allCount)

  //Create vector data layer
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const countryNumber = { United States: 1, Soviet Union: 1, China: 1, United Kingdom: 1, France: 1, Canada: 1, Australia: 1, Japan: 1, India: 1 }
  const yearNumber = {}
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    const style = {
      pixelSize: 5,
      color: "rgba(0,255,0,0.6)",
      outlineWidth: 1,
      outlineColor: "#000000",
      scaleByDistance: new Cesium.NearFarScalar(20000000, 1.0, 150000000, 0.4)
    }

    // Convert to attribute for easy use
    if (item.info) {
      item.type = item.info[0] // Object type
      item.status = item.info[1] // Operation status code
      item.country = item.info[2] // Ownership (country)
      item.launchDate = item.info[3] && new Date(item.info[3]) // launch date
      item.launchSite = item.info[4] // Launch location
      item.decayDate = item.info[5] // Decay date
      item.period = item.info[6] // Orbital period [minutes]
      item.inclination = item.info[7] // Inclination angle [degrees]
      item.apogee = item.info[8] // Apogee altitude [km]
      item.perigee = item.info[9] // Perigee height [km]
      item.rcs = item.info[10] //Radar cross section
      // item.dataStatus = item.info[11]; // Data status code
      item.orbitCenter = item.info[12] || "EA" // Orbit Center
      item.orbitType = item.info[13] || "ORB" // Orbit type

      delete item.info
    }

    // Get the number of all countries
    if (countryNumber[getCountryName(item.country)]) {
      countryNumber[getCountryName(item.country)]++
    }
    // Get all years
    if (yearNumber[new Date(item.launchDate).getFullYear()]) {
      yearNumber[new Date(item.launchDate).getFullYear()]++
    } else {
      yearNumber[new Date(item.launchDate).getFullYear()] = 1
    }

    const graphic = new mars3d.graphic.PointPrimitive({
      id: item.id,
      style,
      attr: item
    })
    graphicLayer.addGraphic(graphic)
  }

  //Load the echars chart in the panel
  eventTarget.fire("loadEchartsData", { allCount, countryNumber, yearNumber })

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("Satellite clicked", event)
    const satelliteObj = event.graphic

    if (lastSelectWX) {
      //Reset the last selected track style
      lastSelectWX.remove()
      lastSelectWX = null
    }
    if (satelliteObj) {
      const item = satelliteObj.attr
      // if (!item.name) {
      //   return
      // }

      let launchDate, status, country, launchSite
      if (item.launchDate) {
        launchDate = mars3d.Util.formatDate(item.launchDate, "yyyy-MM-dd")
      }
      if (item.status) {
        status = getStatusName(item.status)
      } else {
        status = ""
      }
      if (item.country) {
        country = getCountryName(item.country)
      }
      if (item.launchSite) {
        launchSite = getLaunchSiteName(item.launchSite)
      }
      const period = mars3d.Util.formatNum(item.period, 2) + "minutes"
      const inclination = item.inclination + "°"
      const apogee = mars3d.Util.formatNum(item.apogee, 0) + " km"
      const perigee = mars3d.Util.formatNum(item.perigee, 0) + " km"

      const inhtml = `<a href="https://www.n2yo.com/satellite/?s=${item.id}" target="_blank">N2YO...</a>`

      const weixinList = [
        item.name || "Unknown",
        item.id,
        item.cospar || "Unknown",
        item.type,
        status,
        country,
        launchDate,
        launchSite,
        period,
        inclination,
        apogee,
        perigee,
        item.rcs || "Unknown",
        item.orbitCenter,
        item.orbitType,
        inhtml
      ]

      eventTarget.fire("clickWeixin", { weixinList })

      weixingStyle(item)
    }
  })

  initWorker(arr)
}

//Use multi-threading to calculate satellite position
let worker
function initWorker(arr) {
  worker = new Worker(window.currentPath + "tleWorker.js") // currentPath is the current directory, built into the sample framework
  worker.onmessage = function (event) {
    const time = event.data.time
    const positionObj = event.data.positionObj

    for (const id in positionObj) {
      const item = positionObj[id]
      if (!item) {
        continue
      }

      const graphic = graphicLayer.getGraphicById(id)
      if (graphic) {
        graphic.position = new Cesium.Cartesian3(item.x, item.y, item.z)
      }
    }

    // Loop to continue sending request messages
    postWorkerMessage(arr)
  }

  //The main thread calls the worker.postMessage() method to send a message to the Worker.
  postWorkerMessage(arr)
}

function postWorkerMessage(arr) {
  const stime = Cesium.JulianDate.addSeconds(map.clock.currentTime, 1, new Cesium.JulianDate())
  const date = Cesium.JulianDate.toDate(stime)

  //The main thread calls the worker.postMessage() method to send a message to the Worker.
  worker.postMessage({
    time: date,
    list: arr
  })
}

function weixingStyle(item) {
  // Highlight the selected track style
  const weixin = new mars3d.graphic.Satellite({
    tle1: item.tle1,
    tle2: item.tle2,
    referenceFrame: Cesium.ReferenceFrame.FIXED, // Cesium.ReferenceFrame.INERTIAL,
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 50
    },
    label: {
      text: item.name,
      color: "#ffffff",
      opacity: 1,
      font_family: "楷体",
      font_size: 30,
      outline: true,
      outlineColor: "#000000",
      outlineWidth: 3,
      background: true,
      backgroundColor: "#000000",
      backgroundOpacity: 0.5,
      font_weight: "normal",
      font_style: "normal",
      pixelOffsetX: 0,
      pixelOffsetY: -20,
      scaleByDistance: true,
      scaleByDistance_far: 10000000,
      scaleByDistance_farValue: 0.4,
      scaleByDistance_near: 100000,
      scaleByDistance_nearValue: 1
    },
    path: {
      color: "#e2e2e2",
      opacity: 0.8,
      width: 1
    }
  })
  map.graphicLayer.addGraphic(weixin)
  lastSelectWX = weixin
}

// Orbital altitude definitions.

// reset
function resetGraphic() {
  // Loop through all satellites
  if (!graphicLayer) {
    globalMsg("Current data is loading")
    return
  }
  graphicLayer.eachGraphic(function (graphic) {
    if (graphic.selected) {
      graphic.setStyle({
        color: "rgba(0,255,0,0.6)",
        outlineColor: "#000000"
      })
      graphic.selected = false
    }
  })
}

// Well known satellite constellations.
const GPS = [
  20959, 22877, 23953, 24876, 25933, 26360, 26407, 26605, 26690, 27663, 27704, 28129, 28190, 28361, 28474, 28874, 29486, 29601, 32260, 32384, 32711,
  35752, 36585, 37753, 38833, 39166, 39533, 39741, 40105, 40294, 40534
]
const GLONASS = [
  28915, 29672, 29670, 29671, 32276, 32275, 32393, 32395, 36111, 36112, 36113, 36400, 36402, 36401, 37139, 37138, 37137, 37829, 37869, 37867, 37868,
  39155, 39620, 40001
]
const INMARSAT = [20918, 21149, 21814, 21940, 23839, 24307, 24674, 24819, 25153, 28628, 28899, 33278, 40384, 39476]
const LANDSAT = [25682, 39084]
const DIGITALGLOBE = [25919, 32060, 33331, 35946, 40115]

//Judge satellite data
function selectSatellites(data) {
  if (!graphicLayer) {
    return
  }

  const name = data.name
  const xilie = data.selXiLie // series of satellites
  const country = data.selCountry // Country
  const type = data.selType // Object type

  const val1 = data.sliLaunchdate
  const min1 = 1950
  const max1 = 2022

  const val2 = data.sliPeriod
  const min2 = 0
  const max2 = 60000

  const val3 = data.sliInclination
  const min3 = 0
  const max3 = 150

  const val4 = data.sliApogee
  const min4 = 0
  const max4 = 600000

  const val5 = data.sliPerigee
  const min5 = 0
  const max5 = 500000

  const val6 = data.sliRcs
  const min6 = 0
  const max6 = 1000

  let selCount = 0

  // Loop through all satellites
  graphicLayer.eachGraphic(function (graphic) {
    // Restore all styles first
    if (graphic.selected) {
      graphic.setStyle({
        color: "rgba(0,255,0,0.6)",
        outlineColor: "#000000"
      })
      graphic.selected = false
    }

    const attr = graphic.attr // Attributes of satellites

    // name
    if (name) {
      if ((attr.name && attr.name.indexOf(name) !== -1) || (attr.id && attr.id === name) || (attr.cospar && attr.cospar.indexOf(name) !== -1)) {
        //
      } else {
        return
      }
    }

    //series satellite time
    if (xilie) {
      let selected
      switch (xilie) {
        case "gps":
          selected = GPS.indexOf(attr.id) !== -1
          break
        case "bd":
          selected = attr.name.indexOf("BD") !== -1 || attr.name.indexOf("BEIDOU") !== -1
          break
        case "glonass":
          selected = GLONASS.indexOf(attr.id) !== -1
          break
        case "inmarsat":
          selected = INMARSAT.indexOf(attr.id) !== -1
          break
        case "landsat":
          selected = LANDSAT.indexOf(attr.id) !== -1
          break
        case "digitalglobe":
          selected = DIGITALGLOBE.indexOf(attr.id) !== -1
          break
      }
      if (!selected) {
        return
      }
    }

    // nation
    if (country && country !== attr.country) {
      return
    }

    // Type judgment
    if (type) {
      const name = attr.name
      if (type === "junk" && name.indexOf(" DEB") === -1 && name.indexOf(" R/B") === -1) {
        return
      }
      if (type === "satellite" && (name.indexOf(" DEB") !== -1 || name.indexOf(" R/B") !== -1)) {
        return
      }
    }

    // Judgment of sliding rail
    // Launch date
    if (val1[0] !== min1 || val1[1] !== max1) {
      if (!attr.launchDate) {
        return
      }

      const y = attr.launchDate.getFullYear()
      if (y <= val1[0] || y >= val1[1]) {
        return
      }
    }

    // Orbital period
    if (val2[0] !== min2 || val2[1] !== max2) {
      if (!attr.period) {
        return
      }
      if (attr.period < val2[0] || attr.period > val2[1]) {
        return
      }
    }

    // Inclination
    if (val3[0] !== min3 || val3[1] !== max3) {
      if (!attr.inclination) {
        return
      }
      if (attr.inclination < val3[0] || attr.inclination > val3[1]) {
        return
      }
    }

    // Apogee
    if (val4[0] !== min4 || val4[1] !== max4) {
      if (!attr.apogee) {
        return
      }
      if (attr.apogee < val4[0] || attr.apogee > val4[1]) {
        return
      }
    }

    // Perigee
    if (val5[0] !== min5 || val5[1] !== max5) {
      if (!attr.perigee) {
        return
      }
      if (attr.perigee < val5[0] || attr.perigee > val5[1]) {
        return
      }
    }

    // Judgment of size
    if (val6[0] !== min6 || val6[1] !== max6) {
      if (!attr.rcs) {
        return
      }
      if (attr.rcs <= val6[0] || attr.rcs >= val6[1]) {
        return
      }
    }

    //Modify the filtered data to red
    if (!graphic.selected) {
      graphic.selected = true
      graphic.setStyle({
        color: "rgba(255,0,0,1.0)",
        outlineColor: "#FFFFFF"
      })
    }
    selCount++
  })

  globalMsg(`Among ${allCount} objects, ${selCount} meet the conditions`)
}

function getStatusName(code) {
  switch (code) {
    case "+":
      return "operational"
    case "-":
      return "not running"
    case "P":
      return "Partial operation, partial completion of primary or secondary tasks"
    case "B":
      return "Backup/Standby, the previously operating satellite enters reserve status"
    case "S":
      return "Standby, new satellite waiting for full activation"
    case "X":
      return "extended task"
    case "D":
      return "declining"
    case "?":
      return "unknown"
  }
  return code
}

function getLaunchSiteName(code) {
  switch (code) {
    case "AFETR":
      return "Air Force Eastern Proving Ground, Florida, USA"
    case "AFWTR":
      return "Air Force Western Proving Ground, California"
    case "CAS":
      return "Canaries Airspace"
    case "DLS":
      return "Russian Dombarovskiy launch site"
    case "ERAS":
      return "Eastern airspace range"
    case "FRGUI":
      return "European Spaceport in Kourou, French Guiana"
    case "HGSTR":
      return "Hammaguira Space Orbital Range, Algeria"
    case "JSC":
      return "China Jiuquan Space Center"
    case "KODAK":
      return "Kodiak Launch Center, Alaska, USA"
    case "KSCUT":
      return "Japan Uchiura Space Center"
    case "KWAJ":
      return "US Army Kwajalein Atoll"
    case "KYMSC":
      return "Russian Kapustin Yar missile and space complex"
    case "NSC":
      return "Korea Naro Space Center"
    case "PLMSC":
      return "Russian Plesetsk missile and space complex"
    case "RLLB":
      return "Rocket Lab Launch Base"
    case "SEAL":
      return "Sea launch platform (mobile)"
    case "SEMLS":
      return "Iran's Semnan Satellite Launch Site"
    case "SMTS":
      return "Iran's Shahrude Missile Test Site"
    case "SNMLP":
      return "Indian Ocean (Kenya) San Marco Launch Platform"
    case "SRILR":
      return "Sadish Dhawan Space Center, India"
    case "SUBL":
      return "Submarine launch platform (mobile)"
    case "SVOBO":
      return "Russian Svobodnyy Launch Center"
    case "TAISC":
      return "China Taiyuan Space Center"
    case "TANSC":
      return "Japan Tanegashima Space Center"
    case "TYMSC":
      return "Tyulatan Missile and Space Center of Kazakhstan"
    case "VOSTO":
      return "Russia's Vostochny Spacecraft Launch Site"
    case "WLPIS":
      return "Wallops Island, Virginia, United States"
    case "WOMRA":
      return "Australia Woomera"
    case "WRAS":
      return "Western airspace range"
    case "WSC":
      return "China Wenchang Satellite Launch Site"
    case "XICLF":
      return "Xichang Launch Site, China"
    case "YAVNE":
      return "Yavne Launch Facility, Israel"
    case "YUN":
      return "North Korea Unsong Launch Site"
    case "UNK":
      return "unknown"
  }
  return code
}

function getCountryName(code) {
  switch (code) {
    case "AB":
      return "Arab Satellite Communications Organization"
    case "ABS":
      return "Asia Broadcasting Satellite"
    case "AC":
      return "Asia Satellite Telecommunications Corporation"
    case "ALG":
      return "Algeria"
    case "ANG":
      return "Angola"
    case "ARGN":
      return "Argentina"
    case "ASRA":
      return "Austria"
    case "AUS":
      return "Australia"
    case "AZER":
      return "Azerbaijan"
    case "BEL":
      return "Belgium"
    case "BELA":
      return "Belarus"
    case "BERM":
      return "Bermuda"
    case "BGD":
      return "Bangladesh"
    case "BHUT":
      return "Kingdom of Bhutan"
    case "BOL":
      return "Bolivia"
    case "BRAZ":
      return "Brazil"
    case "BUL":
      return "Bulgaria"
    case "CA":
      return "Canada"
    case "CHBZ":
      return "China/Brazil"
    case "CHLE":
      return "Chile"
    case "CIS":
      return "former Soviet Union"
    case "COL":
      return "Colombia"
    case "CRI":
      return "Republic of Costa Rica"
    case "CZCH":
      return "Czech"
    case "DEN":
      return "Denmark"
    case "ECU":
      return "Ecuador"
    case "EGYP":
      return "Egypt"
    case "ESA":
      return "European Space Agency"
    case "ESRO":
      return "European Space Research Organization"
    case "EST":
      return "Estonia"
    case "EUME":
      return "European Organization for the Development of Meteorological Satellites"
    case "EUTE":
      return "Eutelsat"
    case "FGER":
      return "France/Germany"
    case "FIN":
      return "Finland"
    case "FR":
      return "France"
    case "FRIT":
      return "France/Italy"
    case "GER":
      return "Germany"
    case "GHA":
      return "Republic of Ghana"
    case "GLOB":
      return "Global Star"
    case "GREC":
      return "Greece"
    case "GRSA":
      return "Greece/Saudi Arabia"
    case "GUAT":
      return "Guatemala"
    case "HUN":
      return "Hungary"
    case "IM":
      return "INMARSAT"
    case "IND":
      return "India"
    case "INDO":
      return "Indonesia"
    case "IRAN":
      return "Iran"
    case "IRAQ":
      return "Iraq"
    case "IRID":
      return "IRID"
    case "ISRA":
      return "Israel"
    case "ISRO":
      return "Indian Space Research Organization"
    case "ISS":
      return "International Space Station"
    case "IT":
      return "Italy"
    case "ITSO":
      return "INTELSAT"
    case "JPN":
      return "Japan"
    case "KAZ":
      return "Kazakhstan"
    case "KEN":
      return "Kenya"
    case "LAOS":
      return "Laos"
    case "LKA":
      return "Sri Lanka"
    case "LTU":
      return "Lithuania"
    case "LUXE":
      return "Luxembourg"
    case "MA":
      return "Morocco"
    case "MALA":
      return "Malaysia"
    case "MEX":
      return "Mexico"
    case "MMR":
      return "Myanmar"
    case "MNG":
      return "Mongolia"
    case "MUS":
      return "Mauritius"
    case "NATO":
      return "NATO"
    case "NETH":
      return "Holland"
    case "NICO":
      return "new icon"
    case "NIG":
      return "Nigeria"
    case "NKOR":
      return "North Korea"
    case "NOR":
      return "Norway"
    case "NPL":
      return "Nepal"
    case "NZ":
      return "New Zealand"
    case "O3B":
      return "O3b Networks"
    case "ORB":
      return "ORBCOMM Satellite Corporation"
    case "PAKI":
      return "Pakistan"
    case "PERU":
      return "Peru"
    case "POL":
      return "Poland"
    case "POR":
      return "Portugal"
    case "PRC":
      return "China"
    case "PRY":
      return "Paraguay"
    case "PRES":
      return "China/European Space Agency"
    case "QAT":
      return "Qatar status"
    case "RASC":
      return "African Regional Satellite Communications Organization"
    case "ROC":
      return "Taiwan"
    case "ROM":
      return "Romania"
    case "RP":
      return "Philippines"
    case "RWA":
      return "Rwanda"
    case "SAFR":
      return "South Africa"
    case "SAUD":
      return "Saudi Arabia"
    case "SDN":
      return "Sudan"
    case "SEAL":
      return "Sea Launch Company"
    case "SES":
      return "SES Telecommunications Company"
    case "SGJP":
      return "Singapore/Japan"
    case "SING":
      return "Singapore"
    case "SKOR":
      return "Korea"
    case "SPN":
      return "Spain"
    case "STCT":
      return "Singapore/Taiwan"
    case "SVN":
      return "Slovenia"
    case "SWED":
      return "Sweden"
    case "SWTZ":
      return "Switzerland"
    case "TBD":
      return "to be determined"
    case "THAI":
      return "Thailand"
    case "TMMC":
      return "Turkmenistan/Monaco"
    case "TUN":
      return "Republic of Tunisia"
    case "TURK":
      return "Türkiye"
    case "UAE":
      return "United Arab Emirates"
    case "UK":
      return "UK"
    case "UKR":
      return "Ukraine"
    case "URY":
      return "Uruguay"
    case "US":
      return "United States"
    case "USBZ":
      return "United States/Brazil"
    case "VENZ":
      return "Venezuela"
    case "VTNM":
      return "Vietnam"
    case "UNK":
      return "unknown"
  }
  return code
}

// Clear the click event of the satellite and hide the satellite panel
function highlightSatellite() {
  lastSelectWX.remove()
  lastSelectWX = null
}
