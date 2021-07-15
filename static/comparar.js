document.getElementById('card').style.display = 'none';
var correlacion = [];
titu = [];
idorganismo = [];
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
        for (var i = 0; i < idorganismo.length; i++) {
            document.getElementById(idorganismo[i][0]).disabled = false;
        }
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

function organismo(id, organismo) {
    idorganismo.push([id, organismo])
}

function desactivarteclas() {
    for (var i = 0; i < idorganismo.length; i++) {
        if (correlacion[0][14] != idorganismo[i][1]) {
            document.getElementById(idorganismo[i][0]).disabled = true;
            document.getElementById(idorganismo[i][0] + 'a').disabled = true;
        }
    }
}

function desactivarteclastiempo() {
    for (var i = 0; i < idorganismo.length; i++) {
        if (correlacion[0][9] != idorganismo[i][1]) {
            document.getElementById(idorganismo[i][0]).disabled = true;
            document.getElementById(idorganismo[i][0] + 'a').disabled = true;
        }
    }
}

function proceso(y, ks, umax, ms, f, t, v0, v, vf, so, n, x, id, titulo, organismo) {
    if (con < 2) {
        var aux = [y, ks, umax, ms, f, t, v0, v, vf, so, n, x, id, titulo, organismo]
        if (correlacion.length === 0) {
            document.getElementById('dispercion').style.display = 'none';
            correlacion.push(aux)
            con += 1
            desactivar(id)
            desactivarteclas()
        } else {
            correlacion.push(aux)
            con = con + 1
            desactivar(id)
        }
        corre(correlacion)
        grafica()
    }
}

