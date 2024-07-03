/**
 * [Customized surface label] Closed surface
 * @param {object} options parameter object, including the following:
 * @param {LngLatPoint[]|Cesium.Cartesian3[]|Cesium.PositionProperty|Array} options.positions coordinate position
 * @param {PolygonEntity.StyleOptions} options.style style information
 * @param {object} [options.attr] The attribute information of the attachment. You can attach any attributes. The export will be automatically processed when exporting geojson or json.
 *
 * @param {number} [options.minPointNum=2] When drawing, at least the number of points required
 * @param {number} [options.maxPointNum=9999] When drawing, the maximum number of points allowed
 * @param {function} [options.validDrawPosition] When drawing, externally customized verification coordinates, such as determining whether to draw within a specified area.
 * @param {boolean} [options.hasEdit=true] Whether to allow editing
 * @param {boolean} [options.hasEditContextMenu=true] Whether to bind the right-click editing menu when editing
 * @param {boolean} [options.hasMoveEdit=true] Whether the overall translation can be performed during editing
 * @param {boolean} [options.hasHeightEdit=true] When editing, when there is diffHeight, whether the height can be edited
 *
 * @param {string|Array|Function} [options.popup] The bound popup value, which can also be bound using the bindPopup method.
 * @param {Popup.StyleOptions} [options.popupOptions] Configuration parameters for popup. It also supports {@link Popup} construction parameters such as pointerEvents.
 * @param {string|Array|Function} [options.tooltip] The bound tooltip pop-up value, which can also be bound by the bindTooltip method
 * @param {Tooltip.StyleOptions} [options.tooltipOptions] Configuration parameters when tooltip pops up. It also supports {@link Tooltip} construction parameters such as pointerEvents.
 * @param {object} [options.contextmenuItems] When the vector data supports the right-click menu, it can also be bound by the bindContextMenu method.
 *
 * @param {string|number} [options.id = createGuid()] vector data id identification
 * @param {string} [options.name = ''] Vector data name
 * @param {boolean} [options.show = true] Whether vector data is displayed
 * @param {BaseClass|boolean} [options.eventParent] The specified event bubbling object. The default is the added layer object. If false, the event will not bubble up.
 * @param {boolean|Function} [options.allowDrillPick] Whether to allow mouse penetration picking
 * @param {boolean} [options.flyTo] Whether to automatically fly to the area where the data is located after loading the data.
 * @param {object} [options.flyToOptions] Corresponding {@link BaseGraphic#flyTo} method parameters whether to automatically fly to the area where the data is located after loading the data.
 *
 * @class CloseVurveEntity
 * @extends {PolygonEntity}
 */
class CloseVurveEntity extends mars3d.graphic.PolygonEntity {
  constructor(options = {}) {
    super(options)

    // this._minPointNum = 3 // At least the number of points required
    // this._maxPointNum = 999 // The maximum number of points allowed
  }

  // Whether the ends are connected and closed (the line is not closed, the surface is closed), used to process intermediate points
  // get hasClosure() {
  //   return true
  // }

  getShowPositions(positions) {
    if (!positions || positions.length < 2) {
      return positions
    }
    return getCloseCurvePoints(positions, this.style) // Call algorithm
  }

  //= =================Static method==================

  // /**
  // * Calculate the boundary coordinate points of the current military standard object
  //  * @static
  // * @param {LngLatPoint[]|Cesium.Cartesian3[]|Cesium.PositionProperty|Array} positions coordinate positions
  // * @param {object} [options] Control parameters (reserved)
  // * @return {Cesium.Cartesian3[]} boundary coordinate point
  //  */
  // static getOutlinePositions(positions, options) {
  //   if (!positions || positions.length < 2) {
  //     return positions
  //   }
  //   positions = mars3d.LngLatArray.toCartesians(positions)
  // return getCloseCurvePoints(positions, options) // Call algorithm
  // }
}

// After registration, it can be used in graphicLayer.startDraw
mars3d.GraphicUtil.register("closeVurveEntity", CloseVurveEntity)

