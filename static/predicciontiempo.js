$("#X").bind("keyup keydown change", function () {
    tb()
    densidadcelularfinal()
    grafica()
});
$("#Umax").bind("keyup keydown change", function () {
    tb()
    grafica()
});
$("#V").bind("keyup keydown change", function () {
    tb()
    densidadcelularfinal()
    grafica()
});
$("#So").bind("keyup keydown change", function () {
    tb()
    grafica()
});
$("#Y").bind("keyup keydown change", function () {
    tb()
    densidadcelularfinal()
    grafica()
});
$("#Sf").bind("keyup keydown change", function () {
    densidadcelularparcial()
    grafica()
});
$("#Tb").bind("keyup keydown change", function () {
    tb()
    densidadcelularfinal()
    grafica()
});


function tb() {
    if ($('#Umax').val() != 0 && $('#Y').val() != 0 && $('#So').val() != 0 && $('#X').val() != 0 && $('#V').val() != 0) {
        tbtiempo = 1 / $('#Umax').val()
        X0 = ($('#X').val() / $('#V').val())
        tbtiempo1 = parseFloat($('#Y').val() / X0)
        tbtiempo2 = parseFloat(1 + tbtiempo1 * $('#So').val())
        tbtiempo4 = parseFloat(tbtiempo * Math.log(tbtiempo2)).toFixed(2)
        document.getElementById('cont1').innerHTML = ' ' + tbtiempo4
        document.getElementById('Tb').value = tbtiempo4
    }
}

function densidadcelularfinal() {
    if ($('#Umax').val() != 0 && $('#X').val() != 0 && $('#V').val() != 0 && $('#Tb').val() != 0) {
        X0 = ($('#X').val() / $('#V').val())
        dsf = X0 * Math.exp($('#Umax').val() * $('#Tb').val())
        document.getElementById('cont2').innerHTML = ' ' + dsf.toFixed(2)
    }
}

function densidadcelularparcial() {
    if ($('#Umax').val() != 0 && $('#Y').val() != 0 && $('#So').val() != 0 && $('#X').val() != 0 && $('#V').val() != 0 && $('#Sf').val() != 0) {
        porsentcons = (($('#So').val() - $('#Sf').val()) * 100) / $('#So').val()
        consumo = ($('#So').val() * 70) / 100
        tbtiempo = 1 / $('#Umax').val()
        X0 = ($('#X').val() / $('#V').val())
        tbtiempo1 = parseFloat($('#Y').val() / X0)
        tbtiempo2 = parseFloat(1 + tbtiempo1 * ($('#So').val() - ($('#So').val() - consumo)))
        tbtiempo4 = parseFloat(tbtiempo * Math.log(tbtiempo2)).toFixed(2)

        dsf = X0 * Math.exp($('#Umax').val() * tbtiempo4)
        document.getElementById('cont4').innerHTML = ' ' + dsf.toFixed(2)
        document.getElementById('cont3').innerHTML = ' ' + porsentcons + ' % :'
        document.getElementById('cont5').innerHTML = ' ' + tbtiempo4
        document.getElementById('cont6').innerHTML = ' ' + porsentcons + ' % :'


    }

}


function grafica() {
    var tiempo = [];
    var densidad = [];
    if ($('#Tb').val() != 0) {
        tiempo.push(parseFloat(document.getElementById('cont1').innerHTML));
        tiempo.push(parseFloat(document.getElementById('cont2').innerHTML));
    }
    if ($('#Sf').val() != 0) {
        densidad.push(parseFloat(document.getElementById('cont5').innerHTML));
        densidad.push(parseFloat(document.getElementById('cont4').innerHTML));
    }
    if (tiempo.length != 0) {
        graf(densidad, tiempo);
    }

}

document.getElementById('predicctiempo').innerHTML = "<img src='/static/img/batch.jpg'>";

function graf(datat, ti) {
    let chart = Highcharts.chart('predicctiempo', {
        title: {
            text: 'Reactor Batch'
        },

        yAxis: {
            title: {text: 'Densidad'}
        },

        xAxis: {
            title: {text: 'Tiempo'}
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 0
            }
        },
        series: [{
            name: 'Densidad',
            data: [ti, datat]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });

}