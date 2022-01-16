$(document).ready(function () {

    Number.prototype.countDecimals = function () {
        if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
        return this.toString().split(".")[1].length || 0;
    }
    function round3(value) {
        var numOfDecPoints = value.countDecimals();
        if (numOfDecPoints > 0) {
            if (numOfDecPoints < 3) {
                return value.toFixed(numOfDecPoints);
            }
            return value.toFixed(3);
        }
        return value;
    }
    var compareHex = (hex) => {
        var hexString = document.createElement('div')
        hexString.style.backgroundColor = `${hex}`
        return hexString.style.backgroundColor
    }
    $(document).ready(function () {
        var tableData = [];
        var printIcon = function (cell, formatterParams, onRendered) { //plain text value
            return '<i class="fas fa-trash-alt"></i>';
        }

        $.ajax({
            url: "/get_TrecieMaterialy",
            context: document.body,
            success: function (data) {

                let i = 0;
                data.forEach(element => {
                    i++;
                    tableData.push({ CR: i, id: element.ID, Druh: element.IDDRUH, Nazev: element.NAZOV, LTL: round3(element.LTL), UTL: round3(element.UTL), originLTL: round3(element.LTL), originUTL: round3(element.UTL), img: "trash-alt-solid.svg" },)

                });
                poleVymaz = [];
                poleVymazCR = [];

                var table = new Tabulator("#TMTabel", {
                    data: tableData,
                    index: "CR",
                    layout: "fitDataTable",
                    responsiveLayout: "hide",
                    columns: [
                        {
                            title: "<button id='myButtonFPVymazOzn'class='myButtonVymazOzn'>Vymaž označené</button><button id='myButtonFPUlozOzn' class='myButtonUlozOzn'>Ulož označené</button>"
                            , columns: [
                                { title: "Č. řádku", field: "CR", width: 100, hozAlign: "center", headerHozAlign: "center" },
                                { title: "Druh", field: "Druh", width: 150, hozAlign: "center", headerHozAlign: "center" },
                                { title: "Název", field: "Nazev", width: 250, headerHozAlign: "center" },
                                {
                                    title: "LTL", field: "LTL", width: 150, hozAlign: "center", headerHozAlign: "center", editor: "number", cellEdited: function (cellL) {
                                        let riadokL = cellL.getRow();
                                        let dataL = riadokL.getData();
                                        let valL = dataL.LTL;
                                        let elL = riadokL.getElement().children[3];
                                        if (valL == "") {
                                            valL = "0";
                                        }
                                        if (parseInt(valL) < 0) {
                                            valL = valL * (-1);
                                        }
                                        if (parseInt(valL) > parseInt(dataL.UTL)) {
                                            valL = parseInt(dataL.UTL);
                                        }
                                        riadokL.update({ "LTL": valL });

                                        if (elL.style.backgroundColor === compareHex('#2f35ae7c') && dataL.LTL == dataL.originLTL) {
                                            elL.style.backgroundColor = "";
                                        } else if (dataL.LTL != dataL.originLTL) {
                                            elL.style.backgroundColor = "#2f35ae7c";
                                        }

                                    }
                                },
                                {
                                    title: "UTL", field: "UTL", width: 150, hozAlign: "center", headerHozAlign: "center", editor: "number", cellEdited: function (cellU) {
                                        let riadokU = cellU.getRow();
                                        let dataU = riadokU.getData();
                                        let valU = dataU.UTL;
                                        let elU = riadokU.getElement().children[4];
                                        if (valU == "") {
                                            valU = "0";
                                        }
                                        if (parseInt(valU) < 0) {
                                            valU = valU * (-1);
                                        }
                                        if (parseInt(valU) < parseInt(dataU.LTL)) {
                                            valU = parseInt(dataU.LTL);
                                        }
                                        riadokU.update({ "UTL": valU });

                                        if (elU.style.backgroundColor === compareHex('#2f35ae7c') && dataU.UTL == dataU.originUTL) {
                                            elU.style.backgroundColor = "";
                                        } else if (dataU.UTL != dataU.originUTL) {
                                            elU.style.backgroundColor = "#2f35ae7c";
                                        }

                                    }
                                },
                                {
                                    title: "DEL", formatter: printIcon, width: 60, hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", cellClick: function (e, cell) {
                                        if (cell.getRow().getElement().style.backgroundColor === compareHex('#fb5e5e')) {
                                            const index = poleVymaz.indexOf(parseInt(cell.getRow().getData().id));
                                            const indexCR = poleVymaz.indexOf(parseInt(cell.getRow().getData().CR));
                                            if (index > -1) {
                                                poleVymaz.splice(index, 1);
                                                poleVymazCR.splice(indexCR, 1);
                                            }
                                            cell.getRow().getElement().style.backgroundColor = "";
                                        } else {
                                            poleVymaz.push(parseInt(cell.getRow().getData().id));
                                            poleVymazCR.push(parseInt(cell.getRow().getData().CR));
                                            cell.getRow().getElement().style.backgroundColor = "#fb5e5e";
                                        }

                                    }
                                },
                            ],
                        },
                    ],
                });
                $('#myButtonFPVymazOzn').click((e) => {

                    
                    $.ajax({
                        url: "/del_VsetkyOznTR",
                        type: "POST",
                        data: {
                            "poleVymaz": poleVymaz,
                        },
                        success: function (data) {
                            poleVymazCR.forEach(function (item) {
                                table.deleteRow(item);
                            });
                            poleVymazCR = [];
                        }
                    })
                });
                $('#myButtonFPUlozOzn').click((e) => {
                    let CRArray = [];
                    let UpDArray = [];
                    let premChildren;
                    let pointerRow;
                    let pocetRiadkov = table.getRows().length;
                    for (let j = 0; j < pocetRiadkov; j++) {
                        pointerRow = table.getRows()[j];
                        premChildren = pointerRow.getElement().children;

                        for (let i = 3; i < 5; i++) {
                            if (premChildren[i].style.backgroundColor === compareHex('#2f35ae7c')) {
                                CRArray.push(premChildren[i]);
                                UpDArray.push([pointerRow.getData().LTL, pointerRow.getData().UTL, pointerRow.getData().id])
                            }
                        }
                    }
                    if (UpDArray.length == 0) { return; }
                    $.ajax({
                        url: "/update_VsetkyOznTR",
                        type: "POST",
                        data: {
                            "poleUpdate": JSON.stringify(UpDArray),
                        },
                        success: function (data) {
                            CRArray.forEach(function (item) {
                                item.style.backgroundColor = "";
                            });
                        }
                    })
                });
            }

        });


    });
})
