/* eslint-disable prettier/prettier */
var $modal
var $rem_modal
var $table
var $content
var geoserverUrl = "/forestame"
var SGI_API_URL = "http://10.100.208.140:5000/predict_smart_city_green_index"//config.app.greeenIndexService;
var GENERE_url = geoserverUrl + "/geoserver/wfs?request=GetFeature&version=2.0.0&typeName=mesmart-kpi:v_generi_piante&outputFormat=csv";
var genere_count_url = geoserverUrl + "/geoserver/wfs?request=GetFeature&version=2.0.0&typeName=mesmart-kpi:count_genere&outputFormat=csv&count=10&CQL_FILTER=";
var fase_count_url = geoserverUrl + "/geoserver/wfs?request=GetFeature&version=2.0.0&typeName=mesmart-kpi:count_fase_alberi&outputFormat=csv&CQL_FILTER=";
var crescita_count_url = geoserverUrl + "/geoserver/wfs?request=GetFeature&version=2.0.0&typeName=mesmart-kpi:count_crescita_alberi&outputFormat=csv&CQL_FILTER=";
var tot_alberi_url = geoserverUrl + "/geoserver/wfs?request=GetFeature&version=2.0.0&typeName=mesmart-kpi:tot_alberi_by_tile&outputFormat=csv&CQL_FILTER=";
var stato_count_url = geoserverUrl + "/geoserver/wfs?request=GetFeature&version=2.0.0&typeName=mesmart-kpi:count_stato_vegetazione&outputFormat=csv&CQL_FILTER=";
var stato_null_count_url = geoserverUrl + "/geoserver/wfs?request=GetFeature&version=2.0.0&typeName=mesmart-kpi:count_stato_veg_null&outputFormat=csv&CQL_FILTER=";

var faseanno_url = geoserverUrl + "/geoserver/wfs?request=GetFeature&version=2.0.0&typeName=giotto-planet:v_fasefisiologica_anno&outputFormat=csv&CQL_FILTER=annomese LIKE '";
var where_clause_1 = "geometry_id LIKE '";
var where_clause_2 = "' and annomese LIKE '";

function truncateFixed(valore) {
  return (Math.round(valore * 100) / 100).toFixed(2);
}

