// import * as mars3d from "mars3d"

var map // mars3d.Map
var graphicLayer;
var routeGraphicLayer;
const interval = 10
let selectedFlightId;
let fixedRoute;
let destinationRoute;
/*
 * Override the map attribute parameters in config.json 
 * the merge is automatically handled in the current example framework
 */
var mapOptions = {
  scene: {
    fxaa: true,
    center: {"lat":41.803862,"lng":12.260555,"alt":6707,"heading":357.1,"pitch":-90}
  },
  terrain: {
    "name": "ION",
    "type": "ion",
    "requestWaterMask": true,
    "requestVertexNormals": true,
    "show": true
  },
  control: {
    baseLayerPicker: false,
    sceneModePicker: false,
    compass:false,
    homeButton:false,
    baseLayerPicker: false,
    sceneModePicker: false,
    vrButton: false,
    fullscreenButton: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    infoBox: false,
    geocoder: false,
    selectionIndicator: false,
    showRenderLoopErrors: true,
    contextmenu: { hasDefault: true },
    mouseDownView: true,
    distanceLegend: false,
    locationBar: false,
    zoom:false
  }
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

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  routeGraphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(routeGraphicLayer)

  // get initial aircraft positions
  getAircraftPositions();
  
  // refresh aircraft positions every <interval> seconds  
  setInterval(() => {
    getAircraftPositions()
  }, interval * 1000)
  
  // register map view change
  map.on(mars3d.EventType.cameraChanged, getAircraftPositions)

  // bind layer popup
  bindLayerPopup();

  // register popupclose event
  graphicLayer.on(mars3d.EventType.popupClose, function (event) {
    fixedRoute.remove();
    fixedRoute = null;
    if (destinationRoute) {
      destinationRoute.remove();
      destinationRoute = null;
    }
    selectedFlightId = null;
  })
}

/**
 * Release the life cycle function of the current map business
 * @returns {void} none
 */
function onUnmounted() {
  map = null
}


function getAircraftPositions() {
  // get map bbox
  const extent = map.getExtent({scale:0.5});
  // fetch aircrafts data
  fetchFromRadar(extent.ymax, extent.ymin, extent.xmin, extent.xmax)
  .then(function (data) {
    result = getAircrafts(data);
    list = result.list;
    console.log("Aircrafts: " + result.fetched + "/" + result.totals);
    // draw aircrafts
    drawAircrafts(list);
  })
}

function drawAircrafts(list) {
  // draw all aircrafts
  list.forEach(function(element) {
    const elementOnMap = graphicLayer.getGraphicById(element.id);
    // check if the aircraft is already present on map
    if (elementOnMap) {
      if (elementOnMap.attr.longitude!=element.longitude || elementOnMap.attr.latitude!=element.latitude) {
        const position = Cesium.Cartesian3.fromDegrees(element.longitude, element.latitude, element.altitude * 0.3048);
        elementOnMap.addDynamicPosition(position, interval + 1);
        elementOnMap.setStyle({
          rotation: new Cesium.CallbackProperty(() => {
            return map.camera.heading + Cesium.Math.toRadians(-element.bearing)
          }, false)
        });
        // update attributes
        elementOnMap.attr= element;
      }
    } else {
      // no, add new element
      const graphic = new mars3d.graphic.BillboardEntity({
      id: element.id,
      style: {
        image: "/img/icon/flight.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        rotation: new Cesium.CallbackProperty(() => {
          return map.camera.heading + Cesium.Math.toRadians(-element.bearing)
        }, false),
        heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.7),
        highlight: {
          type: mars3d.EventType.mouseOver,
          image: "/img/icon/flight-selected.png",
        }
      },
      attr: element
      })
      // add graphic to graphicLayer  
      graphicLayer.addGraphic(graphic)
      // set position
      const position = Cesium.Cartesian3.fromDegrees(element.longitude, element.latitude, element.altitude * 0.3048);
      graphic.addDynamicPosition(position, 0);

      /*
      const distance = (element.speed * 1.85) * interval/3600 * 1000;
      const np = destinationPoint(element.latitude, element.longitude, distance, element.bearing);
      graphic.attr.nextPosition = np;
      const nextPosition = Cesium.Cartesian3.fromDegrees(np[1], np[0], element.altitude * 0.3048);
      graphic.addDynamicPosition(nextPosition, interval);
      */
      // set the tooltip
      graphic.bindTooltip(element.callsign, {anchor: [0, -15],});
      // register postrender to update popup data
      graphic.on(mars3d.EventType.postRender, function (event) {
        var container = event.container 
        const id = event.attr.id;
        updatePopupData(container, id)
      });
    }
  });

  // remove old aircrafts
  graphicLayer.graphics.forEach(function(element) {
    const exist = list.find(x => x.id === element.id);
    if (!exist)
      element.remove();
  });

  // update route
  if (selectedFlightId) {
    // fetch flight details
    fetchFlight(selectedFlightId)
    .then(function (data) {
      drawFlightTrack(data);
    })
  }
}

