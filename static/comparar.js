document.getElementById('card').style.display = 'none';


function desactivar(id) {
    document.getElementById(id).disabled = true;
    document.getElementById(id+'a').disabled = false;

}
function activar(id) {
    document.getElementById(id).disabled = false;
    document.getElementById(id+'a').disabled = true;
}


function grafica(t, vf, v0) {
    document.getElementById('card').style.display = 'block';

    var tiempo = t * 60;
    var ace = vf - v0 / tiempo;
    var velocidad = [];
    var ti = [];
    for (var i = 0; i <= tiempo; i++) {
        ve = (parseFloat(ace) * i) + parseFloat(v0);
        ti.push(i);
        velocidad.push(ve);
    }
    graf(velocidad, ti);

}

function graf(datat, ti) {
    let chart = Highcharts.chart('batch', {
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


function graficatiempo(id, tb, x, v, umax, so, sf, x, y) {
    document.getElementById(id).disabled = true;

    X0 = x / v
    dsf = X0 * Math.exp(umax * tb)

    porsentcons = (so - sf * 100) / so
    consumo = (so * 70) / 100
    tbtiempo = 1 / umax
    X0 = (x / v)
    tbtiempo1 = parseFloat(y / X0)
    tbtiempo2 = parseFloat(1 + tbtiempo1 * (so - (so - consumo)))
    tbtiempo4 = parseFloat(tbtiempo * Math.log(tbtiempo2)).toFixed(2)

    dsft = X0 * Math.exp(umax * tbtiempo4)

    var tiempo = [];
    var densidad = [];
    tiempo.push(tb);
    tiempo.push(dsf);
    densidad.push(tbtiempo4);
    densidad.push(dsft);
    if (tiempo.length != 0) {
        grafti(densidad, tiempo);
    }


}

function grafti(datat, ti) {
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
            type: 'spline',
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