
$(document).ready(function () {

  if ("{{ flash_message }}" == "1") {
    // console.log("ssss");
  } else {
    console.log("{{ flash_message }}");
  }


  var dates;
  $(document).ready(function () {

    $.ajax({
      url: "/getDates",
      type: "POST",
      success: function (data) {
        dates = data;
      },
    });
  });
  
  window.nastavMinKonce = function nastavMinKonce(sel) {
    var el = $("#NahledModalNastavenieKonec")[0];
    $("#NahledModalNastavenieKonec").attr({
      // substitute your own
      "min": sel.value         // values (or variables) here
    });
    enforceMinMax(el);
  }
  window.enforceMinMax = function enforceMinMax(el) {

    var dateEndChoosen = new Date("11/21/1987 " + el.value + "");
    var dateEndMin = new Date("11/21/1987 " + el.min + "");

    if (el.value != "") {
      if (dateEndChoosen < dateEndMin) {
        el.value = el.min;
      }

    }
  }
  $("body").delegate("#dateOfNahled", "focusin", function () {
    $(this).datepicker({
      dateFormat: 'dd/mm/yy',
      beforeShowDay: function (date) {
        var string = jQuery.datepicker.formatDate('yy-mm-dd', date);

        return [dates.indexOf(string) != -1]
      }
    });
  });
  window.setParUTLandLTL = function setParUTLandLTL(sel) {
    TMDict = JSON.parse(sel.value);
    $('#ltl').val(TMDict.ltl);
    $('#utl').val(TMDict.utl);
  }
  window.setOptionTM = function setOptionTM(sel) {
    $("#listTrecMat").val($("#listTrecMat option:first").val());
    if (sel.value == 1) {
      $(document).find('#skalaNahled').html("váhy  ");
      $(document).find('.WEIGHT2').removeClass("d-none");
      $(document).find('.THICKNESS2').addClass("d-none");

    } else if (sel.value == 2) {
      $(document).find('#skalaNahled').html("tloušťky  ");
      $(document).find('.WEIGHT2').addClass("d-none");
      $(document).find('.THICKNESS2').removeClass("d-none");
    } else {
      $(document).find('.WEIGHT2').addClass("d-none");
      $(document).find('.THICKNESS2').addClass("d-none");
      if (sel.value == 3) {
        $(document).find('#skalaNahled').html("vlhkosti  ");

      } else {
        $(document).find('#skalaNahled').html("váhy  ");

      }
    }
  }
})