function procesotiempo(tb, x, v, umax, so, sf, y, id, titulo, organismo) {
    if (con < 2) {
        var aux = [tb, x, v, umax, so, sf, y, id, titulo, organismo]
        if (correlacion.length === 0) {
            correlacion.push(aux)
            con += 1
            desactivar(id)
            desactivarteclastiempo()
        } else {
            correlacion.push(aux)
            con = con + 1
            desactivar(id)
        }
        graficatiempo()
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
        for (var i = 0; i < idorganismo.length; i++) {
            document.getElementById(idorganismo[i][0]).disabled = false;
        }
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
    grafti(datovolumen, datotiempo, tit);
}


function corre(correlacion) {

    if (correlacion.length === 2) {
        const $elemento = document.querySelector("#tablacolumnas");
        $elemento.innerHTML = "";
        var dispersion = []
        var media1 = 0
        var media2 = 0
        var media12 = 0
        var media22 = 0
        var varianza1 = 0
        var varianza2 = 0
        var valorescriticos = [[161.45, 18.51, 10.13, 7.71, 6.61, 5.99, 5.59, 5.32, 5.12, 4.96, 4.84],
            [199.50, 19.00, 9.55, 6.94, 5.79, 5.14, 4.74, 4.46, 4.26, 4.10, 3.98],
            [215.71, 19.16, 9.28, 6.59, 5.41, 4.76, 4.35, 4.07, 3.86, 3.71, 3.59],
            [224.58, 19.25, 9.12, 6.39, 5.19, 4.53, 4.12, 3.48, 3.63, 3.48, 3.36],
            [230.16, 19.30, 9.01, 6.26, 5.05, 4.39, 3.97, 3.69, 3.48, 3.33, 3.20],
            [233.99, 19.33, 8.94, 6.16, 4.95, 4.28, 3.87, 3.58, 3.37, 3.22, 3.09],
            [236.77, 19.35, 8.89, 6.09, 4.88, 4.21, 3.79, 3.50, 3.29, 3.14, 3.01],
            [238.88, 19.37, 8.85, 6.04, 4.82, 4.15, 3.73, 3.44, 3.23, 3.07, 2.95],
            [240.54, 19.38, 8.81, 6.00, 4.77, 4.10, 3.68, 3.39, 3.18, 3.02, 2.90],
            [241.88, 19.40, 8.79, 5.96, 4.74, 4.06, 3.64, 3.35, 3.14, 2.98, 2.85]]
        document.getElementById('dispercion').style.display = 'block';
        $('#tablacolumnas tbody').html("");
        for (let i = 0; i < correlacion[0].length - 3; i++) {
            media1 += correlacion[0][i];
            media2 += correlacion[1][i];
            media12 += Math.pow(correlacion[0][i], 2);
            media22 += Math.pow(correlacion[1][i], 2);
        }
        dispersion.push((["media1", media1]))
        dispersion.push(["media2", media2])
        dispersion.push(["mediatotal", (media1 + media2) / 2])
        dispersion.push(["tratamiento", (media1 + media2)])
        dispersion.push(["factorcorreccion", (Math.pow(media1 + media2, 2) / 24)])
        dispersion.push(["sct", (media12 + media22) - dispersion[4][1]])
        dispersion.push(["sctr", ((Math.pow(media1, 2) / 12) + (Math.pow(media2, 2) / 12) - dispersion[4][1])])
        dispersion.push(["sce", (dispersion[5][1] - dispersion[6][1])])

        for (let i = 0; i < 12; i++) {
            varianza1 += Math.pow((correlacion[0][i] - (media1 / 12)), 2);
            varianza2 += Math.pow((correlacion[1][i] - (media2 / 12)), 2);
        }
        var cuenta = correlacion[0].length - 3;
        var gradoslibertad = correlacion.length;
        let fila = '<tr>';
        fila += '<td>' + correlacion[0][correlacion[0].length - 2] + '</td>>';
        fila += '<td > ' + cuenta + ' </td>>';
        fila += '<td  >' + media1.toFixed(2) + '</td>>';
        fila += '<td  >' + (media1 / cuenta).toFixed(2) + '</td>>';
        fila += '<td  >' + (varianza1 / cuenta).toFixed(2) + '</td>>';
        fila += '</tr>';
        $("#tablacolumnas").append(fila);
        fila = '<tr>';
        fila += '<td>' + correlacion[1][correlacion[1].length - 2] + '</td>>';
        fila += '<td  >' + cuenta + '</td>>';
        fila += '<td  >' + media2.toFixed(2) + '</td>>';
        fila += '<td  >' + (media2 / cuenta).toFixed(2) + '</td>>';
        fila += '<td  >' + (varianza2 / cuenta).toFixed(2) + '</td>>';
        fila += '</tr>';
        $("#tablacolumnas").append(fila);
        fila = '<tr>';
        fila += '<td class="blank" ></td>>';
        fila += '<td class="blank" ></td>>';
        fila += '<td class="blank" ></td>>';
        fila += '<td class="blank" ></td>>';
        fila += '<td class="blank" ></td>>';
        fila += '</tr>';
        $("#tablacolumnas").append(fila);
        fila = '<tr>';
        fila += '<th>' + 'Fuente de Variacion' + '</th>>';
        fila += '<th>' + 'Grados de Libertad' + '</th>>';
        fila += '<th>' + 'Suma de cuadrados' + '</th>>';
        fila += '<th>' + 'Cuadrados medios' + '</th>>';
        fila += '<th>' + 'Razon F' + '</th>>';
        fila += '</tr>';
        $("#tablacolumnas").append(fila);
        fila = '<tr>';
        fila += '<th>' + 'Tratamiento' + '</th>>';
        fila += '<td>' + (gradoslibertad - 1) + '</td>>';
        fila += '<td>' + dispersion[6][1].toFixed(2) + '</td>>'
        fila += '<td>' + (dispersion[6][1] / (gradoslibertad - 1)).toFixed(2) + '</td>>';
        fila += '<td>' + ((dispersion[6][1] / (gradoslibertad - 1)) / (dispersion[7][1] / (cuenta - gradoslibertad))).toFixed(2) + '</td>>';
        fila += '</tr>';
        $("#tablacolumnas").append(fila);
        fila = '<tr>';
        fila += '<th>' + 'Error' + '</th>>';
        fila += '<td>' + (cuenta - gradoslibertad) + '</td>>';
        fila += '<td>' + dispersion[7][1].toFixed(2) + '</td>>';
        fila += '<td>' + (dispersion[7][1] / (cuenta - gradoslibertad)).toFixed(2) + '</td>>';
        fila += '<td class="blank"></td>>';
        fila += '</tr>';
        $("#tablacolumnas").append(fila);
        console.log(((dispersion[6][1] / (gradoslibertad - 1)) / (dispersion[7][1] / (cuenta - gradoslibertad))))
        console.log(valorescriticos[(gradoslibertad - 1) - 1][(cuenta - gradoslibertad) - 1])
        fila = '<tr>';
        fila += '<td class="blank"></td>>';
        fila += '<td class="blank"></td>>';
        fila += '<td class="blank"></td>>';
        fila += '<td class="blank"></td>>';
        fila += '<td class="blank"></td>>';
        $("#tablacolumnas").append(fila);
        fila = '<tr>';
        if (((dispersion[6][1] / (gradoslibertad - 1)) / (dispersion[7][1] / (cuenta - gradoslibertad))) > valorescriticos[(gradoslibertad - 1)][(cuenta - gradoslibertad)]) {
            fila += '<th>' + 'Existe una diferencia significativa' + '</th>>';
        } else {
            fila += '<th>' + 'No hay diferencia significativa' + '</th>>';
        }
        fila += '</tr>';
        $("#tablacolumnas").append(fila);


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