function prepareOld() {


  //rows.push({  nome: elt[1], valore: elt[2] });
  $.ajax({
    type: "get",
    url: genere_count_url + where_clause_1 + where_clause_2,
    timeout: 5000,
    success: function (data) {
      var rows = [];
      elements = csvToArray(data);
      for (let elt of elements) {
        if (elt.length > 1) {
          rows.push({
            nome: elt[1],
            valore: elt[2]
          });
        }
      }
      var $tileInfotable = $("#tileInfo-genere");
      $tileInfotable.bootstrapTable("load", rows);
      var classes = [];
      classes.push("table-sm");
      classes.push("table-borderless");

      $tileInfotable.bootstrapTable("refreshOptions", {
        classes: classes.join(" ")
      });
      if (rows.length < 1) {
        var infotext = $("#tipo-alberi");
        infotext.hide();
        $tileInfotable.hide();
      }
    }
  });


  $.ajax({
    type: "get",
    url: fase_count_url + where_clause_1 + where_clause_2,
    timeout: 5000,
    success: function (data) {
      var rows = [];
      elements = csvToArray(data);

      for (let elt of elements) {
        if (elt.length > 1) {
          rows.push({

            nome: elt[1],
            valore: elt[2]
          });
        }
      }
      var $tileInfotable = $("#tileInfo-fase");
      $tileInfotable.bootstrapTable("load", rows);
      var classes = [];
      classes.push("table-sm");
      classes.push("table-borderless");

      $tileInfotable.bootstrapTable("refreshOptions", {
        classes: classes.join(" ")
      });
      if (rows.length < 1) {
        var infotext = $("#fase-alberi");
        infotext.hide();
        $tileInfotable.hide();
      }
    }
  });
  $.ajax({
    type: "get",
    url: crescita_count_url + where_clause_1 + where_clause_2,
    timeout: 5000,
    success: function (data) {
      var rows = [];
      elements = csvToArray(data);

      for (let elt of elements) {
        if (elt.length > 1) {
          rows.push({

            nome: elt[1],
            valore: elt[2]
          });
        }
      }
      var $tileInfotable = $("#tileInfo-sito");
      $tileInfotable.bootstrapTable("load", rows);
      var classes = [];
      classes.push("table-sm");
      classes.push("table-borderless");

      $tileInfotable.bootstrapTable("refreshOptions", {
        classes: classes.join(" ")
      });
      if (rows.length < 1) {
        var infotext = $("#sito-alberi");
        infotext.hide();
        $tileInfotable.hide();
      }

    }
  });
  var tot_alberi_by_tile = 0;
  $.ajax({
    type: "get",
    url: tot_alberi_url + where_clause_1 + where_clause_2,
    timeout: 5000,
    success: function (data) {
      var rows = [];
      elements = csvToArray(data);

      for (let elt of elements) {
        if (elt.length > 1) {
          tot_alberi_by_tile = parseInt(elt[1]);
        }
      }

      $.ajax({
        type: "get",
        url: stato_count_url + where_clause_1 + where_clause_2,
        timeout: 5000,
        success: function (data) {
          var rows = [];
          elements = csvToArray(data);

          for (let elt of elements) {
            if (elt.length > 1) {
              var tot_alberi_stato = parseInt(elt[2]);
              var perc_alberi_stato = truncateFixed(tot_alberi_stato / tot_alberi_by_tile * 100);
              rows.push({

                nome: elt[1],
                valore: perc_alberi_stato,
                um: "%"
              });
            }
          }
          $.ajax({
            type: "get",
            url: stato_null_count_url + where_clause_1 + where_clause_2,
            timeout: 5000,
            success: function (data) {
              elements = csvToArray(data);

              for (let elt of elements) {
                if (elt.length > 1) {
                  var tot_alberi_stato = parseInt(elt[2]);
                  var perc_alberi_stato = truncateFixed(tot_alberi_stato / tot_alberi_by_tile * 100);
                  rows.push({
                    nome: elt[1],
                    valore: perc_alberi_stato,
                    um: "%"
                  });
                }
              }

              var $tileInfotable = $("#tileInfo-stato");
              $tileInfotable.bootstrapTable("load", rows);
              var classes = [];
              classes.push("table-sm");
              classes.push("table-borderless");

              $tileInfotable.bootstrapTable("refreshOptions", {
                classes: classes.join(" ")
              });
              if (rows.length < 1) {
                var infotext = $("#stato-alberi");
                infotext.hide();
                $tileInfotable.hide();
              }

            }
          });
        }
      });

    }
  });

 


}

function restoreSG() {
  $("#sgi").attr("value", null);
  $("#variazione").attr("value", null);
  var sentiment_orig = parseFloat(sentiment);
  var sentiment_round = (Math.round(sentiment_orig * 100) / 100).toFixed(2);
  $("#sentiment").val(sentiment_round);
  var area = parseFloat(area_terre_emerse);
  var area_round = (Math.round(area * 100) / 100).toFixed(2);
  $("#area").val(area_round);

}

function initGreenIndexPanel() {

  if (sgi == "") {
    $("#sgi-old").text("ND");
    document.getElementById("predict").disabled = true;
  }
  else {
    $("#sgi-old").text(sgi);
    document.getElementById("predict").disabled = false;
  }

  where_clause_1 = where_clause_1 + geometry_id
  where_clause_2 = where_clause_2 + annomese + "'";

  var where_clause_3 = annomese + "'";

  const form = document.querySelector("#dss-form")
  form.addEventListener("submit", predict_smart_green)
  form.addEventListener("reset", restoreSG)

   var tbody = $("#table").children("tbody");

  //Then if no tbody just select your table 
  var table = tbody.length ? tbody : $("#table");

  $("#addrow").click(function () {
    //Add row
    var rowCount = $("#table").find("tr").length;
    var genereId = "genere" + rowCount;
    var faseId = "fase" + rowCount;
    var sitoId = "sito" + rowCount;
    var statoId = "stato" + rowCount;
    table.append('<tr><td> <select id="' + genereId + '" ></select></td> <td>   <select id="' + faseId + '"> </td>        <td>   <select id="' + sitoId + '"><option value="si">si</option> <option value="no">no</option> </select> </td>  <td><select id="' + statoId + '"></select></td> <td><input type="number" class="form-control" name="alberi" min=1 step=1 required></td> <td>    <select id="operazione" >     <option value="add">aggiungi</option>     <option value="rem">rimuovi</option>   </select> </td><td><button   class="btn btn-primary"   id="delrow"  ><i class="fa fa-trash"></i></button>  </td>  </tr>   ');
    var elements = ["Ottimo", "Leggermente alterato", "Alterato", "Deperiente", "Morto"];
    var select = document.querySelector("#"+statoId);
    populateSelectWithOptions(select, elements);
   
    $.ajax({
      type: "get",
      url: GENERE_url,
      timeout: 15000,
      success: function (data) {
        elements = csvToArray(data);
        var select = document.querySelector("#" + genereId);
        for (let elt of elements) {
          let option = document.createElement("option");
          option.text = elt[1];
          var txt = elt[1];
          if (txt !== undefined) {
            option.value = txt.trim();
            select.appendChild(option);
          }
  
        }
      },
  
      error: function (request, textStatus) {
        console.log(textStatus);  
      }
    });

    $.ajax({
      type: "get",
      url: faseanno_url + where_clause_3,
      timeout: 5000,
      success: function (data) {
     
        elements = csvToArray(data);
  
        let select = document.querySelector("#"+faseId);
        for (let elt of elements) {
          if (elt.length > 1) {
            if (elt[1].length > 1) {
              let option = document.createElement("option");
              option.value = elt[1];
              option.text = elt[1].split("_")[0];
              select.appendChild(option);
            }
          }
  
        }
  
      }
    });


  

  })

  $("#table").on("click", "#delrow", function () {
    $(this).closest("tr").remove();
  });

}

