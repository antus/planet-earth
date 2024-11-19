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
var geom_ssi;
//variabili green index
var sgi;
var verde_oriz;
var peso_chioma_perc;
var somma_area_chioma;
var area_terre_emerse;
var geometry_id;
var annomese;
var sentiment_gi;
var geom_sgi;
var graphicLayer;
var mapOptions = {
  scene: {

    center: { lat: 42.32079612459104, lng: -71.1273615786857, alt: 30000, heading: 0, pitch: -90 }
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

  layers: []

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
      maxmin: true,
      resize: false,
      close: false
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
  widgets: [
    {
      "name": "Layer attributes",
      "uri": "widgets/antus/layer-table/widget.js"
    }
  ]
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
  addSTIicLayer();
  addPoiLayer();
  graphicLayer = new mars3d.layer.GraphicLayer({
    "name": "Predictions",
    "pid": 0,
    "show": true
  });
  map.addLayer(graphicLayer);
  map.openFlyAnimation({
    duration1: 5,
    easingFunction1: Cesium.EasingFunction.QUINTIC_IN_OUT,
    callback: function () {
      // Callback after animation playback is completed
    }
  })

  function initTravelIndexChart(container, data) {
    var myChart = echarts.init(container.querySelector("#ul_ZJLY"));
    var option;

    option = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '90%',
          min: 0,
          max: 1,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.2, '#ff0000'],
                [0.4, '#ff9900'],
                [0.6, '#ffff00'],
                [0.8, '#addd8e'],
                [1, '#31a354']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#f0f0f0',
            fontSize: 14,
            rotate: 'tangential',
            formatter: function (value) {
              return value * 100;
            }
          },
          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 18,
            color: "#f0f0f0"
          },
          detail: {
            fontSize: 18,
            offsetCenter: [0, '-35%'],
            valueAnimation: true,
            formatter: function (value) {
              return value * 100 + '';
            },
            color: 'inherit'
          },
          data: [
            {
              value: data,
              name: 'Smart Tourism Index'
            }
          ]
        }
      ]
    };

    option && myChart.setOption(option);
    return myChart;
  }

  function addSSIicLayer() {
    smartSecurityLayer = new mars3d.layer.WmsLayer({
      "name": "Smart Security Index",      
			"type": "wms",
      "url": "/forestame/geoserver/wms",
      "layers": "boston:smart_security_index_2",
			"parameters": { "transparent": "true", "format": "image/png" },
			"opacity":0.6,
      "show":false
    });
    bindToLegend(smartSecurityLayer, buildLegend);
    bindSSILayerPopup(smartSecurityLayer);
    map.addLayer(smartSecurityLayer);
  /*  smartSecurityLayer = new mars3d.layer.GeoJsonLayer({
      "name": "Smart security index",
      "type": "geojson",
      "url": "/config/geojson/smartsecurity.json"
    }
    );*/
    smartSecurityLayer.flyTo();
    //   map.addLayer(smartSecurityLayer);


  }

  function addPoiLayer() {
    var poi = new mars3d.layer.WmsLayer({
      "name": "Smart Tourism PoI",      
			"type": "wms",
      "url": "/forestame/geoserver/wms",
      "layers": "boston:poi",
			"parameters": { "transparent": "true", "format": "image/png" },
			"opacity":1,
      "show": false,
      "popup": "<b>{category}</b> <br> <u>{typ}</u><br> <b>{name}</b>"
    });
    bindToLegend(poi, buildLegend);
    map.addLayer(poi);
  }

  function addSTIicLayer() {
    var travel_barometer = new mars3d.layer.WmsLayer({
      "name": "Smart Tourism Index",      
			"type": "wms",
      "url": "/forestame/geoserver/wms",
      "layers": "boston:smart_tourism_index",
			"parameters": { "transparent": "true", "format": "image/png" },
			"opacity":0.6,
      "show": false
    });
    bindToLegend(travel_barometer, buildLegend);
    travel_barometer.bindPopup(
      function (event) {
        let attr = event.features[0]?.properties;
        var index = parseFloat(attr.index_value)
				if( !isNaN(index)) {
					index = index.toFixed(2);
				}
				else {
					index = "ND"
				}
					
        //return "  <div class='chartTwo' id='chartTwo' style='width:450px; height:450px;'>  " +
        //  "<div id='ul_ZJLY' class='chartTwo_ulzjly' style='width:100%; height:100%;'></div></div>" +
        return "	<table class='mars-table'>"+
"		<tr>"+
"			<td >"+
"				<label title='' style='font-size:18px' class='form-label'>Smart Tourism Index: &nbsp;</label>"+
"			</td><td>	<label style='font-size:18px'>"+index+"</label></tr>"+
"<tr><td colspan='2'><em>Misura lo stato del comparto turistico della destinazione.<br> L’indice è composto da tre sotto-indicatori che combinati tra loro restituiscono<br> un valore compreso tra 0 (molto negativo) e 100 (ideale):<br>sentiment espresso sui social; Digital Reviews, ossia le recensioni espresse in rete; <br>Digital Presence, ossia i POI attivi (per recensioni) su territorio .<br> La metodologia si basa sull’analisi di alcune industrie prese a riferimento <br>e appartenente tutte al settore travel:<br> Hospitality, Food & beverage, Attractions, Entertainment, Short term rentals, Transportation.</em></td></tr>"+
"			</td></tr></table>"+
          "<hr><p> Punti di interesse:</p><table id='poitable' data-toggle='poitable' class='mars-table'/>";
      },
      {
        template: `<div class="marsBlackPanel">
                      <div class="marsBlackPanel-text">{content}</div>
                    </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
      }
    )


    let gdpCharts = null;
    travel_barometer.on(mars3d.EventType.popupOpen, function (event) {
      let container = event.container; //popup
      let attr = event.features[0]?.properties;
      $poitable = $("#poitable").bootstrapTable({
       
        singleSelect: true, //Single selection
        iconsPrefix: "fa",
        pagination: false,

        columns: [
          {
            title: "Categoria", //serial number
            field: "categoria",
            sortable: false,
            align: "left",
            width: 100,

          },
          {
            field: "count",
            title: "TOT",
            sortable: false,
            align: "left",
            width: 100
          }]
      });
      data = attr.index_value / 100;
      geojson = event.features[0]?.data.geometry;
      geom = toWKT(event.features[0].data);
      let extent = event.features[0]?.data.bbox
      //gdpCharts = initTravelIndexChart(container, data);
      /*var poiQuery = "/geoserver/wfs?request=GetFeature&version=2.0.0&typeName=boston:poi&outputFormat=csv&CQL_FILTER=within(geom, SRID=4326;" + geom + ")";
      $.ajax({
        type: "get",
        url: poiQuery,
        timeout: 5000,
        success: function (result) {

          haoutil.msg("共查询到 " + result.count + " 条记录！");

          // geoJsonLayer.load({ data: result.geojson });
        },
        error: (error, msg) => {
          console.log("服务访问错误", error);
          haoutil.alert(msg, "服务访问错误");
        },
      });*/
      var payloadTemplate;
      fetch("payload.xml")
        .then((response) => response.text())
        .then((xmlString) => {
          // Set payload template
          payloadTemplate = xmlString;
          /* var dom = $("#dchart-" + this.properties.id)[0];
           this.chart = echarts.init(dom, 'dark', {
             renderer: 'canvas',
             useDirtyRect: false
           });*/

          const bbox = extent[0] + " " + extent[1] + " " +
            extent[0] + " " + extent[3] + " " +
            extent[2] + " " + extent[3] + " " +
            extent[2] + " " + extent[1] + " " +
            extent[0] + " " + extent[1];

          xmlString = xmlString.replace("$layer", "boston:poi");
          xmlString = xmlString.replace("$yAttribute", "osm_id");
          xmlString = xmlString.replace("$xAttribute", "category");
          xmlString = xmlString.replace("$function", "Count");
          xmlString = xmlString.replace("$bbox", bbox);
          //console.log(xmlString);
          var url = "/forestame/geoserver/wps?service=WPS&version=1.0.0&REQUEST=Execute"
          const ref = this;
          // Send the data using post
          $.ajax({
            url: url,
            data: xmlString,
            type: 'POST',
            contentType: "application/xml",
            dataType: "text",
            success: function (result) {
              const res = JSON.parse(result);



              var rows = [];

              for (let elt of res.AggregationResults) {
                if (elt.length > 1) {
                  rows.push({

                    categoria: elt[0],
                    count: elt[1]
                  });
                }
              }

              $poitable.bootstrapTable("load", rows);
              var classes = [];
              classes.push("table-sm");
              classes.push("table-borderless");

              $poitable.bootstrapTable("refreshOptions", {
                classes: classes.join(" ")
              });
              //   ref.buildChart(res, ref.properties.type);
            },
            error: function (xhr, ajaxOptions, thrownError) {
              console.log(xhr.status);
              console.log(thrownError);
            }
          });

        });
    });
    travel_barometer.on(mars3d.EventType.popupClose, function (event) {
      let container = event.container; //popup
      console.log("close popup", container);
      if (gdpCharts) {
        gdpCharts.dispose();
        gdpCharts = null;
      }


    });
    map.addLayer(travel_barometer);

  }

  function toWKT(geojsonObject) {
    if (geojsonObject == null) {
      return null;
    }
    geojsonObject = haoutil.system.clone(geojsonObject);



    var wkt = Terraformer.WKT.convert(geojsonObject.geometry);


    return wkt;
  }

  function addSGIicLayer() {
    smartGreenLayer = new mars3d.layer.WmsLayer({
      "name": "Smart Green Index",
      "pid": 0,
      "type": "wms",
      "url": "/forestame/geoserver/wms",
      "layers": "boston:smart_green_index_2",
      "opacity": 0.6,
      "parameters": { "transparent": "true", "format": "image/png" },
      "getFeatureInfoParameters": {
        feature_count: 10
      },
      "show":false
      }
    );
    bindToLegend(smartGreenLayer, buildLegend);

    map.addLayer(smartGreenLayer);

    bindSGILayerPopup(smartGreenLayer);


  }

  function bindSSILayerPopup(lodGraphicLayer) {
      lodGraphicLayer.bindPopup(function (event) {
      let attr = event.features[0]?.properties;;
      geom_ssi = event.features[0]?.data.geometry;

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
			ssi_text = parseFloat(attr.smart_security_city_index ).toFixed(2);
			if (isNaN(ssi_text)) {
				ssi_text = "ND"
			}
				
      return "<div class='modal-header-sci'> " +
      "<hr><label title='L’Indice misura il grado di sicurezza urbana' style='font-size:18px'>Smart Security Index:&nbsp; </label>" +   
      "<label id='ssci-old' style='font-size:18px' >" + ssi_text + "</label>" +

        " <hr>         <h4>Decision Support System</h4>" +
        "            <em>Predice il valore dell’Indice sulla Sicurezza modificando le seguenti variabili:</em>" +
        "        </div>" +
        "        <form role='form' id='dss-form'>" +
        "           <div>" +
        "                <table class='mars-table'>" +   
        "                    <tr>" +
        "                      <td > " +
        "                        <label for='sentiment' data-toggle='tooltip' title='indice basato sul giudizio estratto e calcolato sui contenuti online (reviews) sui Social Media'>sentiment</label>" +
        "                          </td> <td> <input class='form-control' id='sentiment'  name='sentiment' type=number step=0.01  min=0 max=100  required data-toggle='tooltip' title='inserire un valore tra 0 e 100' value='" + attr.sentiment + "'>" +
        "                      </td>  <td> " +
        "                          <label  for='footfall' data-toggle='tooltip' title='traffico pedonale/popolarità del POI che tiene conto del numero di recensioni geolocalizzate, numero di contenuti sui social media, dati originati da dispositivi mobili'>footfall</label>" +
        "                            </td> <td>" +
        "                            <input class='form-control' id='footfall'  type=number min=0 max=150 step=0.01 required data-toggle='tooltip' title='inserire un valore tra 0 e 150' value='" + attr.footfall + "'>" +
        "                        </input>" +
        "                      </td>" +
        "                    </tr>" +
        "                  <tr>" +
        "                     <td >" +
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
            "                </table>" +           
"<hr>"+
"	<em>Variabili considerate nel calcolo dell'indice e non editabili</em>"+
"	<table class='mars-table'>"+
"		<tr>"+
"			<td >"+
"				<label title='somma degli incidenti con violazioni degli articoli 154, 149, 143, 148 e 144 del codice della strada' class='form-label'>violazione di posizione</label>"+
"			</td><td>	<input class='form-control' value="+prov_posizione+" id='prov_pos' type=number disabled/>"+
"			</td>"+
"			<td >"+
"				<label class='form-label' title='somma degli incidenti con violazioni dell' articolo 141 del codice della strada'>violazione di velocità</label>"+
"			</td><td><input class='form-control' value="+prov_velocita+" type=number disabled/>"+
"		</td>"+
"	</tr>"+
"	<tr>"+
"		<td >"+
"			<label class='form-label' title='somma degli incidenti con violazioni degli articoli 145 e 150 del codice della strada'>violazione di precedenza</label>"+
"		</td><td>	<input class='form-control' value="+prec+" type=number disabled/>"+
"		</td>"+
"		<td >"+
"			<label title='somma degli incidenti con violazioni degli articoli 158 e 157 del codice della strada' class='form-label'>violazione di sosta</label>"+
"		</td><td>	<input class='form-control' value="+prov_posizione+" type=number disabled/>"+
"		</td>"+
"	</tr>"+
"	<tr>"+
"		<td >"+
"			<label class='form-label'  title='somma degli incidenti con violazioni degli articoli 40, 41 e 146 del codice della strada'>violazione di segnaletica</label>"+
"		</td><td>	<input class='form-control' value="+prov_segnaletica +" type=number disabled/>"+
"		</td>"+
"		<td >"+
"			<label class='form-label' title='somma degli incidenti con violazioni degli articoli 80, 193, 116, 180, 126, 94 e 93 del codice della strada'>violazione di documenti</label>"+
"		</td><td>	<input class='form-control' value="+prov_documenti+" type=number disabled/>"+
"		</td>"+
"	</tr>"+
"</table>"+

        "            </div>" +
        "        <hr>  " +
        " <table class='mars-table'>" +
        "                 <tr> <td  width='100'>   <input class='btn btn-primary' type='submit' value='Predizione dello SSCI'/></td>" +
        "          <td> <input class='btn btn-primary' type='button' onclick='restoreSI()' type='reset' id='restore' value='ripristina valori originali' /></td>" +
        "              </tr>" +
        "                <tr >"+
        "<td style='text-align:right !important' >" +
        "                    <label title='nuovo valore dello Smart Security City Index' style='text-align:right' >predizione</label>" +
        "                  </td> <td> <input class='form-control' id='ssci' disabled>" +
        "                </tr>" +
        "                <tr>" +
        " <td style='text-align:right !important' >" +
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
      let attr = event.features[0]?.properties;;
      geom_sgi = event.features[0]?.data.geometry;
      sgi = attr.sgi;
      sentiment_gi = attr.urban_green_index;
      verde_oriz = attr.somma_area_verde_oriz;
      peso_chioma_perc = attr.perc_peso_chioma;
      somma_area_chioma = attr.somma_area_chioma;
      area_terre_emerse = attr.area_terre_emerse;
      annomese = attr.annomese;
      geometry_id = attr.geometry_id;
      form_area_chioma = !(somma_area_chioma)? 'ND' : parseFloat(somma_area_chioma).toFixed(2);
      form_peso_chioma_perc = !(peso_chioma_perc)? 'ND' : parseFloat(peso_chioma_perc).toFixed(2);
      form_area_terre_emerse = !(area_terre_emerse)? 'ND' : parseFloat(area_terre_emerse).toFixed(2);
      return `<ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                  <button class="nav-link"  id="home-tab" role="presentation" data-bs-toggle="tab" data-bs-target="#home" data-bs-toggle="tab" data-bs-target="#home" aria-selected="false">Info</a>
                </li>
                <li class="nav-item"  id="profile-tab"  role="presentation" data-bs-toggle="tab" data-bs-target="#dss" type="button" role="tab" aria-controls="profile"  aria-selected="true">
                 <button class="nav-link active">Decision Support System</button>
                </li>
              </ul>
  <div class="tab-content" id="myTabContent">
  <div class="tab-pane fade" id="home" role="tabpanel" aria-labelledby="home-tab">
 
 <table class='mars-table' style='border-right: 1px solid'>
  <tr>
    <td>
      <b>Variabili considerate nel calcolo dell'indice e non editabili:</b>
      <table >
        
        <tr>
          <td>
            <label  title="area in m² delle chiome degli alberi presenti nella tile (misurazione verde verticale)" for="area_chioma">Area chiome </label>
            
          </td>
          <td>`+
            "  <label>" + form_area_chioma + " m²</label>" +
            ` </td> 
               <td>
            <label title="coefficiente che caratterizza la qualità della chioma dell’albero in base al suo stato vegetativo, combinazione lineare degli alberi presenti nella tile, rapportato rispetto all’area totale delle chiome della tile.">Percentuale peso chioma</label>
          </td>
          <td>` +
            "  <label >" +  form_peso_chioma_perc + "</label>" +
            `</td>    </tr>
        <tr>
          <td>
            <label title="area in m² delle terre emerse">Area terre emerse </label>            
          </td>
          <td>`+
           "  <label >" +  form_area_terre_emerse+ " m²</label>" +
         "</td>   <td>"+
           `<label title="Numero totale di alberi">Numero di alberi </label>            
          </td>
          <td>`+
           "  <label id='tot_alb_tile'>" +  10 + " </label>" +
         "</td>   </tr>"         +
        `  <tr><td colspan='2' id="fase-alberi"> <b >Fase fisiologica degli alberi:</b>`+
      "<div class='chartTwo' id='chartTwo' >" +
      "<div id='ul_ZJLY' class='chartTwo_ulzjly'></div>" + 
    "</div></td>" +
    "<td colspan='2'><b id='tipo-alberi'  title='Top 10 tipologia alberi presenti nella tile'>Tipologia alberi:</b><div class='chartTwo' id='chartTwo' >" +
    "<div id='ul_ZJLY2' class='chartTwo_ulzjly'></div>" + 
  "</div></td></tr>" +

     "<tr><td colspan='2' id='sito-alberi'><b >Sito di crescita degli alberi:</b><div class='chartTwo' id='chartTwo' >" +
    "<div id='ul_ZJLY3' class='chartTwo_ulzjly'></div></td>" + 
    "<td colspan='2' id='stato-alberi'> <b >Stato di vegetazione degli alberi:</b><div class='chartTwo' id='chartTwo' >" +
    "<div id='ul_ZJLY4' class='chartTwo_ulzjly'></div>" + 
       `   </td></tr></table>
  </tr> 
</table>
</div><div class="tab-pane fade show active" id="dss" role="tabpanel" aria-labelledby="profile-tab"> `+     
"<div><label title='L’Indice misura misura il grado di benessere del verde,in relazione alla copertura arborea, allo stato manutentivo e alla percezione dei cittadini registrata online. L’Indice correla dati provenienti da fonti eterogenee, tra cui dataset provenienti dal censimento arboreo, dati satellitari (Copernicus) e dati OSINT (web e social media).' style='font-size:18px'>Smart Green Index:&nbsp;</label>" +

        "<label style='font-size:18px' id='sgi-old' value='" + attr.sgi + "'/></div>"+  
"<em>Misura il benessere dello stato vegetativo comunale sia in termini di copertura e stato vegetativo che in termini di percezione. <br>Utilizza i seguenti dataset e indicatori per fornire un valore sintetico misurabile da 0 (situazione peggiore) a 100 (situazione ideale): <br>censimento sul patrimonio arboreo del Comune; stato vegetativo misurato dagli operatori comunali attraverso rilevazioni sul campo; <br>dati satellitari sulla copertura del verde (agenzia Copernicus); percezione del verde pubblico rilevata sulle fonti digitali</>"+        
        "<div class='modal-header-sci'>" +          
        "  <hr> <h4>Decision Support System</h4>" +
        "    <em>Predice il valore dello  Smart Green Index per questo tile</em>" +
        "  </div>  " +
        "<div>" +
        "    <form role='form' id='dss-form' action='#'>" +
        "      <em>modificando le seguenti variabili:</em>" +
        "      <table class='mars-table'>" +
        "        <tr>" +
        "          <td>" +
        "            <label for='area' title='area in m² delle aree verdi incluse nel tile' >verde orizzontale (m²)</label>" +
        "           </td>" +
        "          <td><input class='form-control' id='area' name='area' min=0 type=number step=0.01 required value='" + parseFloat(attr.somma_area_verde_oriz).toFixed(2) + "'/></td>" +
        "           <td> <label class='form-label' for='sentiment' title='indice del POI che tiene conto del numero di recensioni geolocalizzate, numero di contenuti sui social media, dati originati da dispositivi mobili'>percezione del verde</label>" +
        "                    </td>" +
        "          <td> <input class='form-control' id='sentiment' min=0 type=number step=0.01  required value='" + parseFloat(attr.urban_green_index).toFixed(2) + "'></td>" +
        "        </tr>               " +
        " <tr>" +
        "</table>" +
        " <hr> <div   id='table-scroll'>   <table id='table'  class='mars-table'>" +
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
        "          <td align='right' width='100' colspan='2'>  <input class='btn btn-primary' type='submit' id='predict' value='clicca per predire il valore dello SGI' /></td>" +
        "          <td> <input class='btn btn-primary' type='reset' id='restore2' value='ripristina valori originali' />" +
        "          </td>" +
        "        </tr>" +
        "        <tr >" +
        "          <td style='text-align:right !important' ><label title='nuovo valore dello Smart Green Index' class='form-label' for='scci'>predizione</label>" +
        "          </td>" +
        "          <td><input class='form-control' id='sgi' style='text-align:right' disabled></td>" +
        "        </tr>        <tr >" +

        "          <td style='text-align:right !important' ><label title='variazione rispetto al valore iniziale' class='form-label' for='variazione'>variazione</label>" +
        "                  </td>" +
        "          <td> <input class='form-control' id='variazione' type=text style='text-align:right' disabled></td>" +
        "        </tr>      </table>    </form>    </div>      </div>"

    },
      {
        template: `<div class="marsBlackPanel">
        <div class="marsBlackPanel-text">{content}</div>
      </div>`,
      offsetY:0, 
      offsetX:0,
        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        autoCenter: true
        
      });
    lodGraphicLayer.on(mars3d.EventType.popupOpen, function (event) {
      var point = event.cartesian;
      const extent = map.getExtent({scale:0.5});
      const bbox = [extent.xmin, extent.ymin, extent.xmax, extent.ymax]
      const result = mars3d.PolyUtil.getGridPoints(bbox, 20, 30)
      const pt1 = mars3d.LngLatPoint.fromCartesian(point)
      const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(pt1, 270, result.radius)
      const mpt = mars3d.LngLatPoint.fromCartesian(pt2)
    //  const ptNew = proj4Trans([mpt.lng, mpt.lat], "EPSG:4326", CRS.CGCS2000_GK_Zone_3)

     
    /*   ${map.getLangText("_Longitude")}:${mpt.lng}, ${map.getLangText("_latitude")}:${mpt.lat}, ${map.getLangText("_elevation" )}:${mpt.alt},
       ${map.getLangText("_abscissa")}:${ptNew[0].toFixed(1)}, ${map.getLangText("_ordinate")}:${ptNew[1].toFixed( 1)} (CGCS2000)
      `*/
      map.setCameraView({ y: mpt.lat, x: mpt.lng, alt: 30000, })

      initGreenIndexPanel();
      const container = event.container;
      initChartFaseAlberi(container);
      var tab1 = container.querySelector("#profile-tab");
      tab1.addEventListener("click", (e) => {
        openTab(e, "dss")
      })
      var tab2 = container.querySelector("#home-tab");
      tab2.addEventListener("click", (e) => {
        openTab(e, "home")
      })
    });
  }

  function buildLegend(layer, show){
    var htmllegend ='';
    var el = document.getElementById("legend_"+layer.id)

    if(show) {
      if(el  == undefined) {
          var url="http://10.100.208.140:8090/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="+ layer.options.layers
        
          htmllegend +=' <div id="legend_'+layer.id+'" class="layui-layer-content" style="padding:8px">'
          const image = document.createElement('img')
          image.src = url + "&LEGEND_OPTIONS=forceLabels:on";
          image.style="margin-right:5px";
          
          htmllegend+='<span class="processId" style="font-size:12px;color:white">'+image.outerHTML+layer.name  +'</span></div>';
          $('#chart-legend').append(htmllegend);
      }
      else  {
        el.style.display = 'block'

      }
    }
    else if(!show && el != undefined) {
      el.style.display = 'none'

    }
    
  }

  function openTab(evt, tabId) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tab-pane");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
      tabcontent[i].className += " show";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("nav-link");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabId).style.display = "block";
    evt.currentTarget.className += " active";
  }




}
function bindToLegend(layer, buildLegend) {
  layer.on("show", (e) => {
    buildLegend(layer, true)
  })
  layer.on("hide", (e) => {
    buildLegend(layer, false)
  })
  buildLegend(layer, false)
}

