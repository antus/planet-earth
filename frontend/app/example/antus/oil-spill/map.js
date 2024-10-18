// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象
var lodGraphicLayer;
var lastExtent;

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    fxaa: true,
    center: {"lat":-3.781416,"lng":-33.10564,"alt":3161946,"heading":0,"pitch":-90}
  },
  terrain: {
    "name": "ION",
    "type": "ion",
    "requestWaterMask": true,
    "requestVertexNormals": true,
    "show": true
  },
  control: {
    locationBar: {
      "crs": "CGCS2000_GK_Zone_3",
      "crsDecimal": 0,
      "template": "<div>Long:{lng}</div> <div>Lat:{lat}</div> <div>Alt: {alt} meters</div> <div class='hide700'>Level: {level}</div><div>Heading: {heading}°</div> <div>Pitch: {pitch }°</div>"
    }
  }
}

var mapWidgets =
{
  "version": "20220120",
  "defaultOptions": {
    "style": "dark",
    "windowOptions": {
      "skin": "layer-mars-dialog animation-scale-up",
      "position": {
        "top": 50,
        "right": 10
      },
      "maxmin": false,
      "resize": true
    },
    "autoReset": false,
    "autoDisable": false,
    "disableOther": false
  },
  "openAtStart": [

    {
      "name": "Toolbar",
      "uri": "widgets/antus/oil-spill/toolbar/widget.js",
      "css": {
        "top": "0px",
        "left": "0px",
        "right": "0px"
      }
    },
    {
      "name": "Dashboard",
      "uri": "widgets/antus/oil-spill/dashboard/widget.js",
    },
    {
      "name": "Panel",
      "uri": "widgets/antus/panel/widget.js"
    }

  ],
  "widgets": []
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this 
 * function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} none
 */
function onMounted(mapInstance) {
  map = mapInstance; 
  // Fixed lighting to avoid brightness inconsistencies in the gltf model over time.
  map.fixedLight = true;

  // Add a graphic layer for AIS data coming from file
  //addGraphiLayer();


  // Add a lod graphic layer for AIS data coming from WFS service
  addLodGraphicLayer();

  map.openFlyAnimation({
      duration1: 5,
      easingFunction1: Cesium.EasingFunction.QUINTIC_IN_OUT,
      callback: function () {
        // Callback after animation playback is completed
      }
    })

  //map.on(mars3d.EventType.cameraChanged, onMap_cameraChanged)
  
  /*
  // Rotate ships
  const interval = 1
  rotateShip(interval)
  setInterval(() => {
    rotateShip(interval)
  }, interval * 100)
  */
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} none
 */
function onUnmounted() {
  map = null
}

function onMap_cameraChanged() {
    const extent = map.getExtent()
    const bbox = extent.ymin + "," + extent.xmin + "," + extent.ymax + "," + extent.xmax
    console.log("BBOX=" + bbox);
}

function addLodGraphicLayer() {
  lodGraphicLayer = new mars3d.layer.LodGraphicLayer({
    name: "Ship information",
    IdField: "id", 
    //minimumLevel: 15, // Limita il livello e carica solo i dati al di sotto di questo livello. [Parametri importanti relativi all'efficienza]
    debuggerTileInfo: false,
    clustering: {
      enabled: true, 
      pixelRange: 10
    },
    // Create the query string
    queryGridData: (grid) => {
      return mars3d.Util.fetchJson({
        url: "http://10.100.208.140:8190/geoserver/wfs",
        queryParameters: {
          request:"GetFeature",
          version:"1.0.0",
          typeName: "monitoraggio-ambientale:ais_data",
          BBOX: grid.extent.xmin + "," + grid.extent.ymin + "," + grid.extent.xmax + "," + grid.extent.ymax + ",EPSG:4326",
          maxFeatures: 20,
          srsName: "EPSG:4326",
          outputFormat: "application/json"
        }
      }).then(function (data) {
        grid.list = data.features
        return grid
      })
    },
    // Create the graphic
    createGraphic(grid, attr) {
      if (attr.geometry.type=='Point') {
        const graphicModel = new mars3d.graphic.ModelEntity({
          name: attr.properties.type,
          position: [attr.geometry.coordinates[0], attr.geometry.coordinates[1], 0],
          style: {
            url: "/config/ships/models/ship" + attr.properties.type + ".glb",
            heading: attr.properties.bearing + 90,
            scale: 0.5,
            minimumPixelSize: 40,
            clampToGround: true,
            distanceDisplayCondition: true,
            distanceDisplayCondition_near: 0,
            distanceDisplayCondition_far: 100000,
            label: {
              text: attr.properties.callsign,
              font_size: 12,
              color: "#ffffff",
              outline: true,
              outlineColor: "#000000",
              pixelOffsetY: -20
            },
            distanceDisplayBillboard: {
              image: getSvg(attr.properties.type),
              rotationDegree: -attr.properties.bearing,
              scale: 0.15
            },
            highlight: {
              silhouette: true,
              silhouetteColor: "#00ffff",
              silhouetteSize: 3
            }
          },
          attr: attr.properties
        })
        lodGraphicLayer.addGraphic(graphicModel);
        
        //var position = Cesium.Cartesian3.fromDegrees(attr.geometry.coordinates[0], attr.geometry.coordinates[1], 0)
        //graphicModel.addDynamicPosition(position, 0);
        return graphicModel;

      }
    }
  })
  map.addLayer(lodGraphicLayer)

  bindLodLayerPopup();
}

