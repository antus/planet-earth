"use script" // It is recommended to turn on strict mode in the development environment

const url = "https://api.waqi.info/mapq/bounds/?bounds={RECTANGLE}&inc=placeholders&k={KEY}&_={DATA}"
const table = [
  {
    level: "First level (excellent)",
    influence: "The air quality is satisfactory and there is basically no air pollution",
    suggestion: "All types of people can move around normally"
  },
  {
    level: "Level 2 (Good)",
    influence: "Air quality is acceptable, but some pollutants may have a weak impact on the health of a very small number of extremely sensitive people",
    suggestion: "Patients with heart disease and lung disease have significantly aggravated symptoms and reduced exercise tolerance, and symptoms are common in healthy people"
  },
  {
    level: "Level 3 (mild pollution)",
    influence: "Susceptible people have mildly aggravated symptoms, and healthy people have irritating symptoms",
    suggestion: "Children, the elderly and patients with heart disease and respiratory diseases should reduce long-term, high-intensity outdoor exercise"
  },
  {
    level: "Level 4 (moderate pollution)",
    influence: "Susceptible people have mildly aggravated symptoms, and healthy people have irritating symptoms",
    suggestion: "Children, the elderly and patients with heart disease and respiratory diseases should avoid long-term, high-intensity outdoor exercise. The general population should reduce outdoor exercise appropriately."
  },
  {
    level: "Level 5 (severe pollution)",
    influence: "Patients with heart disease and lung disease have significantly aggravated symptoms and reduced exercise tolerance, and symptoms are common in healthy people",
    suggestion: "Children, the elderly and patients with heart disease and lung disease should stay indoors and stop outdoor exercise. The general population should reduce outdoor exercise."
  },
  {
    level: "Level 6 (serious pollution)",
    influence: "Patients with heart disease and lung disease have significantly aggravated symptoms and reduced exercise tolerance, and symptoms are common in healthy people",
    suggestion: "Children, the elderly and the sick should stay indoors and avoid physical exertion, and the general population should avoid outdoor activities"
  }
]

let xmlHttpRequest
const nWidth = 500
let currTime

onmessage = function (e) {
  const bounds = e.data.bounds
  currTime = new Date().getTime()

  const strKey = jskey()
  const nowUrl = url.replace("{RECTANGLE}", bounds).replace("{KEY}", strKey).replace("{DATA}", currTime)

  xmlHttpRequest = new XMLHttpRequest()

  // 2. Set the callback function
  xmlHttpRequest.onreadystatechange = callback

  // 3. Initialize XMLHttpRequest construction
  xmlHttpRequest.open("POST", nowUrl, true)

  // 4.Send request
  xmlHttpRequest.send()
}

function callback() {
  if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
    const entityTable = []
    /// /////////////////////////////////////////////////
    const currentData = JSON.parse(xmlHttpRequest.responseText)
    for (let i = currentData.length - 1; i >= 0; i--) {
      const item = currentData[i]
      let aqi = parseInt(item.aqi)
      if (!isNumber(aqi)) {
        continue
      }

      let level = 0
      if (aqi > nWidth) {
        level = 5
        aqi = nWidth - 1
      } else {
        if (aqi > 300) {
          level = 5
        } else if (aqi > 200) {
          level = 4
        } else if (aqi > 150) {
          level = 3
        } else if (aqi > 100) {
          level = 2
        } else if (aqi > 50) {
          level = 1
        }
      }

      const newItem = {
        ...item,
        aqi,
        level: table[level].level,
        influence: table[level].influence,
        suggestion: table[level].suggestion
      }
      entityTable.push(newItem)
    }
    /// ///////////////////////////////////////////////////
    // self represents the sub-thread itself
    self.postMessage({ currTime, entityTable })
    self.close()
  } else if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 0) {
    self.postMessage({ currTime, entityTable: [] })
    self.close()
  }
}

function isNumber(obj) {
  return typeof obj === "number" && !isNaN(obj)
}

function jskey() {
  return (function () {
    let u = ""
    decodeURIComponent("%603Z3F%7BWS%3A3BSBdIRlJTySXYnmecFR%2CF%7BeSGHhkMh%3E%3E")
      .split("")
      .forEach(function (c) {
        u += String.fromCharCode(c.charCodeAt(0) - 1)
      })
    return u
  })()
}
