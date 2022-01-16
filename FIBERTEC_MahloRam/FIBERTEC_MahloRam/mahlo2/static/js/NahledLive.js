$(document).ready(function () {

  $(document).ready(function () {
    var el = $('#headRow');
    const machString = "machine side"
    const operString = "operator side"
    var j = 0;
    var k = 0;
    for (i = 0; i < 140; i++) {
      if (i > 12 && i < 25) {
        el.append('<th>' + machString.charAt(j) + '</th>');
        j++;
      } else if (i > 111 && i < 125) {
        el.append('<th>' + operString.charAt(k) + '</th>');
        k++;
      } else {
        el.append('<th></th>');
      }
    }
  });
  window.setParUTLandLTL = function setParUTLandLTL(sel) {
    TMDict = JSON.parse(sel.value);
    $('#ltlSPUSTIT').val(TMDict.ltl);
    $('#utlSPUSTIT').val(TMDict.utl);
  }

  window.setOptionTM = function setOptionTM(sel) {
    $("#listTrecMatLive").val($("#listTrecMatLive option:first").val());
    if (sel.value == 1) {
      $(document).find('#skalaNahledLive').html("váhy");
      $(document).find('.WEIGHT2Live').removeClass("d-none");
      $(document).find('.THICKNESS2Live').addClass("d-none");

    } else if (sel.value == 2) {
      $(document).find('#skalaNahledLive').html("tloušťky");
      $(document).find('.WEIGHT2Live').addClass("d-none");
      $(document).find('.THICKNESS2Live').removeClass("d-none");
    } else {
      $(document).find('.WEIGHT2Live').addClass("d-none");
      $(document).find('.THICKNESS2Live').addClass("d-none");
      if (sel.value == 3) {
        $(document).find('#skalaNahledLive').html("vlhkosti");

      } else {
        $(document).find('#skalaNahledLive').html("váhy");

      }
    }
  }
})