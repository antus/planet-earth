/* eslint-disable prettier/prettier */
// import * as mars3d from "mars3d"

var map // 
var lastExtent
var smartSecurityLayer
var smartGreenLayer
var smartTravelLayer
//variabili security index
var prec
var prov_velocita
var prov_posizione
var prov_sosta
var prov_documenti
var prov_segnaletica
var sentiment
var footfall
var incendi
var incidenti
var telecamere
var crimini
var pali
var degrado
var indice
//variabili green index
var sgi;
var verde_oriz;
var peso_chioma_perc;
var somma_area_chioma;
var area_terre_emerse;
var geometry_id;
var annomese;
var sentiment_gi;

var mapOptions = {
  scene: {

    center: { lat: 42.32079612459104, lng: -71.1273615786857, alt: 8000, heading: 0, pitch: -90 }
  },
  terrain: {
    name: "ION",
    type: "ion",
    requestWaterMask: true,
    requestVertexNormals: true,
    show: true
  },
  control: {
    locationBar: {
      crs: "CGCS2000_GK_Zone_3",
      crsDecimal: 0,
      template:
        "<div>Long:{lng}</div> <div>Lat:{lat}</div> <div>Alt: {alt} meters</div> <div class='hide700'>Level: {level}</div><div>Heading: {heading}°</div> <div>Pitch: {pitch }°</div>"
    }
  },
  layers: [
    {
      "pid": 4020,
      "name": "Location travel barometer",
      "type": "wms",
      "url": "/forestame/geoserver/wms",
      "layers": "boston:travel_barometer",
      "parameters": { "transparent": "true", "format": "image/png" },
      "getFeatureInfoParameters": {
        feature_count: 10
      },
      "popup": "<b>valore:</b>  {index_value}<br>"	,
      "show": true,
      "flyTo": true
    }
  ]
  
}

var mapWidgets = {
  version: "20220120",
  defaultOptions: {
    style: "dark",
    windowOptions: {
      skin: "layer-mars-dialog animation-scale-up",
      position: {
        top: 50,
        right: 100
      },
      maxmin: false,
      resize: true
    },
    autoReset: false,
    autoDisable: false,
    disableOther: false
  },
  openAtStart: [
    {
      "name": "Panel",
      "uri": "widgets/antus/panel/widget.js",

      "data": [
        {
          "name": "Geoserver local",
          "url": "http://localhost:8080/geoserver/wms",
          "type": "wms"
        },
        {
          "name": "Geoserver GiottoLab",
          "url": "http://10.100.208.140:8089/geoserver/wms",
          "type": "wms"
        },
      ]
    }
  ],
  widgets: []
}

/**
 * Initialize map business, life cycle hook function (required)
 * The framework automatically calls this
 * function after the map initialization is completed.
 * @param {mars3d.Map} mapInstance map object
 * @returns {void} none
 */
