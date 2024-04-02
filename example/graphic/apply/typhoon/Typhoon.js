/**
 * Single typhoon object
 * @class Typhoon
 */
class Typhoon {
  //= ========= Constructor ==========
  constructor(options, map) {
    this.options = options
    this.map = map

    //Create typhoon-related vector layers
    this.typhoonLayer = new mars3d.layer.GraphicLayer()
    map.addLayer(this.typhoonLayer)

    this.clickPtLayer = new mars3d.layer.GraphicLayer()
    map.addLayer(this.clickPtLayer)
    this.showTyphoonToMap(options.path)
  }

  //= ========= External properties ==========
  // show hide
  get show() {
    return this.options.show
  }

  set show(val) {
    this.options.show = val
    this.typhoonLayer.show = val
    this.clickPtLayer.show = val
  }

  getPointById(id) {
    return this.typhoonLayer.getGraphicById(id)
  }

  flyTo(options) {
    this.typhoonLayer.flyTo(options)
  }

  getPointTooltip(event, isYB) {
    const item = event.graphic?.attr
    if (!item) {
      return
    }

    let ybHtml = ""
    if (isYB) {
      ybHtml = `<p>Forecasting agency: Central Meteorological Observatory</p>`
    }

    let fqHtml = '<table style="width:100%">'
    if (item.circle7) {
      fqHtml += `<tr><th>Wind circle radius</th> <th>Northeast</th> <th>Southeast</th> <th>Southwest</th> <th>Northwest</th>< /tr>
                <tr><td>Level 7</td> <td>${item.circle7.radius1}</td> <td>${item.circle7.radius2}</td> <td>${item.circle7 .radius3}</td> <td>${item.circle7.radius4} (KM)</td></tr> `
      if (item.circle10) {
        fqHtml += ` <tr><td>Level Ten</td> <td>${item.circle10.radius1}</td> <td>${item.circle10.radius2}</td> <td>$ {item.circle10.radius3}</td> <td>${item.circle10.radius4} (KM)</td></tr>`
        if (item.circle12) {
          fqHtml += `<tr><td>Level 12</td> <td>${item.circle12.radius1}</td> <td>${item.circle12.radius2}</td> <td> ${item.circle12.radius3}</td> <td>${item.circle12.radius4} (KM)</td></tr>`
        }
      }
    }
    fqHtml += "</table>"

    return `<div class="tipBox">
              <div class="triangle-left"></div>
              <div class="tipHeader">
                <p>${this.options.typnumber} ${this.options.name_cn}</p>
              </div>
                <div class="tipBodyFirstPart">
                  ${ybHtml}
                  <p>Past time: ${item.time_str}</p>
                  <p>Center position: ${item.lat}N/${item.lon}E</p>
                  <p>Maximum wind speed: ${item.centerSpeed} meters/second</p>
                  <p>Center air pressure: ${item.strength}hPa</p>
                  <p>Moving direction: ${item.moveTo_str}</p>
                  <p>Moving speed: ${item.windSpeed}km/h</p>
                </div>
                <div class="tipBodySecondPart">${fqHtml}</div>
          </div>`
  }

  addNameGraphic(firstItem) {
    // [Start point] Draw the name of the typhoon starting point
    const nameGraphic = new mars3d.graphic.RectanglePrimitive({
      positions: [
        [firstItem.lon, firstItem.lat],
        [firstItem.lon + 0.7, firstItem.lat - 0.4]
      ],
      style: {
        materialType: mars3d.MaterialType.Text,
        materialOptions: {
          text: this.options.name_cn,
          font_size: 60,
          fillColor: "red"
        },
        zIndex: 2
      },
      attr: firstItem
    })
    this.typhoonLayer.addGraphic(nameGraphic)
  }

  // Draw a typhoon on the map
  showTyphoonToMap(arr) {
    if (arr.length < 1) {
      return
    }

    const firstItem = arr[0]
    const endItem = arr[arr.length - 1]

    let lastType
    let arrPoint = []
    // waypoint
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i]
      const point = [item.lon, item.lat]

      // Draw all points on the layer
      const pointEntity = new mars3d.graphic.PointEntity({
        id: item.id,
        position: point,
        style: {
          pixelSize: 6,
          color: item.color
        },
        attr: item
      })
      this.typhoonLayer.addGraphic(pointEntity)

      // Bind the track point to the click event
      pointEntity.on(mars3d.EventType.click, (event) => {
        this.showPointFQ(event.graphic.attr)
      })
      pointEntity.bindTooltip(
        (event) => {
          return this.getPointTooltip(event)
        },
        {
          template: "",
          anchor: [260, -20]
        }
      )

      arrPoint.push(point)

