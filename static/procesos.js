$("#Y").bind("keyup keydown change", function () {
    concentracioncelulas()
});
$("#Ks").bind("keyup keydown change", function () {
    concentracion()
});
$("#Umax").bind("keyup keydown change", function () {
    concentracion()
});
$("#ms").bind("keyup keydown change", function () {
    dencidad()
    concentracioncelulas()
});
$("#F").bind("keyup keydown change", function () {
    velocidad()
    dencidad()
    concentracion()
    concentracioncelulas()
});
$("#t").bind("keyup keydown change", function () {
    velocidad()
    grafica()
});
$("#V0").bind("keyup keydown change", function () {
    velocidadfinal()

});
$("#V").bind("keyup keydown change", function () {
    velocidadfinal()
    datox()
    masa()
    velocidadinicial()
});
$("#Vf").bind("keyup keydown change", function () {
    dencidad()
    concentracion()
    grafica()
    concentracioncelulas()
    velocidadinicial()
});
$("#So").bind("keyup keydown change", function () {
    concentracioncelulas()
});
$("#N").bind("keyup keydown change", function () {
    datox()
});
$("#X").bind("keyup keydown change", function () {
    masa()
});

function velocidadinicial() {
    /*Calculo velocidad Inicial */
        vel0 = $('#Vf').val() - $('#V').val()
        console.log( $('#Vf').val())
        console.log( $('#V').val())
        document.getElementById('V0').value = vel0

}

function velocidad() {
    if ($('#F').val() != 0 && $('#t').val() != 0) {
        vel = $('#F').val() * $('#t').val()
        document.getElementById('V').value = vel
    }
    velocidadfinal()
    datox()
    masa()
}

function velocidadfinal() {
    if ($('#V0').val() != 0 && $('#V').val() != 0) {
        Vf = parseFloat($('#V0').val()) + parseFloat($('#V').val())
        document.getElementById('Vf').value = Vf
    }
    dencidad()
    concentracion()
    grafica()
    concentracioncelulas()
}

function dencidad() {
    /*Calculo dencidad de cultivo */
    if ($('#F').val() && $('#Vf').val() != 0) {
        var d = $('#F').val() / $('#Vf').val()
        D = d.toFixed(3)
        document.getElementById('cont2').innerHTML = ' ' + D
    }
}

function masa() {
    /*Calculo Masa de celulas */
    if ($('#X').val() != 0 && $('#V').val() != 0) {
        N = $('#X').val() * $('#V').val()
        document.getElementById('N').value = N.toFixed(3)
        document.getElementById('cont3').innerHTML = ' ' + N.toFixed(3)
    }
}

function concentracion() {

    if ($('#F').val() && $('#Vf').val() != 0 && $('#Ks').val() != 0 && $('#Umax').val() != 0) {
        var d = $('#F').val() / $('#Vf').val()
        D = d.toFixed(3);
        S = (D * $('#Ks').val()) / ($('#Umax').val() - D)
        document.getElementById('cont1').innerHTML = ' ' + S.toFixed(3)
    }
}

function datox() {

    if ($('#N').val() != 0 && $('#V').val() != 0) {
        X = $('#N').val() / $('#V').val()
        document.getElementById('X').value = X
    }
    masa()
}

function concentracioncelulas() {
    /*Calculo Concentracion de celulas */
    if ($('#So').val() != 0 && $('#Y').val() != 0 && $('#ms').val() != 0 && $('#F').val() != 0 && $('#Vf').val() != 0) {
        var d = $('#F').val() / $('#Vf').val()
        D = d.toFixed(3);
        x1 = parseFloat(D * $('#So').val());
        x2 = parseFloat(D / $('#Y').val());
        x3 = parseFloat(x2) + parseFloat($('#ms').val());
        x0 = x1 / x3;
        document.getElementById('X').value = x0
        document.getElementById('cont4').innerHTML = '  ' + x0.toFixed(3)
    }
    masa()
}


function grafica() {

    if ($('#V').val() != 0 && $('#t').val() != 0 && $('#Vf').val() != 0) {
        var tiempo = $('#t').val() * 60;
        var ace = ($('#Vf').val() - $('#V0').val()) / tiempo;
        var velocidad = [];
        var ti = [];
        for (var i = 0; i <= tiempo; i++) {
            ve = (parseFloat(ace) * i) + parseFloat($('#V0').val());
            ti.push(i);
            velocidad.push(ve);
        }
        graf(velocidad, ti);
    }
}

document.getElementById('linea').innerHTML = "<img src='/static/img/batch.jpg'>";

function graf(datat, ti) {
    let chart = Highcharts.chart('linea', {
        title: {
            text: 'Reactor Batch'
        },

        yAxis: {
            title: {text: 'Velocidad'}
        },

        xAxis: {
            title: {text: 'Tiempo'},
            categorías: ti
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
            name: 'Velocidad',
            data: datat
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