function onMounted(mapInstance) {
  map = mapInstance

  addSSIicLayer();
  addSGIicLayer();
  map.openFlyAnimation({
    duration1: 5,
    easingFunction1: Cesium.EasingFunction.QUINTIC_IN_OUT,
    callback: function () {
      // Callback after animation playback is completed
    }
  })


  function addSSIicLayer() {
    /*var wmsLayer = new mars3d.layer.WmsLayer({
      url: "http://localhost:3000/proxy/geoserver/wms",
      layers: "boston:smart_security_index",
      crs: "EPSG:4326",
      parameters: {
        transparent: "true",
        format: "image/png",
      },
      getFeatureInfoParameters: {
        feature_count: 10,
      },
      popup: "all",
    });
    map.addLayer(wmsLayer);*/
    smartSecurityLayer = new mars3d.layer.WmsLayer({
      "name": "Smart security index",      
			"type": "wms",
      "url": "/forestame/geoserver/wms",
      "layers": "boston:smart_security_index",
			"parameters": { "transparent": "true", "format": "image/png" },
			"opacity":0.6
		}
    );
    smartSecurityLayer.flyTo();
    map.addLayer(smartSecurityLayer);

    bindSSILayerPopup(smartSecurityLayer);
  }



  function addSGIicLayer() {
    /*var wmsLayer = new mars3d.layer.WmsLayer({
      url: "http://localhost:3000/proxy/geoserver/wms",
      layers: "boston:smart_security_index",
      crs: "EPSG:4326",
      parameters: {
        transparent: "true",
        format: "image/png",
      },
      getFeatureInfoParameters: {
        feature_count: 10,
      },
      popup: "all",
    });
    map.addLayer(wmsLayer);*/
    smartGreenLayer = new mars3d.layer.WmsLayer({
      "name": "Smart green index",
      "type": "wms",
      "url": "/forestame/geoserver/wms",
      "layers": "boston:smart_green_index",
			"parameters": { "transparent": "true", "format": "image/png" },
			"opacity":0.6
			}
    );
    smartGreenLayer.flyTo();
    map.addLayer(smartGreenLayer);

    bindSGILayerPopup(smartGreenLayer);
  }

  function showSSI(val) {
    if (smartSecurityLayer == null) {
      addSSIicLayer();
    }
    smartSecurityLayer.show = val;
  }
  function showSGI(val) {
    smartGreenLayer.show = val;
  }
  function showSTI(val) {
    // smartTravelLayer.show = val;
  }

  function bindSSILayerPopup(lodGraphicLayer) {
    lodGraphicLayer.bindPopup(function (event) {
			let attr = event.features[0].properties;
      //let attr = event.graphic?.attr;
      prec = attr.prov_precedenza
      prov_velocita = attr.prov_velocita
      prov_posizione = attr.prov_posizione
      prov_sosta = attr.prov_sosta
      prov_documenti = attr.prov_documenti
      prov_segnaletica = attr.prov_segnaletica
      sentiment = attr.sentiment
      footfall = attr.footfall
      incendi = attr.incendio
      incidenti = attr.incidente
      telecamere = attr.n_telecamere
      crimini = attr.crimini
      pali = attr.n_pali_luce
      degrado = attr.degrado
      indice = attr.smart_security_city_index
      return "<div class='modal-header-sci'> " +
        "          <h2>Decison Support System</h2>" +
        "            <em>Predice il valore dell’Indice sulla Sicurezza <br/>modificando le seguenti variabili:</em>" +
        "        </div>" +
        "        <form role='form' id='dss-form'>" +
        "           <div>" +
        "                <table class='mars-table'>" +
        "                    <tr>" +
        "                      <td class='nametd'> " +
        "                        <label for='sentiment' data-toggle='tooltip' title='indice basato sul giudizio estratto e calcolato sui contenuti online (reviews) sui Social Media'>sentiment</label>" +
        "                          </td> <td> <input class='form-control' id='sentiment'  name='sentiment' type=number step=0.01  min=0 max=100  required data-toggle='tooltip' title='inserire un valore tra 0 e 100' value='" + parseFloat( attr.sentiment).toFixed(2) + "'>" +
        "                      </td>  <td> " +
        "                          <label  for='footfall' data-toggle='tooltip' title='traffico pedonale/popolarità del POI che tiene conto del numero di recensioni geolocalizzate, numero di contenuti sui social media, dati originati da dispositivi mobili'>footfall</label>" +
        "                            </td> <td>" +
        "                            <input class='form-control' id='footfall'  type=number min=0 max=150 step=0.01 required data-toggle='tooltip' title='inserire un valore tra 0 e 150' value='" + attr.footfall + "'>" +
        "                        </input>" +
        "                      </td>" +
        "                    </tr>" +
        "                  <tr>" +
        "                        <td >" +
        "                              <label title='numero di telecamere data-toggle='tooltip'>telecamere</label>" +
        "                               </td> <td>  " +
        "                                <input class='form-control' id='telecamere' type=number min=0 step=1 required value='" + attr.n_telecamere + "'>" +
        "                            </td>" +
        "                    <td> <label title='numero di pali della luce' data-toggle='tooltip'>pali della luce</label>" +
        "                              </td> <td>" +
        "                                <input class='form-control' id='pali' type=number min=0 step=1 required value='" + attr.n_pali_luce + "'>" +
        "                            </td> </tr><tr>" +
        "                      <td >" +
        "                            <label title='numero di incendi' data-toggle='tooltip'>incendi</label>" +
        "                            </td> <td> " +
        "                            <input class='form-control' id='incendi' type=number min=0 step=1 required value='" + attr.incendio + "'>" +
        "                      </td>" +
        "                        <td >" +
        "                            <label title='eventi o fattori del degrado urbano' data-toggle='tooltip'>degrado</label>" +
        "                        </td> <td>" +
        "                          <input class='form-control' id='degrado' type=number min=0 step=1 required value='" + attr.degrado + "'>" +
        "                        </td>" +
        "                    </tr>" +
        "                  <tr>" +
        "                        <td >" +
        "                            <label title='eventi in cui rimangono coinvolti veicoli, esseri umani o animali, fermi o in movimento' data-toggle='tooltip'>incidenti</label>" +
        "                          </td> <td>" +
        "                          <input class='form-control' id='incidenti' type=number min=0 step=1 required value='" + attr.incidente + "'>" +
        "                        </td>" +
        "                       <td >" +
        "                          <label data-toggle='tooltip' title='reati come corruzione, estorsione, furto, rapina, violenza, minaccia, omicidio, prostituzione, spaccio, truffa e usura'>crimini</label>" +
        "</td> <td>                           <input class='form-control' id='crimini' type=number min=0 step=1 required value='" + attr.crimini + "'>" +
        "                        </td>" +
        "                  </tr>" +
        " <tr><td title='L’Indice misura il grado di sicurezza urbana'>Smart Security Index:</td><td><input  readonly id='ssci-old' class='form-control' value='" + attr.smart_security_city_index + "'></td></tr>" +
        "                </table>" +


        "            </div>" +
        "        <hr>  " +
        " <table class='mars-table'>" +
        "                 <tr> <td  width='100'>   <input class='btn btn-primary' type='submit' value='Predizione dello SSCI'/></td>" +
        "          <td> <input class='btn btn-primary' type='button' onclick='restoreSI()' type='reset' id='restore' value='ripristina valori originali' /></td>" +
        "              </tr>" +
        "                <tr > <td style='text-align:right !important' >" +
        "                    <label title='nuovo valore dello Smart Security City Index' style='text-align:right' >predizione</label>" +
        "                  </td> <td> <input class='form-control' id='ssci' disabled>" +
        "                </tr>" +
        "                <tr> <td style='text-align:right !important' >" +
        "                  <label title='variazione rispetto al valore iniziale'>variazione (%)</label>" +
        "                    </td> <td>" +
        "                    <input class='form-control' id='variazione' type=text disabled>" +
        "                    <td> " +
        "              </table>" +
        "    </form>"
    },
      {
        template: `<div class="marsBlackPanel">
        <div class="marsBlackPanel-text">{content}</div>
      </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        symbol: {
          type: "polygonCombine", //大数据面类型，效率高
          styleOptions: {
            color: "#0d3685",
            opacity: 1.0,
            outline: false,
          }
        }
      });
    lodGraphicLayer.on(mars3d.EventType.popupOpen, function (event) {
      let container = event.container; //popup对应的DOM
      const form = container.querySelector("#dss-form");

      form.addEventListener("submit", saveSI);
      form.addEventListener("reset", restoreSI);
    
    });
  }


  function bindSGILayerPopup(lodGraphicLayer) {
    lodGraphicLayer.bindPopup(function (event) {
     // let attr = event.graphic?.attr;
		 let attr = event.features[0].properties;
      sgi = attr.sgi;
      sentiment_gi = attr.urban_green_index;
      verde_oriz = attr.somma_area_verde_oriz;
      peso_chioma_perc = attr.per_peso_chioma;
      somma_area_chioma = attr.somma_area_chioma;
      area_terre_emerse = attr.area_terre_emerse;
      annomese = attr.annomese;
      geometry_id = attr.geometry_id;
      return "<div>    <table id='dati-alberi' class='table'></table>  </div> " +
        "<div class='modal-header-sci'>" +
        "    <h2>Decison Support System</h2>" +
        "    <em>Predice il valore dello  Smart Green Index per questo tile</em>" +
        "  </div>  " +
        "<div>" +
        "    <form role='form' id='dss-form' action='#'>" +
        "      <em>Variabili considerate nel calcolo dell'indice e oggetto di simulazione</em>" +
        "      <table class='mars-table'>" +
        "        <tr>" +
        "          <td>" +
        "            <label for='area' title='area in m² delle aree verdi incluse nel tile' >verde orizzontale (m²)</label>" +
        "           </td>" +
        "          <td><input class='form-control' id='area' name='area' min=0 type=number step=0.01 required value='" + parseFloat( attr.somma_area_verde_oriz).toFixed(2) + "'/></td>" +
        "        </tr>" +
        "        <tr> <td>" +
        "            <label class='form-label' for='sentiment' title='indice del POI che tiene conto del numero di recensioni geolocalizzate, numero di contenuti sui social media, dati originati da dispositivi mobili'>percezione del verde</label>" +
        "                    </td>" +
        "          <td> <input class='form-control' id='sentiment' min=0 type=number step=0.01  required value='" + parseFloat(attr.urban_green_index).toFixed(2) + "'></td>" +
        "        </tr>               "+
        " <tr><td title='L’Indice misura misura il grado di benessere del verde,in relazione alla copertura arborea, allo stato manutentivo e alla percezione dei cittadini registrata online. L’Indice correla dati provenienti da fonti eterogenee, tra cui dataset provenienti dal censimento arboreo, dati satellitari (Copernicus) e dati OSINT (web e social media).'>Smart Green Index:</td><td><input type='number' readonly id='sgi-old' class='form-control' value='" + attr.sgi + "'></td></tr>" +
     "</table>" +
        " <div   id='table-scroll'>   <table id='table'  class='mars-table'>" +
        ` <thead>
      <tr>
        <th>Genere</th>
        <th>Fase fisiologica</th>
        <th>Sito di crescita naturale</th>
        <th>Stato vegetativo</th>
        <th>Numero di alberi</th>
        <th>Operazione</th>
        <th>
          <button class="btn btn-primary" id="addrow" ><i class="fa fa-plus"></i></button>         
        </th>
      </tr>
    </thead>
    <tbody>    
    </tbody> `+
        "</table> </div>" +
        "      <table class='mars-table'>" +
        "        <tr>" +
        "          <td align='right' width='100'> <input class='btn btn-primary' type='submit' id='predict' value='clicca per predire il valore dello SGI' /></td>" +
        "          <td> <input class='btn btn-primary' type='reset' id='restore2' value='ripristina valori originali' />" +
        "          </td>" +
        "        </tr>" +
        "        <tr >" +
        "          <td style='text-align:right !important' ><label title='nuovo valore dello Smart Green Index' class='form-label' for='scci'>predizione</label>" +
        "          </td>" +
        "          <td><input class='form-control' id='ssci' style='text-align:right' disabled></td>" +
        "        </tr>        <tr >" +
        "          <td style='text-align:right !important' ><label title='variazione rispetto al valore iniziale' class='form-label' for='variazione'>variazione</label>" +
        "                  </td>" +
        "          <td> <input class='form-control' id='variazione' type=text style='text-align:right' disabled></td>" +
        "        </tr>      </table>    </form>    </div>    </div>"


    },
      {
        template: `<div class="marsBlackPanel">
        <div class="marsBlackPanel-text">{content}</div>
      </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        symbol: {
          type: "polygonCombine", //大数据面类型，效率高
          styleOptions: {
            color: "#0d3685",
            opacity: 1.0,
            outline: false,
          }
        }
      });
    lodGraphicLayer.on(mars3d.EventType.popupOpen, function (event) {
      initGreenIndexPanel();

    });
  }

  
}
