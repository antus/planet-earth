/**
 * [Customized linear label] Curve
 *
 * @param {object} options parameter object, including the following:
 * @param {LngLatPoint[]|Cesium.Cartesian3[]|Cesium.PositionProperty|Array} options.positions coordinate position
 * @param {PolylineEntity.StyleOptions} options.style style information
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
 * @class CurveEntity
 * @extends {PolylineEntity}
 * @see [Supported event types]{@link BaseGraphic.EventType}
 */
class CurveEntity extends mars3d.graphic.PolylineEntity {
  constructor(options = {}) {
    super(options)

    // this._minPointNum = 2 // At least the number of points required
    // this._maxPointNum = 999 // The maximum number of points allowed
  }

  /**
   * Edit processing class
   * @readonly
   */
  get EditClass() {
    // eslint-disable-next-line no-undef
    return EditCurve
  }

  getShowPositions(positions) {
    if (!positions || positions.length < 2) {
      return positions
    }
    return getBezierCurvePoints(positions, this.style)
  }
}

// After registration, it can be used in graphicLayer.startDraw
mars3d.GraphicUtil.register("curveEntity", CurveEntity)

//= =========================== Main algorithm for closed surfaces================ ============
function getBezierCurvePoints(positions, options) {
  if (!positions || positions.length < 3) {
    return positions
  }

  const coordinates = mars3d.LngLatArray.toArray(positions)
  if (options?.closure) {
    coordinates.push(coordinates[0]) // Closed curve
  }
  const defHeight = coordinates[coordinates.length - 1][2]

  const curved = turf.bezierSpline(
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates
      }
    },
    {
      resolution: options?.resolution ?? 10000,
      sharpness: options?.sharpness ?? 0.85
    }
  )
  const result = mars3d.PointTrans.lonlats2cartesians(curved.geometry.coordinates, defHeight)
  if (options?.closure) {
    result.push(result[0])
  }
  return result
}
