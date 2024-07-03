// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
let polygonLayer
let graphicLayer

var mapOptions = {
  scene: {
    center: { lat: 31.855058, lng: 117.312337, alt: 79936, heading: 0, pitch: -90 }
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

  //Load surface data
  loadPolygon()

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}
function clearGraphicLayer() {
  graphicLayer.clear()
}

// draw line
function drawLine() {
  clearGraphicLayer()

  graphicLayer.startDraw({
    type: "polyline",
    maxPointNum: 2,
    style: {
      color: "#55ff33",
      width: 3
    },
    success: (graphic) => {
      const clipLine = graphic.toGeoJSON()
      clipAllPolygon(clipLine)

      graphic.remove()
    }
  })
}

//Load surface data
function loadPolygon() {
  polygonLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(polygonLayer)

  const postionArr = [
    {
      postions: [
        [117.21983, 31.780687],
        [117.179661, 31.745352],
        [117.201462, 31.727826],
        [117.258453, 31.727534],
        [117.27459, 31.757619],
        [117.270985, 31.775139],
        [117.26738, 31.774701],
        [117.259827, 31.783752],
        [117.21983, 31.780687]
      ]
    },
    {
      postions: [
        [117.490393, 31.88435],
        [117.596823, 31.895413],
        [117.626349, 31.784167],
        [117.449369, 31.775197],
        [117.490393, 31.88435]
      ]
    },

    {
      postions: [
        [117.250042, 31.954209],
        [117.273903, 31.970234],
        [117.306862, 31.957994],
        [117.303772, 31.912971],
        [117.293816, 31.901294],
        [117.269611, 31.900128],
        [117.250042, 31.954209]
      ]
    },
    {
      postions: [
        [117.168674, 31.964546],
        [117.202492, 31.926669],
        [117.132111, 31.923592],
        [117.125759, 31.95099],
        [117.168674, 31.964546]
      ]
    }
  ]

  for (let i = 0; i < postionArr.length; i++) {
    const polygonGraphic = new mars3d.graphic.PolygonEntity({
      positions: [postionArr[i].postions],
      style: {
        color: "#00ffff",
        opacity: 0.2,
        clampToGround: true
      }
    })
    polygonLayer.addGraphic(polygonGraphic)
  }
}

// Loop through all surfaces and determine the intersecting surfaces to be cut.
function clipAllPolygon(clipLine) {
  polygonLayer.eachGraphic(function (graphic) {
    try {
      const clippedPolygon = geoUtil.polygonClipByLine(graphic.toGeoJSON(), clipLine)

      graphicLayer.loadGeoJSON(clippedPolygon, {
        style: {
          randomColor: true,
          opacity: 0.5,
          outline: true,
          outlineWidth: 2,
          outlineColor: "#ffffff",
          clampToGround: true
        }
      })
    } catch (error) {
      // globalMsg('<div style="color:#ff0000;">' + error.state + ":</br>" + error.message + "</div>");S
    }
  })
}

/**
 * geoJson data processing module (turf.js needs to be introduced)
 * Input and output data are in standard geoJson format
 */
const geoUtil = {
  // Merge polygons
  unionPolygon: function (polygons) {
    let polygon = polygons[0]
    for (let i = 0; i < polygons.length; i++) {
      polygon = turf.union(polygon, polygons[i])
    }
    return polygon
  },

  /**
   * Line dividing surface
   * The surface type can only be polygon but can be a ring
   * Note: The line and the polygon must have two intersection points
   */
  polygonClipByLine: function (polygon, clipLine) {
    if (polygon.geometry.type === "Polygon") {
      const polyLine = turf.polygonToLine(polygon)
      if (polyLine.geometry.type === "LineString") {
        // Cut ordinary polygons
        return this._singlePolygonClip(polyLine, clipLine)
      } else if (polyLine.geometry.type === "MultiLineString") {
        // cutting ring
        return this._multiPolygonClip(polyLine, clipLine)
      }
    } else if (polygon.geometry.type === "MultiPolygon") {
      // If the input polygon type is Multipolygon, split it into multiple Polygons
      const polygons = this.multiPolygon2polygons(polygon)
      let clipPolygon = null
      let clipPolygonIndex = -1
      // Get the polygon that intersects the cutting line in MultiPolygon (there can be only one polygon that intersects 2 intersection points)
      polygons.forEach(function (polygon, index) {
        const polyLine = turf.polygonToLine(polygon)
        if (turf.lineIntersect(polyLine, clipLine).features.length === 2) {
          if (!clipPolygon) {
            clipPolygon = polygon
            clipPolygonIndex = index
          } else {
            throw new Error({ state: "Cutting failed", message: "MultiPolygon can only have one polygon that intersects with the cutting line" })
          }
        }
      })
      if (clipPolygonIndex !== -1) {
        polygons.splice(clipPolygonIndex, 1)
        return turf.featureCollection(polygons.concat(this.polygonClipByLine(clipPolygon, clipLine).features))
      } else {
        throw new Error({ state: "Cutting failed", message: "MultiPolygon has no intersection with the cutting line" })
      }
    } else {
      throw new Error({ state: "Cutting failed", message: "The input polygon type is wrong" })
    }
  },

  _singlePolygonClip: function (polyLine, clipLine) {
    // Get the cutting point
    const intersects = turf.lineIntersect(polyLine, clipLine)
    if (intersects.features.length !== 2) {
      throw new Error({ state: "Cutting failed", message: "The intersection points between the cutting line and the polygon should be 2, and the current number of intersection points is" + intersects.features.length })
    }
    // Check the positional relationship between the cutting line and the polygon (the starting point and end point of the cutting line cannot fall inside the polygon)
    const clipLineLength = clipLine.geometry.coordinates.length
    const clipLineStartPoint = turf.point(clipLine.geometry.coordinates[0])
    const clipLineEndPoint = turf.point(clipLine.geometry.coordinates[clipLineLength - 1])
    const polygon = turf.polygon([polyLine.geometry.coordinates])
    if (turf.booleanPointInPolygon(clipLineStartPoint, polygon) || turf.booleanPointInPolygon(clipLineEndPoint, polygon)) {
      throw new Error({ state: "Cut failed", message: "The starting point or end point of the cutting line cannot be inside the clipping polygon" })
    }
    // Split the polygon by cutting points (only part of the polygon can be obtained)
    const slicedPolyLine = turf.lineSlice(intersects.features[0], intersects.features[1], polyLine)
    //Cut line segmentation to retain the internal parts of the polygon
    const slicedClipLine = turf.lineSlice(intersects.features[0], intersects.features[1], clipLine)
    // Re-splicing polygons has a docking problem, so we need to judge first how to connect the clipped polygons and clipping lines.
    const resultPolyline1 = this.connectLine(slicedPolyLine, slicedClipLine)
    // Close the line to construct the polygon
    resultPolyline1.geometry.coordinates.push(resultPolyline1.geometry.coordinates[0])
    const resultPolygon1 = turf.lineToPolygon(resultPolyline1)
    //Construct the polygon on the other side of the cut
    const firstPointOnLine = this.isOnLine(turf.point(polyLine.geometry.coordinates[0]), slicedPolyLine)
    const pointList = []
    if (firstPointOnLine) {
      for (let i = 0; i < polyLine.geometry.coordinates.length; i++) {
        const coordinate = polyLine.geometry.coordinates[i]
        if (!this.isOnLine(turf.point(coordinate), slicedPolyLine)) {
          pointList.push(coordinate)
        }
      }
    } else {
      let skipNum = 0 //Record the number of previously skipped points
      let isStartPush = false
      for (let i = 0; i < polyLine.geometry.coordinates.length; i++) {
        const coordinate = polyLine.geometry.coordinates[i]
        if (!this.isOnLine(turf.point(coordinate), slicedPolyLine)) {
          if (isStartPush) {
            pointList.push(coordinate)
          } else {
            skipNum++
          }
        } else {
          isStartPush = true
        }
      }
      //Add previously skipped points to the point array
      for (let i = 0; i < skipNum; i++) {
        pointList.push(polyLine.geometry.coordinates[i])
      }
    }
    const slicedPolyLine_2 = turf.lineString(pointList)
    const resultPolyline2 = this.connectLine(slicedPolyLine_2, slicedClipLine)
    // Close the line to construct the polygon
    resultPolyline2.geometry.coordinates.push(resultPolyline2.geometry.coordinates[0])
    const resultPolygon2 = turf.lineToPolygon(resultPolyline2)
    // Return the polygon feature set
    return turf.featureCollection([resultPolygon1, resultPolygon2])
  },

  _multiPolygonClip: function (polyLine, clipLine) {
    // Split the ring polygon into inner counterclockwise polygon + outer polygon
    let outPolyline
    const insidePolylineList = []
    for (let i = 0; i < polyLine.geometry.coordinates.length; i++) {
      const splitPolyline = turf.lineString(polyLine.geometry.coordinates[i])
      if (turf.booleanClockwise(splitPolyline)) {
        if (outPolyline) {
          throw new Error({ state: "Cutting failed", message: "Two external polygons appeared and cannot be processed" })
        } else {
          outPolyline = splitPolyline
        }
      } else {
        const intersects = turf.lineIntersect(splitPolyline, clipLine)
        if (intersects.features.length > 0) {
          throw new Error({ state: "Cutting failed", message: "The cutting line cannot intersect with the inner ring" })
        }
        insidePolylineList.push(splitPolyline)
      }
    }
    const resultCollection = this._singlePolygonClip(outPolyline, clipLine)

    for (let i = 0; i < resultCollection.features.length; i++) {
      for (let j = 0; j < insidePolylineList.length; j++) {
        const startPoint = turf.point(insidePolylineList[j].geometry.coordinates[0])
        if (turf.booleanPointInPolygon(startPoint, resultCollection.features[i])) {
          resultCollection.features[i] = turf.mask(resultCollection.features[i], turf.lineToPolygon(insidePolylineList[j]))
        }
      }
    }
    return resultCollection
  },

  /**
   * Connect two lines
   * This method will directly connect the nearest segment of the two line segments.
   */
  connectLine: function (line1, line2) {
    const line2_length = line2.geometry.coordinates.length
    const line1_startPoint = line1.geometry.coordinates[0]
    const line2_startPoint = line2.geometry.coordinates[0]
    const line2_endPoint = line2.geometry.coordinates[line2_length - 1]
    const pointList = []
    // Get the coordinates of all points in line1
    for (let i = 0; i < line1.geometry.coordinates.length; i++) {
      const coordinate = line1.geometry.coordinates[i]
      pointList.push(coordinate)
    }

    // Determine whether the starting points of the two lines are close. If they are close, reverse the line2 line to connect.
    if (turf.distance(line1_startPoint, line2_startPoint) < turf.distance(line1_startPoint, line2_endPoint)) {
      line2.geometry.coordinates = line2.geometry.coordinates.reverse()
    }
    for (let i = 0; i < line2.geometry.coordinates.length; i++) {
      const coordinate = line2.geometry.coordinates[i]
      pointList.push(coordinate)
    }
    return turf.lineString(pointList)
  },

  /**
   * Determine whether the point is online
   * Note: Comparison of coordinates composed of lines
   */
  isOnLine: function (point, line) {
    for (let i = 0; i < line.geometry.coordinates.length; i++) {
      const coordinate = line.geometry.coordinates[i]
      if (point.geometry.coordinates[0] === coordinate[0] && point.geometry.coordinates[1] === coordinate[1]) {
        return true
      }
    }
    return false
  },

  /**
   * Get the intersection point of two lines
   */
  getIntersectPoints: function (line1, line2) {
    return turf.lineIntersect(line1, line2)
  },

  // convert multiPolygon to polygons, no attributes are involved
  multiPolygon2polygons: function (multiPolygon) {
    if (multiPolygon.geometry.type !== "MultiPolygon") {
      return
    }
    const polygons = []
    multiPolygon.geometry.coordinates.forEach((item) => {
      const polygon = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: []
        }
      }
      polygon.geometry.coordinates = item
      polygons.push(polygon)
    })
    return polygons
  },

  /**
   * Convert polygons to multiPolygon, no attributes are involved, only the output attributes are {}
   * Consider the multi-faceted situation in polygons
   */
  polygons2MultiPolygon: function (geoJson) {
    const newGeoJson = {
      type: "FeatureCollection",
      features: [{ geometry: { coordinates: [], type: "MultiPolygon" }, type: "Feature", properties: {} }]
    }
    geoJson.features.forEach((item) => {
      if (item.geometry.type === "Polygon") {
        newGeoJson.features[0].geometry.coordinates.push(item.geometry.coordinates)
      } else {
        item.geometry.coordinates.forEach((item) => {
          newGeoJson.features[0].geometry.coordinates.push(item)
        })
      }
    })
    return newGeoJson
  }
}
