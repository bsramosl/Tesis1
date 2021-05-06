document.getElementById('card').style.display = 'none';
var volumen1 = [];
titu = [];
con = 0;

function desactivar(id) {
    document.getElementById(id).disabled = true;
    document.getElementById(id + 'a').disabled = false;
}

function activar(id) {
    document.getElementById(id).disabled = false;
    document.getElementById(id + 'a').disabled = true;
    con -= 1
    borrar(id)
    if (con == 0) {
        document.getElementById('card').style.display = 'none';
    }
}

function borrar(id) {
    for (var i = 0; i < volumen1.length; i++) {
        if (volumen1[i][3] === id) {
            volumen1.splice(i, 1);
            break;
        }
    }
    grafica()
}

function proceso(t, vf, v0, id) {
    if (con < 4) {
        var aux = [t, vf, v0, id]
        if (volumen1.length === 0) {
            volumen1.push(aux)
            con += 1
            desactivar(id)
        } else {
            volumen1.push(aux)
            con = con + 1
            desactivar(id)
        }
        grafica()
    }
}

function grafica() {
    datovolumen = [];
    datotiempo = [];
    tit = [];
    for (var j = 0; j < volumen1.length; j++) {
        document.getElementById('card').style.display = 'block';
        var tiempo = volumen1[j][0] * 60;
        var ace = (volumen1[j][1] - volumen1[j][2]) / tiempo;
        var velocidad = [];
        var ti = [];
        for (var i = 0; i <= tiempo; i++) {
            ve = (parseFloat(ace) * i) + parseFloat(volumen1[j][2]);
            velocidad.push(ve)
            ti.push(i)
        }
        datovolumen.push(velocidad)
        datotiempo.push(ti)
        graf(datovolumen, datotiempo, tit);
    }
}

function activarti(id) {
    document.getElementById(id).disabled = false;
    document.getElementById(id + 'a').disabled = true;
    con -= 1
    borrarti(id)
    if (con == 0) {
        document.getElementById('card').style.display = 'none';
    }
}

function borrarti(id) {
    for (var i = 0; i < volumen1.length; i++) {
        if (volumen1[i][0] === id) {
            volumen1.splice(i, 1);
            break;
        }
    }
    graficatiempo()
}


function procesotiempo(id, tb, x, v, umax, so, sf, x, y) {
    if (con < 4) {
        var aux = [id, tb, x, v, umax, so, sf, x, y]
        if (volumen1.length === 0) {
            volumen1.push(aux)
            con += 1
            desactivar(id)
        } else {
            volumen1.push(aux)
            con = con + 1
            desactivar(id)
        }
        graficatiempo()
    }
}

function graficatiempo() {
    datovolumen = [];
    datotiempo = [];
    for (var j = 0; j < volumen1.length; j++) {
        var tiempo = [];
        var densidad = [];
        document.getElementById('card').style.display = 'block';
        X0 = (volumen1[j][2] / volumen1[j][3]);
        dsf = X0 * Math.exp(volumen1[j][4] * volumen1[j][1]);
        porsentcons = (volumen1[j][5] - volumen1[j][6] * 100) / volumen1[j][5];
        consumo = (volumen1[j][5] * 70) / 100
        tbtiempo = 1 / volumen1[j][4];
        tbtiempo1 = parseFloat(volumen1[j][8] / X0)
        tbtiempo2 = parseFloat(1 + tbtiempo1 * (volumen1[j][5] - (volumen1[j][5] - consumo)))
        tbtiempo4 = parseFloat(tbtiempo * Math.log(tbtiempo2)).toFixed(2)
        dsft = X0 * Math.exp(volumen1[j][4] * tbtiempo4)
        tiempo.push(volumen1[j][1]);
        tiempo.push(dsf);
        densidad.push(tbtiempo4);
        densidad.push(dsft);
        datovolumen.push(densidad)
        datotiempo.push(tiempo)
    }
    grafti(datovolumen, datotiempo);
    console.log(datovolumen)
}

function graf(datat, ti, titulo) {
    let chart = Highcharts.chart('batch', {
        title: {
            text: 'Reactor Batch'
        },

        yAxis: {
            title: {text: 'Volumen'}
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
            name: titulo[0],
            data: datat[0]
        }, {
            name: titulo[1],
            data: datat[1]
        }, {
            name: titulo[2],
            data: datat[2]
        }, {
            name: titulo[3],
            data: datat[3]
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
            name: 'Densidad',
            data: [ti[0], datat[0]]
        }, {
            name: 'Densidad',
            data: [ti[1], datat[1]]
        }, {
            name: 'Densidad',
            data: [ti[2], datat[2]]
        }, {
            name: 'Densidad',
            data: [ti[3], datat[3]]
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