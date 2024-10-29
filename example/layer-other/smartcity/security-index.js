var API_URL = "http://10.100.208.140:5000/predict_smart_city_security_index";


function saveSI(event) {
    var prediction_service_url = API_URL;
    event.preventDefault();
    $("#ssci").attr("value", null);
    $("#variazione").attr("value", null);

    var newInput = {
        sentiment: parseFloat($("#sentiment").val()),
        footfall: parseFloat($("#footfall").val()),
        degrado: parseInt($("#degrado").val()),
        incendio: parseInt($("#incendi").val()),
        incidente: parseInt($("#incidenti").val()),
        crimini: parseInt($("#crimini").val()),
        prov_precedenza: parseInt(prec),
        prov_velocita: parseInt(prov_velocita),
        prov_posizione: parseInt(prov_posizione),
        prov_documenti: parseInt(prov_documenti),
        prov_sosta: parseInt(prov_sosta),
        prov_segnaletica: parseInt(prov_segnaletica),
        n_telecamere: parseInt($("#telecamere").val()),
        n_pali_luce: parseInt($("#pali").val())
    };
    var tileInfo = {
        sentiment: parseFloat(sentiment),
        footfall: parseFloat(footfall),
        degrado: parseInt(degrado),
        incendio: parseInt(incendi),
        incidente: parseInt(incidenti),
        crimini: parseInt(crimini),
        prov_precedenza: parseInt(prec),
        prov_velocita: parseInt(prov_velocita),
        prov_posizione: parseInt(prov_posizione),
        prov_documenti: parseInt(prov_documenti),
        prov_sosta: parseInt(prov_sosta),
        prov_segnaletica: parseInt(prov_segnaletica),
        n_telecamere: parseInt(telecamere),
        n_pali_luce: parseInt(pali),
        scsi: parseFloat(indice)
    };
    var data = {
        tile_info: tileInfo,
        new_input: newInput
    };
    $.ajax({
        data: JSON.stringify(data),
        type: "post",
        url: prediction_service_url,
        timeout: 2000,
        success: function (data) {
            console.log(data);
            var scci = parseFloat(data["smart_city_security_index"])
            var scci_round = (Math.round(scci * 100) / 100).toFixed(2);
            $("#ssci").attr("value", scci_round);          
            var variazione = ((scci / indice) * 100) - 100;
            var var_round = (Math.round(variazione * 100) / 100).toFixed(2);
            $("#variazione").attr("value", var_round + "%");

        },
        error: function (request, textStatus) {
            toastr.warning(textStatus);

        },
    });
}


function restoreSI() {
    $("#ssci").attr("value", null);
    $("#variazione").attr("value", null);
    
    if (sentiment == "" && footfall == "" && incendi == "0" && incidenti == "0" && telecamere == "0" && crimini == "0" && pali == "0" && degrado == "0") {
        $("#ssci-old").text("ND");
    }
    else {
        $("#ssci-old").text(indice);
    }
    $("#sentiment").val(parseFloat(sentiment));
    $("#footfall").val(parseFloat(footfall));
    $("#incendi").val(parseInt(incendi));
    $("#incidenti").val(parseInt(incidenti));
    $("#telecamere").val(parseInt(telecamere));
    $("#crimini").val(parseInt(crimini));
    $("#pali").val(parseInt(pali));
    $("#degrado").val(parseInt(degrado));

    $("#prov_doc").val(prov_documenti);
    $("#prov_vel").val(prov_velocita);
    $("#prov_pos").val(prov_posizione);
    $("#prov_sos").val(prov_sosta);
    $("#prov_segn").val(prov_segnaletica);
    $("#prov_prec").val(prec);

}