// create event
$(".create").click(function () {
  showModal($(this).text())
})

// clear event
$(".clear").click(function () {
  $table.bootstrapTable("removeAll")
})

function add(event) {
  event.preventDefault()
  var row = {}

  $content.find("input[name]").each(function () {
    row[$(this).attr("name")] = $(this).val()
  })
  $content.find("select[name]").each(function () {
    row[$(this).attr("name")] = $(this).val()
  })
  var data = $content.data("id")
  if (data == "") {
    var startId = ~~(Math.random() * 100)
    row["id"] = startId + 1

    $table.bootstrapTable("append", row)
  } else {
    row["id"] = ~~(Math.random() * 100)
    $table.bootstrapTable("updateByUniqueId", {
      id: data,
      row: row,
      replace: true
    })

    // $table.bootstrapTable('refresh');
  }
  // $modal.modal("hide")
}

function populateSelectWithOptions(select, elements) {
  for (let elt of elements) {
    let option = document.createElement("option")
    option.text = elt
    option.value = elt
    select.appendChild(option)
  }
}

function csvToArray(str, delimiter = ",") {

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  let array = rows.map(function (line) {
    return line.split(delimiter);
  });

  return array;
}

function predict_smart_green(event) {
  event.preventDefault();
  $("#sgi").attr("value", null);
  $("#variazione").attr("value", null);

  var gen = [], fase_fisiologica = [], sito_crescita = [], numero = [], stato_vegetativo = [], ops = [];

  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i];
    var count = i;
    gen[i - 1] = $("#genere" + count).find(":selected").val()
    fase_fisiologica[i - 1] = $("#fase" + count).find(":selected").val()
    sito_crescita[i - 1] = $("#sito" + count).find(":selected").val()
    numero[i - 1] = row.cells[4].getElementsByTagName("input")[0].value;
    stato_vegetativo[i - 1] = $("#sito" + count).find(":selected").val()
    ops[i - 1] = row.cells[5].getElementsByTagName("select")[0].value

  }
  var data = {
    tile_id: geometry_id,
    annomese: annomese,
    input_data: {
      "urban green": parseFloat($("#sentiment").val()),
      "verde orizzontale": parseFloat($("#area").val()),
      genere: gen,
      "fase fisiologica": fase_fisiologica,
      "sito di crescita naturale": sito_crescita,
      "numero di alberi": numero,
      "stato di vegetazione": stato_vegetativo,
      operazione: ops
    }
  };
  $.ajax({
    data: JSON.stringify(data),
    type: "post",
    url: SGI_API_URL,
    timeout: 2000,
    success: function (data) {
      console.log(data);
      var scci = parseFloat(data["smart_green_index"]);
      var scci_round = (Math.round(scci * 100) / 100).toFixed(2);
      $("#sgi").attr("value", scci_round);
      var variazione = parseFloat(data["delta_green_index"] * 100);
      var var_round = (Math.round(variazione * 100) / 100).toFixed(2);
      $("#variazione").attr("value", var_round + "%");

    },
    error: function (request, textStatus) {
			let resp = request.responseJSON;
			if(!resp) {
				toastr.warning(resp['error']);
			}
			else {
				toastr.warning(textStatus);
			}		

    },
  });
}
