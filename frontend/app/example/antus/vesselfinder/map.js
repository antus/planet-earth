// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象
var lodGraphicLayer;

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 42.576038, lng: 11.586631, alt: 2296055.4, heading: 357.1, pitch: -88.5 }
  },
  terrain: {
    "name": "ION",
    "type": "ion",
    "requestWaterMask": true,
    "requestVertexNormals": true,
    "show": true
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

  // Add a graphic layer for AIS data coming from file
  //addGraphiLayer();

  // Add a lod graphic layer for AIS data coming from WFS service
  addLodGraphicLayer();

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
      const lower_left = ol.proj.fromLonLat([grid.extent.xmin ,grid.extent.ymin]);
      const upper_right = ol.proj.fromLonLat([grid.extent.xmax ,grid.extent.ymax]);
      zoom_level = map.level + 1;
      url = "/vesselfinder/api/pub/mp2?" + 
            "bbox=" + (lower_left[0] | 0) + "," + (lower_left[1] | 0)+ "," + (upper_right[0] | 0)+ "," + (upper_right[1] | 0) + "&" +
            "zoom=" + zoom_level + "&" +
            "mmsi=0&" +
            "ref=" + Math.random() * 99999
      return makeRequest('GET', url)
            .then(function (datums) {
              //console.log(datums);
              grid.list = drawShipsOnMapBinary(new DataView(datums), zoom_level);
              return grid
            })
            .catch(function (err) {
              console.error('Augh, there was an error!', err.statusText);
            });
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

function makeRequest (method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

function drawShipsOnMapBinary(t, e) {
  let n, r, o = [], a = [], l = [], h, c, u, d, f, g, _, m, p, y, x, 
  E, w, R = !1, T = false, L = false;
  let v = 0
    , b = false
    , D = false
    , O = t.byteLength
    , F = this.selectedMMSI
    , K = O >= 12 ? t.getInt8(2) : 0;
  if (K >= 8) {
      const M = t.getInt32(4)
        , I = true
        , P = true
        , X = false;
      mcb = {
          p1: (M & 1) > 0,
          p2: (M & 2) > 0,
          p3: (M & 4) > 0,
          p4: (M & 8) > 0,
          emp1: !1,
          emp1z: 0,
          emp2: !1
      }
      /*
      ,
      I === !1 && this.options.mcb.p2 === !0 && mworker.postMessage({
          cmd: "pjson"
      });
      */
      let z = !1;
      P !== mcb.p3;
      let zt = 1;
      let q = zt;
      X !== mcb.p4 && (q = mcb.p4 ? 6 : zt,
      z = !0),
      z && setTimeout(()=>this.attachVTE(q)),
      F = t.getInt32(8)
  }
  let S = 4 + K;
  const Mn = 600000;
  const nt = "EPSG:4326";
  for (; S < O; ) {
      E = 0;
      let M = t.getInt16(S), I = (M & 240) >> 4, P = (M & 16128) >> 8, X = M & 49152, z;
      if (e > 6)
          switch (X) {
          case 49152:
              z = 2;
              break;
          case 32768:
              z = 0;
              break;
          default:
              z = 1;
              break
          }
      else
          z = 1;
      S += 2,
      u = t.getInt32(S),
      S += 4,
      D = u === F,
      f = t.getInt32(S) / Mn,
      S += 4,
      d = t.getInt32(S) / Mn,
      S += 4,
      //y = new Wt(Q([d, f], nt, J)),
      D && (h = t.getInt16(S) / 10,
      S += 2,
      c = t.getInt16(S) / 10,
      S += 2,
      S += 2),
      w = t.getInt8(S),
      S += 1;
      let q = t.getInt8(S);
      if (S += 1,
      S + q > O)
          break;
      x = fg(t, S, q),
      S += q,
      x == "" && (x = u.toString()),
      D && (E = t.getInt32(S),
      S += 4);
      let C = 0;
      if (b && (g = t.getInt16(S),
      S += 2,
      _ = t.getInt16(S),
      S += 2,
      m = t.getInt16(S),
      S += 2,
      p = t.getInt16(S),
      S += 2,
      C = t.getInt16(S),
      S += 2,
      g + _ > 0 && m + p > 0 && g + _ <= 500 && m < 63 && p < 63)) {
          let ut;
          C >= 0 && C <= 360 ? ut = C : P < 32 ? ut = Math.floor(P * 11.25) : ut = -1,
          ut > -1 && a.push(Lg(f, d, g, _, m, p, ut, I))
      }
      let pt = M & 1
        , B = (M & 2) !== 0
        , V = 0;
      B && (b ? V = C : (V = t.getInt16(S),
      S += 2));
      const bt = u === 0;
      n = {
          geometry: y,
          lat: f,
          lon: d,
          name: x,
          mmsi: u,
          cog: h,
          sog: c,
          tstamp: E,
          selected: bt,
          sar: B,
          old: pt,
          sar_alt: V,
          color: I,
          iconNumber: P,
          size: z,
          z: v,
          td: w,
          nf: r,
          sat: !1,
          mty: 1
      },
      o.push(n)
  }
  return o;
  /*
  if (this.markers.clear(!0),
  this.shipNames.clear(!0),
  this.shapes.clear(!0),
  this.extraMarkers.clear(!0),
  O === 4 && this.options.filter === 0 && this.clearPreflight(),
  this.markers.addFeatures(o),
  this.shipNames.addFeatures(l),
  this.shapes.addFeatures(a),
  R) {
      this.selectedShipMarker.set("subtitle", Gs(this.selectedShipMarker, this.options.timeFormat)),
      this.selectionMarker.setGeometry(this.selectedShipMarker.getGeometry()),
      this.extraMarkers.addFeature(this.selectedShipMarker),
      this.markers.addFeature(this.selectionMarker),
      this.selectionMarkerAdded = !0;
      let M = i.calculateExtent(this.map.getSize())
        , I = this.selectedShipMarker.getGeometry().getCoordinates()
        , P = he(M, I);
      rt("ship-in-view", {
          visible: P,
          zoom: e
      }),
      this.trackIsDrawn && this.trackZoom !== e && (this.trackZoom = e,
      this.simplifyTrack(this.trackZoom))
  } else
      this.selectionMarkerAdded = !1
  */
}

function fg(s, t, e) {
  let i = new ArrayBuffer(e * 2)
    , n = new Uint16Array(i);
  for (let r = 0; r < e; ++r)
      n[r] = s.getUint8(t + r);
  return String.fromCharCode.apply(null, n)
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