function updatePopupData(container, id) {
  const elementOnMap = graphicLayer.getGraphicById(id);
  var latitude = container.querySelector("#latitude")
  var longitude = container.querySelector("#longitude")
  var altitude = container.querySelector("#altitude")
  var speed = container.querySelector("#speed")
  var bearing = container.querySelector("#bearing")
  var rateOfClimb = container.querySelector("#rateOgClimb")
  var isOnGround = container.querySelector("#isOnGround")
  var timestamp = container.querySelector("#timestamp")
  if (latitude) 
    latitude.innerHTML = formatLatitude(elementOnMap.attr.latitude);
  if (longitude) 
    longitude.innerHTML = formatLongitude(elementOnMap.attr.longitude);
  if (altitude) 
    altitude.innerHTML = elementOnMap.attr.altitude + " ft";
  if (speed) 
    speed.innerHTML = elementOnMap.attr.speed + "kn";
  if (bearing) 
    bearing.innerHTML = elementOnMap.attr.bearing + "°";
  if (rateOfClimb) 
    rateOfClimb.innerHTML = elementOnMap.attr.rateOfClimb + " ft/min"
  if (isOnGround) 
    isOnGround.innerHTML = elementOnMap.attr.isOnGround ? "On the ground": "On air"
  if (timestamp) 
    timestamp.innerHTML =  mars3d.Util.formatDate(new Date(elementOnMap.attr.timestamp * 1000), "yyyy-MM-dd HH:mm:ss");

}