//= =========================== Main algorithm for closed surfaces================ ============
function getCloseCurvePoints(positions, options) {
  if (!positions || positions.length === 0) {
    return positions
  }

  const pnts = mars3d.PointTrans.cartesians2mercators(positions) // Cartesian coordinates to Mercator projection coordinates
  const maxHeight = getMaxHeight(pnts)
  pnts.push(pnts[0], pnts[1])

  let normals = []
  const pList = []
  for (let i = 0; i < pnts.length - 2; i++) {
    const normalPoints = getBisectorNormals(0.3, pnts[i], pnts[i + 1], pnts[i + 2])
    normals = normals.concat(normalPoints)
  }
  const count = normals.length
  normals = [normals[count - 1]].concat(normals.slice(0, count - 1))
  for (let _i = 0; _i < pnts.length - 2; _i++) {
    const pnt1 = pnts[_i]
    const pnt2 = pnts[_i + 1]
    pList.push(pnt1)
    for (let t = 0; t <= 100; t++) {
      const pnt = getCubicValue(t / 100, pnt1, normals[_i * 2], normals[_i * 2 + 1], pnt2)
      pList.push(pnt)
    }
    pList.push(pnt2)
  }

  const returnArr = mars3d.PointTrans.mercators2cartesians(pList, maxHeight) // Mercator projection coordinates to Cartesian coordinates
  return returnArr
}

function getMaxHeight(pnts) {
  let maxHeight = pnts[0][2] || 0
  for (let i = 0; i < pnts.length; i++) {
    if (pnts[2] > maxHeight) {
      maxHeight = pnts[2]
    }
  }
  return maxHeight
}

function getBisectorNormals(t, pnt1, pnt2, pnt3) {
  const normal = getNormal(pnt1, pnt2, pnt3)
  let bisectorNormalRight = null
  let bisectorNormalLeft = null
  let dt = null
  let x = null
  let y = null

  const dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
  const uX = normal[0] / dist
  const uY = normal[1] / dist
  const d1 = MathDistance(pnt1, pnt2)
  const d2 = MathDistance(pnt2, pnt3)
  if (dist > 0.0001) {
    if (isClockWise(pnt1, pnt2, pnt3)) {
      dt = t * d1
      x = pnt2[0] - dt * uY
      y = pnt2[1] + dt * uX
      bisectorNormalRight = [x, y]
      dt = t * d2
      x = pnt2[0] + dt * uY
      y = pnt2[1] - dt * uX
      bisectorNormalLeft = [x, y]
    } else {
      dt = t * d1
      x = pnt2[0] + dt * uY
      y = pnt2[1] - dt * uX
      bisectorNormalRight = [x, y]
      dt = t * d2
      x = pnt2[0] - dt * uY
      y = pnt2[1] + dt * uX
      bisectorNormalLeft = [x, y]
    }
  } else {
    x = pnt2[0] + t * (pnt1[0] - pnt2[0])
    y = pnt2[1] + t * (pnt1[1] - pnt2[1])
    bisectorNormalRight = [x, y]
    x = pnt2[0] + t * (pnt3[0] - pnt2[0])
    y = pnt2[1] + t * (pnt3[1] - pnt2[1])
    bisectorNormalLeft = [x, y]
  }
  return [bisectorNormalRight, bisectorNormalLeft]
}

function getNormal(pnt1, pnt2, pnt3) {
  let dX1 = pnt1[0] - pnt2[0]
  let dY1 = pnt1[1] - pnt2[1]
  const d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1)
  dX1 /= d1
  dY1 /= d1
  let dX2 = pnt3[0] - pnt2[0]
  let dY2 = pnt3[1] - pnt2[1]
  const d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2)
  dX2 /= d2
  dY2 /= d2
  const uX = dX1 + dX2
  const uY = dY1 + dY2
  return [uX, uY]
}

function MathDistance(pnt1, pnt2) {
  return Math.sqrt(Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2))
}

// Calculate points on closed surface
function isClockWise(pnt1, pnt2, pnt3) {
  if (!pnt3) {
    return false
  }
  return (pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0])
}

function getCubicValue(t, startPnt, cPnt1, cPnt2, endPnt) {
  t = Math.max(Math.min(t, 1), 0)
  const tp = 1 - t
  const t2 = t * t

  const t3 = t2 * t
  const tp2 = tp * tp
  const tp3 = tp2 * tp
  const x = tp3 * startPnt[0] + 3 * tp2 * t * cPnt1[0] + 3 * tp * t2 * cPnt2[0] + t3 * endPnt[0]
  const y = tp3 * startPnt[1] + 3 * tp2 * t * cPnt1[1] + 3 * tp * t2 * cPnt2[1] + t3 * endPnt[1]
  return [x, y]
}
