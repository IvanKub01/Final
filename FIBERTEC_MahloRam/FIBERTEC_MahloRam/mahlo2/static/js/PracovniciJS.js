$(document).ready(function () {
    window.ShowPassword = function ShowPassword(){
        var x = document.getElementById("PRHesloID");
        var y = document.getElementById("PRPotvrHeslaID");

        if (x.type === "password") {
            x.type = "text";
            y.type = "text";
        } else {
            x.type = "password";
            y.type = "password";

        }
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
            url: "/get_Pracovnici",
            context: document.body,
            success: function (data) {

                let i = 0;
                data.forEach(element => {
                    i++;
                    tableData.push({ CR: i, id: element.ID, OsCis: element.OsCis, ADMIN: element.Admin,originalADMIN: element.Admin, img: "trash-alt-solid.svg" },)

                });
                poleVymaz = [];
                poleVymazCR = [];

                var table = new Tabulator("#PRTabel", {
                    data: tableData,
                    index: "CR",
                    layout: "fitDataTable",
                    responsiveLayout: "hide",
                    columns: [
                        {
                            title: "<button id='myButtonPRVymazOznID'class='myButtonVymazOzn'>Vymaž označené</button><button id='myButtonPRUlozOznID' class='myButtonUlozOzn'>Ulož označené</button>"
                            , columns: [
                                { title: "Č. řádku", field: "CR", width: 100, hozAlign: "center", headerHozAlign: "center" },
                                { title: "Osobní číslo", field: "OsCis", width: 150, hozAlign: "center", headerHozAlign: "center" },
                                { title: "Admin", field: "ADMIN", width: 100,hozAlign: "center", headerHozAlign: "center",  editor:"select", editorParams:{values:["Admin", "NoAdmin"]},cellEdited: function (cellL) {
                                        let riadokL = cellL.getRow();
                                        let dataL = riadokL.getData();
                                        let valADMIN = dataL.ADMIN;
                                        let elL = riadokL.getElement().children[2];
                                        
                                        riadokL.update({ "ADMIN": valADMIN });

                                        if (elL.style.backgroundColor === compareHex('#2f35ae7c') && dataL.ADMIN == dataL.originalADMIN) {
                                            elL.style.backgroundColor = "";
                                        } else if (dataL.ADMIN != dataL.originLTL) {
                                            elL.style.backgroundColor = "#2f35ae7c";
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
                $('#myButtonPRVymazOznID').click((e) => {


                    $.ajax({
                        url: "/del_VsetkyOznPR",
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
                $('#myButtonPRUlozOznID').click((e) => {
                    let CRArray = [];
                    let UpDArray = [];
                    let premChildren;
                    let pointerRow;
                    let pocetRiadkov = table.getRows().length;
                    for (let j = 0; j < pocetRiadkov; j++) {
                        pointerRow = table.getRows()[j];
                        premChildren = pointerRow.getElement().children;

                        
                        if (premChildren[2].style.backgroundColor === compareHex('#2f35ae7c')) {
                            CRArray.push(premChildren[2]);
                            let premAdmin = 0;
                            if(pointerRow.getData().ADMIN == "Admin"){
                                premAdmin = 1;
                            }
                            UpDArray.push([premAdmin,  pointerRow.getData().id])
                        }
                        
                    }
                    if (UpDArray.length == 0) { return; }
                    $.ajax({
                        url: "/update_VsetkyOznPR",
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