function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) 
    {
        const attr = event.graphic.attr || {}
        if (attr==null || attr.callsign==null)
          return null;
        attr.lat_f = formatLatitude(attr.latitude);
        attr.lon_f = formatLongitude(attr.longitude);
        attr.altitude_f = attr.altitude + " ft";
        attr.speed_f = attr.speed + " kn";
        attr.bearing_f = attr.bearing + "°";
        attr.rateOfClimb_f = attr.rateOfClimb + " ft/min";
        attr.isOnGround_t = attr.isOnGround ? "On the ground": "On air"
        attr.timestamp_t = mars3d.Util.formatDate(new Date(attr.timestamp * 1000), "yyyy-MM-dd HH:mm:ss");
     
        
        // fetch flight details
        selectedFlightId = attr.id
        fetchFlight(selectedFlightId)
        .then(function (data) {
          drawFlightTrack(data);
        })

        return `<table style="width:100%">
                  <tr><th scope="col" colspan="2" style="border-bottom:1px solid grey;font-size:15px;">Flight information</th></tr>
                  <tr><td>Callsign</td><td>{callsign}</td></tr>
                  <tr><td>Flight</td><td>{flight}</td></tr>
                  <tr><td>Registration</td><td>{registration}</td></tr>
                  
                  <tr><td>Origin</td><td>{origin}</td></tr>
                  <tr><td>Destination</td><td>{destination}</td></tr>
                  
                  <tr><td>Latitude</td><td id="latitude">{lat_f}</td></tr>
                  <tr><td>Longitude</td><td id="longitude">{lon_f}</td></tr>
                  <tr><td>Altitude</td><td id="altitude">{altitude_f}</td></tr>
                  <tr><td>Bearing</td><td id="bearing">{bearing_f}</td></tr>
                  <tr><td>Speed</td><td id="speed">{speed_f}</td></tr>
                  <tr><td>Rate of Climb</td><td id="rateOfClimb">{rateOfClimb_f}</td></tr>
                  
                  <tr><td>Status</td><td id="isOnGround">{isOnGround_t}</td></tr>
                  <tr><td>Model</td><td>{model}</td></tr>
                  <tr><td>Mode SCode</td><td>{modeSCode}</td></tr>
                  <tr><td>Radar</td><td>{radar}</td></tr>
                  <tr><td>Timestamp</td><td id="timestamp">{timestamp}</td></tr>
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
      verticalOrigin: Cesium.VerticalOrigin.TOP
      
    }
  )
}

function drawFlightTrack(data) {
  if (!fixedRoute) {
    // add flight route detail
    fixedRoute = new mars3d.graphic.PolylineEntity({
      positions: new Cesium.CallbackProperty(() => {
        var positions = getRoutePositions(data)
        const elementOnMap = graphicLayer.getGraphicById(selectedFlightId);
        positions.push(elementOnMap.positionShow)
        return positions;
      }, false),
      style: {
        width: 3,
        materialType: mars3d.MaterialType.LineTrail,
        materialOptions: {
          color: Cesium.Color.CHARTREUSE,
          speed: 20,
          percent: 0.15,
        }
        
      },
      attr: { remark: "trail" }
    })
    
    routeGraphicLayer.addGraphic(fixedRoute)
    // add flight route detail
    if (data.airport!=null && data.airport.destination !=null && data.airport.destination.position !=null) {
      const dest = data.airport.destination.position;
      destinationRoute = new mars3d.graphic.PolylineEntity({
        positions: new Cesium.CallbackProperty(() => {
          var finalRoute = [];
          const elementOnMap = graphicLayer.getGraphicById(selectedFlightId);
          finalRoute.push(elementOnMap.positionShow);
          const position = Cesium.Cartesian3.fromDegrees(dest.longitude, dest.latitude, dest.altitude * 0.3048);
          finalRoute.push(position);
          return finalRoute;
        }, false),
        style: {
          width: 3,
          materialType: mars3d.MaterialType.LineFlowColor,
          materialOptions: {
            color: "#00ffff",
            speed: 20,
            percent: 0.15,
            alpha: 0.5
          }          
        }
        
      })
      routeGraphicLayer.addGraphic(destinationRoute)
    }
  } else {
    // update flight route detail
    /*
    var positions = getRoutePositions(data);
    fixedRoute.positions = positions;
    if (destinationRoute) {
      const dest = data.airport.destination.position;
      var finalRoute = [];
      finalRoute.push(positions.slice(-1)[0]);
      const position = [dest.longitude, dest.latitude, dest.altitude * 0.3048]
      finalRoute.push(position);
      destinationRoute.positions = finalRoute;
    }
*/
  }

}

function getRoutePositions(data) {
  var postitions = [];
  data.trail.forEach(function(element) {
    //const position = [element.lng, element.lat, element.alt * 0.3048]
    const position = Cesium.Cartesian3.fromDegrees(element.lng, element.lat, element.alt * 0.3048);
    postitions.push(position);
  });
  var p = postitions.reverse();
  return p; 
}




// Converts from degrees to radians.
function toRadians(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

function bearing(startLat, startLng, destLat, destLng){
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}





function addFlightRadar24Layer() {
  lodGraphicLayer = new mars3d.layer.LodGraphicLayer({
    name: "Flightradar24",
    IdField: "id", 
    //minimumLevel: 9, // Limita il livello e carica solo i dati al di sotto di questo livello. [Parametri importanti relativi all'efficienza]
    debuggerTileInfo: false,
    clustering: {
      enabled: false, 
      pixelRange: 10
    },
    // Create the query string
    queryGridData: (grid) => {
      return fetchFromRadar(grid.extent.ymax, grid.extent.ymin, grid.extent.xmin, grid.extent.xmax)
      .then(function (data) {
        grid.list = getAircrafts(data);
        return grid
      })
    },
    // Create the graphic
    createGraphic(grid, attr) {
      //console.log(attr);
      
        const graphicModel = new mars3d.graphic.ModelEntity({
          name: attr.callsign,
          position: [attr.longitude, attr.latitude, 0],
          style: {
            url: "/config/ships/models/ship1.glb",
            heading: attr.bearing + 90,
            scale: 0.5,
            minimumPixelSize: 40,
            clampToGround: true,
            distanceDisplayCondition: true,
            distanceDisplayCondition_near: 0,
            distanceDisplayCondition_far: 100000,
            label: {
              text: attr.callsign,
              font_size: 12,
              color: "#ffffff",
              outline: true,
              outlineColor: "#000000",
              pixelOffsetY: -20
            },
            distanceDisplayBillboard: {
              image: "/img/icon/ship1.svg",
              rotationDegree: -attr.bearing,
              scale: 0.30
            }
          },
          attr: attr
        })
        lodGraphicLayer.addGraphic(graphicModel);
        
        //var position = Cesium.Cartesian3.fromDegrees(attr.geometry.coordinates[0], attr.geometry.coordinates[1], 0)
        //graphicModel.addDynamicPosition(position, 0);
        return graphicModel;
  
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