      // Determine the typlevel of typhoon
      if (lastType !== item.level || i === len - 1) {
        // draw line
        const graphicLine = new mars3d.graphic.PolylineEntity({
          positions: arrPoint,
          style: {
            color: getColor(lastType)
          }
        })
        this.typhoonLayer.addGraphic(graphicLine)

        lastType = item.level
        arrPoint = [point]
      }
    }

    // [Start point] Draw the name of the typhoon starting point
    this.addNameGraphic(firstItem)

    // [End point] Draw the gif point of the current position of the typhoon
    const gifGraphic = new mars3d.graphic.DivGraphic({
      position: [endItem.lon, endItem.lat],
      style: {
        html: `<img src="img/icon/typhoon.gif">`,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER
      }
    })
    this.typhoonLayer.addGraphic(gifGraphic)
    this.gifGraphic = gifGraphic

    //Display the corresponding wind circle, etc. of the last point.
    this.showPointFQ(endItem)
  }

  //Click event, click to display the typhoon icon
  showPointFQ(item, availability) {
    if (!availability) {
      this.clickPtLayer.clear()
    }

    const position = [item.lon, item.lat]

    // Typhoon real-time location gif point update
    if (this.gifGraphic) {
      this.gifGraphic.position = position
    }

    //Draw the level 7 wind circle surface
    if (item.circle7) {
      let points7 = []
      points7 = points7.concat(getPoints(position, item.circle7.radius1, 0)) // Northeast direction
      points7 = points7.concat(getPoints(position, item.circle7.radius2, 90)) // Southeast
      points7 = points7.concat(getPoints(position, item.circle7.radius3, 180)) // Southwest
      points7 = points7.concat(getPoints(position, item.circle7.radius4, 270)) // Northwest

      const graphic = new mars3d.graphic.PolygonEntity({
        positions: points7,
        availability,
        style: {
          setHeight: 900,
          color: "#eed139",
          opacity: 0.3,
          outline: true,
          outlineWidth: 2,
          outlineColor: "#eed139"
        }
      })
      this.clickPtLayer.addGraphic(graphic)
    }

    //Draw the level 10 wind circle surface
    if (item.circle10) {
      let points10 = []
      points10 = points10.concat(getPoints(position, item.circle10.radius1, 0)) // Northeast direction
      points10 = points10.concat(getPoints(position, item.circle10.radius2, 90))
      points10 = points10.concat(getPoints(position, item.circle10.radius3, 180))
      points10 = points10.concat(getPoints(position, item.circle10.radius4, 270))

      const tenGraphic = new mars3d.graphic.PolygonEntity({
        positions: points10,
        availability,
        style: {
          setHeight: 800,
          color: "#fe9c45",
          opacity: 0.3,
          outline: true,
          outlineWidth: 2,
          outlineColor: "#fe9c45",
          arcType: Cesium.ArcType.GEODESIC
        }
      })
      this.clickPtLayer.addGraphic(tenGraphic)
    }

    //Draw 12-level wind circle surface
    if (item.circle12) {
      let points12 = []
      points12 = points12.concat(getPoints(position, item.circle12.radius1, 0)) // Northeast direction
      points12 = points12.concat(getPoints(position, item.circle12.radius2, 90))
      points12 = points12.concat(getPoints(position, item.circle12.radius3, 180))
      points12 = points12.concat(getPoints(position, item.circle12.radius4, 270))

      const tenGraphic = new mars3d.graphic.PolygonEntity({
        positions: points12,
        availability,
        style: {
          setHeight: 700,
          color: "#ffff00",
          opacity: 0.3,
          outline: true,
          outlineWidth: 2,
          outlineColor: "#ffff00",
          arcType: Cesium.ArcType.GEODESIC
        }
      })
      this.clickPtLayer.addGraphic(tenGraphic)
    }

    //Typhoon prediction path drawing
    if (item.forecast) {
      const linePoint = [position]
      item.forecast.forEach((element) => {
        const forecastPt = [element.lon, element.lat]
        linePoint.push(forecastPt)

        // Draw all points on the layer
        const pointEntity = new mars3d.graphic.PointEntity({
          position: forecastPt,
          availability,
          style: {
            pixelSize: 6,
            color: element.color, // Different typlevel displays different colors
            opacity: 0.8
          },
          attr: item
        })
        this.clickPtLayer.addGraphic(pointEntity)

        pointEntity.bindTooltip(
          (event) => {
            return this.getPointTooltip(event, true)
          },
          {
            template: "",
            anchor: [260, -20]
          }
        )

        // Predict route
        const graphicLine = new mars3d.graphic.PolylineEntity({
          positions: linePoint,
          availability,
          style: {
            materialType: mars3d.MaterialType.PolylineDash,
            materialOptions: {
              dashLength: 20.0,
              color: "red"
            }
          }
        })
        this.clickPtLayer.addGraphic(graphicLine)
      })
    }
  }

  // freed
  destroy() {
    this.show = false

    if (this.typhoonLayer) {
      this.typhoonLayer.destroy()
      delete this.typhoonLayer
    }
    if (this.clickPtLayer) {
      this.clickPtLayer.destroy()
      delete this.clickPtLayer
    }
  }
}

