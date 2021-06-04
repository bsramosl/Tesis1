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
        if (correlacion[i][3] === id) {
            correlacion.splice(i, 1);
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
        if (correlacion[i][0] === id) {
            correlacion.splice(i, 1);
            break;
        }
    }
    graficatiempo()
}

function procesotiempo(id, tb, x, v, umax, so, sf, x, y, titulo) {
    if (con < 4) {
        var aux = [id, tb, x, v, umax, so, sf, x, y, titulo]
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
        X0 = (correlacion[j][2] / correlacion[j][3]);
        dsf = X0 * Math.exp(correlacion[j][4] * correlacion[j][1]);
        porsentcons = (correlacion[j][5] - correlacion[j][6] * 100) / correlacion[j][5];
        consumo = (correlacion[j][5] * 70) / 100
        tbtiempo = 1 / correlacion[j][4];
        tbtiempo1 = parseFloat(correlacion[j][8] / X0)
        tbtiempo2 = parseFloat(1 + tbtiempo1 * (correlacion[j][5] - (correlacion[j][5] - consumo)))
        tbtiempo4 = parseFloat(tbtiempo * Math.log(tbtiempo2)).toFixed(2)
        dsft = X0 * Math.exp(correlacion[j][4] * tbtiempo4)
        tiempo.push(correlacion[j][1]);
        tiempo.push(dsf);
        densidad.push(tbtiempo4);
        densidad.push(dsft);
        tit.push(correlacion[j][9])
        datovolumen.push(densidad)
        datotiempo.push(tiempo)
    }
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
        }, {
            name: titulo[2],
            data: [ti[2], datat[2]]
        }, {
            name: titulo[3],
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

function corre(correlacion) {
    var x2 = []
    var y2 = []
    var xy = []
    var sumax = 0
    var sumay = 0
    var sumax2 = 0
    var sumay2 = 0
    var sumaxy = 0
    if (correlacion.length === 2) {
        for (var i = 0; i < correlacion.length; i++) {
            if (x2.length === 0) {
                for (var j = 0; j < 12; j++) {
                    x2.push(correlacion[0][j] * correlacion[0][j])
                    sumax+=correlacion[0][j]
                    sumax2+= (correlacion[0][j] * correlacion[0][j])
                }
            }
            if (y2.length === 0) {
                for (var j = 0; j < 12; j++) {
                    y2.push(correlacion[1][j] * correlacion[1][j])
                    sumay+=correlacion[1][j]
                    sumay2+=(correlacion[1][j] * correlacion[1][j])
                }
            }
        }
        for (var i = 0; i < 12; i++) {
            xy.push(correlacion[0][i] * correlacion[1][i])
            sumaxy+=(correlacion[0][i] * correlacion[1][i])
        }
        //coeficiente de correlacion
        var  r=0,r1=0,r2=0
        r=((x2.length*(sumaxy))-((sumax)*(sumay)))
        r1 = Math.sqrt(((x2.length*sumax2)-(Math.pow(sumax,2)))*((x2.length*sumay2)-(Math.pow(sumay,2))))
        r2 = r/r1
        console.log(r2)

    }


}