function formatLongitude(value) {
  var result = ConvertDDToDMS(value, true);
  return result.deg + "° " + result.min + "' " + result.sec + "'' " + result.dir
}
function formatLatitude(value) {
  var result = ConvertDDToDMS(value, false);
  return result.deg + "° " + result.min + "' " + result.sec + "'' " + result.dir
}

function ConvertDDToDMS(D, lng) {
  return {
    dir: D < 0 ? (lng ? "W" : "S") : lng ? "E" : "N",
    deg: 0 | (D < 0 ? (D = -D) : D),
    min: 0 | (((D += 1e-9) % 1) * 60),
    sec: (0 | (((D * 60) % 1) * 6000)) / 100,
  };
}

function getSvg(type) {
  if (type==1 || type==2)
    return "/img/icon/ship1.svg";
  if (type==3 || type==4)
    return "/img/icon/ship2.svg";
  if (type==5 || type==6)
    return "/img/icon/ship3.svg";
  if (type==7 || type==8)
    return "/img/icon/ship4.svg";
  if (type==9 || type==10)
    return "/img/icon/ship5.svg";
  else
    return "/img/icon/ship1.svg";
}

function rotateShip(time) {
  offset += 0.001
  lodGraphicLayer.eachGraphic((graphic) => {
    if (graphic.isPrivate) {
      return
    }
    let heading = graphic.heading + 1;
    if (heading>360)
      heading= heading-360;
    graphic.heading = heading;
  })
}

function clearGraphic() {
  lodGraphicLayer.clear(true)
}

function bindLodLayerPopup() {
  lodGraphicLayer.bindPopup(function (event) 
    {
        const attr = event.graphic.attr || {}
        if (attr==null || attr.callsign==null)
          return null;
        attr.lat = formatLatitude(attr.lat);
        attr.lon = formatLongitude(attr.lon);
        attr.speed = attr.speed + " kn";
        attr.bearing = attr.bearing + " °";
        attr.length = attr.length + " m";
        attr.beam = attr.beam + " m";
        attr.draught = attr.draught + " m";
        attr.last_posit = attr.last_posit + " mins ago";
        
        return `<table>
                  <tr><th scope="col" colspan="2" style="border-bottom:1px solid grey;font-size:15px;">Ship information</th></tr>
                  <tr><td>Callsig</td><td>{callsign}</td></tr>
                  <tr><td>IMO</td><td>{imo}</td></tr>
                  <tr><td>MMSI</td><td>{mmsi}</td></tr>
                  <tr><td>Latitude</td><td>{lat}</td></tr>
                  <tr><td>Longitude</td><td>{lon}</td></tr>
                  <tr><td>Bearing</td><td>{bearing}</td></tr>
                  <tr><td>Speed</td><td>{speed}</td></tr>
                  <tr><td>Length</td><td>{length}</td></tr>
                  <tr><td>Beam</td><td>{beam}</td></tr>
                  <tr><td>Draught</td><td>{draught}</td></tr>
                  <tr><td>Last position</td><td>{last_posit}</td></tr>
                  <tr><td colspan="2"><img src="/config/ships/thumbnails/ship{type}.jpg" ></img></td></tr>
                </table>`;
    },
    {
      offsetY:0, 
      offsetX:0,
      template: `<div class="marsBlackPanel">
                        <div class="marsBlackPanel-text" style="text-align:left">{content}</div>
                        <span class="mars3d-popup-close-button closeButton" >×</span>
                      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      clampToGround: true
    }
  )
}