/**
 * Dynamic playback of a single typhoon object
 * @class PlayTyphoon
 */
class PlayTyphoon extends Typhoon {
  //= ========= External properties ==========
  // show hide
  get isStart() {
    return this._isStart
  }

  set isStart(val) {
    this._isStart = val
  }

  //Draw an object corresponding to the typhoon.
  showTyphoonToMap(arr) {
    if (arr.length < 1) {
      return
    }

    const firstItem = arr[0]
    const endItem = arr[arr.length - 1]

    this.startTime = Cesium.JulianDate.fromDate(firstItem.time) //Start time
    this.stopTime = Cesium.JulianDate.fromDate(endItem.time) //End time

    let lastType = arr[0].level
    let property = new Cesium.SampledPositionProperty()
    property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i]
      const point = [item.lon, item.lat]

      const position = Cesium.Cartesian3.fromDegrees(item.lon, item.lat) // Longitude and latitude coordinate conversion
      const pointTime = Cesium.JulianDate.fromDate(item.time) //Convert the time into the required format

      property.addSample(pointTime, position)

      // draw points
      const pointEntity = new mars3d.graphic.PointEntity({
        id: item.id,
        position: point,
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: pointTime,
            stop: this.stopTime
          })
        ]),
        style: {
          pixelSize: 6,
          color: item.color
        },
        attr: item
      })
      pointEntity.bindTooltip(
        (event) => {
          return this.getPointTooltip(event)
        },
        {
          template: "",
          anchor: [260, -20]
        }
      )
      this.typhoonLayer.addGraphic(pointEntity)

      if (lastType !== item.level || i === len - 1) {
        // draw line
        const graphicLine = new mars3d.graphic.PathEntity({
          position: property,
          style: {
            leadTime: 0,
            color: getColor(lastType)
          }
        })
        this.typhoonLayer.addGraphic(graphicLine)

        lastType = item.level
        property = new Cesium.SampledPositionProperty() // Object that controls animation playback
        property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD
        property.addSample(pointTime, position)
      }

      //Display the wind circle and predicted route for each point
      let lastTime
      if (i === len - 1) {
        lastTime = this.lastTime
      } else {
        lastTime = Cesium.JulianDate.fromDate(arr[i + 1].time)
      }

      const availability = new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: pointTime,
          stop: lastTime
        })
      ])
      this.showPointFQ(item, availability)
    }

    // [Start point] Draw the name of the typhoon starting point
    this.addNameGraphic(firstItem)
  }

  // Start playing
  start() {
    this._isStart = true

    this.map.clock.startTime = this.startTime.clone()
    this.map.clock.stopTime = this.stopTime.clone()
    this.map.clock.currentTime = this.startTime.clone()
    this.map.clock.clockRange = Cesium.ClockRange.CLAMPED // Terminate after reaching the time point
    this.map.clock.multiplier = 16000

    if (this.map.controls.timeline) {
      this.map.controls.timeline.zoomTo(this.startTime, this.stopTime)
    }

    this.show = true
    this.map.clock.shouldAnimate = true
  }

  // Stop play
  stop() {
    this._isStart = false

    this.show = false

    const now = Cesium.JulianDate.fromDate(new Date())
    this.map.clock.startTime = now.clone()
    this.map.clock.stopTime = Cesium.JulianDate.addDays(now, 1.0, new Cesium.JulianDate())
    this.map.clock.currentTime = now.clone()
    this.map.clock.clockRange = Cesium.ClockRange.UNBOUNDED
    this.map.clock.multiplier = 1
  }
}

// Typhoons of different levels correspond to different colors
function getColor(level) {
  switch (level) {
    case "TD": // tropical depression
      return "rgb(238,209,57)"
    case "TS": // tropical storm
      return "rgb(0,0,255)"
    case "STS": // severe tropical storm
      return "rgb(15,128,0)"
    case "TY": // Typhoon
      return "rgb(254,156,69)"
    case "STY": // Strong typhoon
      return "rgb(254,0,254)"
    case "SuperTY": // super typhoon
      return "rgb(254,0,0)"
    default:
  }
}

// Calculation method based on longitude, latitude, diameter and direction
function getPoints(center, cradius, startAngle) {
  const points = []
  const radius = cradius / 100
  const pointNum = 90
  const endAngle = startAngle + 90
  let sin, cos, x, y, angle
  for (let i = 0; i <= pointNum; i++) {
    angle = startAngle + ((endAngle - startAngle) * i) / pointNum
    sin = Math.sin((angle * Math.PI) / 180)
    cos = Math.cos((angle * Math.PI) / 180)
    x = center[0] + radius * sin
    y = center[1] + radius * cos
    points.push([x, y])
  }
  return points
}
