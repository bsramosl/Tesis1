document.getElementById('card').style.display = 'none';
var correlacion = [];
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
    for (var i = 0; i < correlacion.length; i++) {
        if (correlacion[i][12] === id) {
            correlacion.splice(i, 1);
            document.getElementById('dispercion').style.display = 'none';
            break;
        }
    }
    grafica()
}

function proceso(y, ks, umax, ms, f, t, v0, v, vf, so, n, x, id, titulo) {
    if (con < 2) {
        var aux = [y, ks, umax, ms, f, t, v0, v, vf, so, n, x, id, titulo]
        if (correlacion.length === 0) {
            correlacion.push(aux)
            con += 1
            desactivar(id)
        } else {
            correlacion.push(aux)
            con = con + 1
            desactivar(id)
        }
        corre(correlacion)
        grafica()
    }
}

function grafica() {
    datovolumen = [];
    datotiempo = [];
    tit = [];
    for (var j = 0; j < correlacion.length; j++) {
        document.getElementById('card').style.display = 'block';
        var tiempo = correlacion[j][5] * 60;
        var ace = (correlacion[j][8] - correlacion[j][6]) / tiempo;
        var velocidad = [];
        var ti = [];
        for (var i = 0; i <= tiempo; i++) {
            ve = (parseFloat(ace) * i) + parseFloat(correlacion[j][6]);
            velocidad.push(ve)
            ti.push(i)
        }
        tit.push(correlacion[j][13])
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
    for (var i = 0; i < correlacion.length; i++) {
        if (correlacion[i][7] === id) {
            console.log()
            correlacion.splice(i, 1);
            document.getElementById('dispercion').style.display = 'none';
            break;
        }
    }
    graficatiempo()
}

function procesotiempo(tb, x, v, umax, so, sf, y, id, titulo) {
    if (con < 2) {
        var aux = [tb, x, v, umax, so, sf, y, id, titulo]
        if (correlacion.length === 0) {
            correlacion.push(aux)
            con += 1
            desactivar(id)
        } else {
            correlacion.push(aux)
            con = con + 1
            desactivar(id)
        }
        graficatiempo()
    }
}

function graficatiempo() {
    datovolumen = [];
    datotiempo = [];
    tit = [];
    for (var j = 0; j < correlacion.length; j++) {
        var tiempo = [];
        var densidad = [];
        document.getElementById('card').style.display = 'block';
        X0 = (correlacion[j][1] / correlacion[j][2]);
        dsf = X0 * Math.exp(correlacion[j][3] * correlacion[j][0]);
        porsentcons = (correlacion[j][4] - correlacion[j][5] * 100) / correlacion[j][4];
        consumo = (correlacion[j][4] * 70) / 100
        tbtiempo = 1 / correlacion[j][3];
        tbtiempo1 = parseFloat(correlacion[j][6] / X0)
        tbtiempo2 = parseFloat(1 + tbtiempo1 * (correlacion[j][4] - (correlacion[j][4] - consumo)))
        tbtiempo4 = parseFloat(tbtiempo * Math.log(tbtiempo2)).toFixed(2)
        dsft = X0 * Math.exp(correlacion[j][3] * tbtiempo4)
        tiempo.push(correlacion[j][0]);
        tiempo.push(dsf);
        densidad.push(tbtiempo4);
        densidad.push(dsft);
        tit.push(correlacion[j][8])
        datovolumen.push(densidad)
        datotiempo.push(tiempo)
    }
    correlaciontiempo(correlacion)
    grafti(datovolumen, datotiempo, tit);
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
            title: {text: 'Tiempo(min)'},
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

function grafti(datat, ti, titulo) {
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
            name: titulo[0],
            data: [ti[0], datat[0]]
        }, {
            name: titulo[1],
            data: [ti[1], datat[1]]
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

function corre(correlacion) {
    var x = []
    var y = []
    var x2 = []
    var y2 = []
    var xy = []
    var sumax = 0
    var sumay = 0
    var sumax2 = 0
    var sumay2 = 0
    var sumaxy = 0
    var regrecionlineal = []
    if (correlacion.length === 2) {
        document.getElementById('dispercion').style.display = 'block';
        for (var i = 0; i < correlacion.length; i++) {
            if (x2.length === 0) {
                for (var j = 0; j < 12; j++) {
                    x2.push(correlacion[0][j] * correlacion[0][j])
                    sumax += correlacion[0][j]
                    sumax2 += (correlacion[0][j] * correlacion[0][j])
                }
            }
            if (y2.length === 0) {
                for (var j = 0; j < 12; j++) {
                    y2.push(correlacion[1][j] * correlacion[1][j])
                    sumay += correlacion[1][j]
                    sumay2 += (correlacion[1][j] * correlacion[1][j])
                }
            }
        }
        for (var i = 0; i < 12; i++) {
            xy.push(correlacion[0][i] * correlacion[1][i])
            sumaxy += (correlacion[0][i] * correlacion[1][i])
            x.push(correlacion[0][i])
            y.push(correlacion[1][i])
        }
        //coeficiente de correlacion
        var r, r_1, r_2, r2 = 0
        r = ((x2.length * (sumaxy)) - ((sumax) * (sumay)))
        r_1 = Math.sqrt(((x2.length * sumax2) - (Math.pow(sumax, 2))) * ((x2.length * sumay2) - (Math.pow(sumay, 2))))
        r_2 = r / r_1
        //coeficuente de determinacion
        r2 = Math.pow(r_2, 2)
        r2 = (r2 * 100).toFixed(3)
        //regresion lineal
        var b = ((x.length * sumaxy) - ((sumax) * (sumay))) / ((x.length * sumax2) - (Math.pow(sumax, 2)))
        var a = ((sumay) / (x.length)) - b * (sumax / x.length)
        var mayor = Math.max.apply(null, x)
        for (i = 0; i < mayor; i++) {
            regrecionlineal.push(a + (b * i))
        }
        graficadispercion(x, y, regrecionlineal)
    }
}

function correlaciontiempo(correlacion) {
    var x = []
    var y = []
    var x2 = []
    var y2 = []
    var xy = []
    var sumax = 0
    var sumay = 0
    var sumax2 = 0
    var sumay2 = 0
    var sumaxy = 0
    var regrecionlineal = []
    if (correlacion.length === 2) {
        document.getElementById('dispercion').style.display = 'block';
        for (var i = 0; i < correlacion.length; i++) {
            if (x2.length === 0) {
                for (var j = 0; j < 7; j++) {
                    x2.push(correlacion[0][j] * correlacion[0][j])
                    sumax += correlacion[0][j]
                    sumax2 += (correlacion[0][j] * correlacion[0][j])
                }
            }
            if (y2.length === 0) {
                for (var j = 0; j < 7; j++) {
                    y2.push(correlacion[1][j] * correlacion[1][j])
                    sumay += correlacion[1][j]
                    sumay2 += (correlacion[1][j] * correlacion[1][j])
                }
            }
        }
        for (var i = 0; i < 7; i++) {
            xy.push(correlacion[0][i] * correlacion[1][i])
            sumaxy += (correlacion[0][i] * correlacion[1][i])
            x.push(correlacion[0][i])
            y.push(correlacion[1][i])
        }
        //coeficiente de correlacion
        var r, r_1, r_2, r2 = 0
        r = ((x2.length * (sumaxy)) - ((sumax) * (sumay)))
        r_1 = Math.sqrt(((x2.length * sumax2) - (Math.pow(sumax, 2))) * ((x2.length * sumay2) - (Math.pow(sumay, 2))))
        r_2 = r / r_1
        //coeficuente de determinacion
        r2 = Math.pow(r_2, 2)
        r2 = (r2 * 100).toFixed(3)
        //regresion lineal
        var b = ((x.length * sumaxy) - ((sumax) * (sumay))) / ((x.length * sumax2) - (Math.pow(sumax, 2)))
        var a = ((sumay) / (x.length)) - b * (sumax / x.length)
        var mayor = Math.max.apply(null, x)
        for (i = 0; i < mayor; i++) {
            regrecionlineal.push(a + (b * i))
        }
        graficadispercion(x, y, regrecionlineal)
    }


}

function graficadispercion(x, y, re) {
    Highcharts.chart('dispercion', {

        title: {
            text: 'Correlacion de Pearson'
        },
        xAxis: {
            title: {
                enabled: true,
                text: ' '
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: ' '
            }
        },

        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
            }
        },
        series: [{
            type: 'line',
            name: 'Regresión Lineal',
            data: re,
            marker: {
                enabled: false
            }
        }, {
            type: 'scatter',
            name: 'Diagrama de Dispersion',
            data: [[x[0], y[0]], [x[1], y[1]], [x[2], y[2]], [x[3], y[3]], [x[4], y[4]], [x[5], y[5]], [x[6], y[6]], [x[7], y[7]],
                [x[8], y[8]], [x[9], y[9]], [x[10], y[10]], [x[11], y[11]],]
        }]
    });
}