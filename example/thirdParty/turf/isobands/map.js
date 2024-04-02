// import * as mars3d from "mars3d"

var map // mars3d.Map three-dimensional map object
var mapOptions = {
  scene: {
    center: { lat: 23.359088, lng: 116.19963, alt: 1262727, heading: 2, pitch: -60 }
  },
  layers: []
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} None
 */
function onMounted(mapInstance) {
  map = mapInstance // record map

  map.imageryLayers._layers.forEach(function (layer, index, arr) {
    layer.brightness = 0.4
  })

  //Load weather
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/windpoint.json" })
    .then(function (res) {
      showWindLine(res.data)
    })
    .catch(function (error) {
      console.log("Error loading JSON", error)
    })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} None
 */
function onUnmounted() {
  map = null
}

const colors = ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"]
const breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 99] // Series of isosurfaces

//Contour surface
function showWindLine(arr) {
  const pointGrid = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    pointGrid.push({
      type: "Feature",
      properties: item,
      geometry: {
        type: "Point",
        coordinates: [item.x, item.y]
      }
    })
  }

  const points = {
    type: "FeatureCollection",
    features: pointGrid
  }

  // If it is not shown below, it may be that the data accuracy is not enough. You can uncomment the following and interpolate the data.
  // turf.interpolate() provides a method to interpolate data into grid points based on the IDW (inverse distance weight) algorithm.
  // The accuracy of interpolation is determined by the second parameter and interpolate_options.units. The units support degrees, radians, miles, or kilometers.
  // IDW needs to calculate the weight of all scatter points for each grid point. The calculation scale is (number of scatter points * number of grid points), so a balance between accuracy and performance must be achieved.

  // points = turf.interpolate(points, 10, {
  //   gridType: 'point', // 'square' | 'point' | 'hex' | 'triangle'
  //   property: 'speed',
  //   units: 'kilometers', // degrees, radians, miles, or kilometers
  //   weight: 1
  // })
  // points.features.map((i) => (i.properties.speed = Number(i.properties.speed.toFixed(2)))) // Appropriately reduce the accuracy of the interpolation result to facilitate display

  // Isosurface
  const geojsonPoly = turf.isobands(points, breaks, {
    zProperty: "speed"
  })

  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: "Isosurface",
    data: geojsonPoly,
    popup: "{speed}",
    symbol: {
      type: "polygonC",
      styleOptions: {
        fill: true, // Whether to fill
        color: "#ffff00", // color
        opacity: 1 // transparency
      },
      callback: function (attr, styleOpt) {
        // Get the weight of the point and calculate which chromaticity band it falls on
        const val = Number(attr.speed.split("-")[0] || 0)
        const color = getColor(val)
        return {
          color: color
          // height: 0,
          // diffHeight: val * 10000
        }
      }
    }
  })
  map.addLayer(geoJsonLayer)

  // Contour
  const geojsonLine = turf.isolines(points, breaks, {
    zProperty: "speed"
  })

  // perform smoothing processing
  // let features = geojsonLine.features;
  // for (let i = 0; i < features.length; i++) {
  //     let _coords = features[i].geometry.coordinates;
  //     let _lCoords = [];
  //     for (let j = 0; j < _coords.length; j++) {
  //         let _coord = _coords[j];
  //         let line = turf.lineString(_coord);
  //         let curved = turf.bezierSpline(line);
  //         _lCoords.push(curved.geometry.coordinates);
  //     }
  //     features[i].geometry.coordinates = _lCoords;
  // }

  const layerDZX = new mars3d.layer.GeoJsonLayer({
    name: "Contour",
    data: geojsonLine,
    popup: "{speed}",
    symbol: {
      styleOptions: {
        width: 2, // border width
        color: "#000000", // border color
        opacity: 0.5, // border transparency
        clampToGround: false // Whether to stick to the ground
      }
    }
  })
  map.addLayer(layerDZX)
}

function getColor(value) {
  for (let i = 0; i < breaks.length; i++) {
    if (breaks[i] === value) {
      return colors[i]
    }
  }
  return colors[0]
}
