var $ = jQuery.noConflict();

$(document).ready(function () {
    listarUsuario()
    listarTipo()
    listarOrganismo()
    listarReactor()
    listarBatch()
    listarPrediccion()
});

function validaFloat(numero) {
    if (!/^([0-9])*[.]?[0-9]*$/.test(numero))
        alert("El valor " + numero + " no es un número");
}

function listarUsuario() {
    $.ajax({
        url: "/UsuarioLista/",
        type: "get",
        dataType: "json",
        success: function (response) {
            if ($.fn.DataTable.isDataTable('#tablausuario')) {
                $('#tablausuario').DataTable().destroy();
            }
            $('#tablausuario tbody').html("");
            for (let i = 0; i < response.length; i++) {
                let fila = '<tr>';
                fila += '<td>' + (i + 1) + '</td>>';
                fila += '<td style="max-width:108px;" >' + response[i]["fields"]['username'] + '</td>>';
                fila += '<td style="max-width:108px;" >' + response[i]["fields"]['first_name'] + '</td>>';
                fila += '<td style="max-width:108px;" >' + response[i]["fields"]['last_name'] + '</td>>';
                fila += '<td style="max-width:182px;" >' + response[i]["fields"]['email'] + '</td>>';
                fila += '<td>' + response[i]["fields"]['is_superuser'] + '</td>>';
                fila += '<td>' + response[i]["fields"]['last_login'] + '</td>>';
                fila += '<td><button type="button" class="btn btn-primary btn-xs" onclick="abrir_modal_editar(\'/EditarUsuario/' + response[i]['pk'] + '/\');"><i class="fa fa-pencil"></i></button> <button type="button" class="btn btn-danger btn-xs" onclick="abrir_modal_eliminar(\'/EliminarUsuario/' + response[i]['pk'] + '/\');"><i class="fa fa-trash-o "></i></button></td>>';
                fila += '</tr>';
                $('#tablausuario tbody').append(fila);
            }
            $('#tablausuario').DataTable({
                "responsive": true,
                "lengthChange": false,
                "autoWidth": false,
                "buttons2": ["copy", "csv", "excel", "pdf", "print"],
                "paging": true,
                "ordering": true,
                "info": true,
                "whiteSpace": 'normal',
            }).buttons().container().appendTo('#tablausuario_wrapper .col-md-6:eq(0)');
        }, error: function (error) {
            console.log(error);

        }
    });
}

function registrar() {
    $.ajax({
        data: $('#form_crear').serialize(),
        url: $('#form_crear').attr('action'),
        type: $('#form_crear').attr('method'),
        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_crear();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
        }
    });
}

function editar() {
    $.ajax({
        data: $('#form_editar').serialize(),
        url: $('#form_editar').attr('action'),
        type: $('#form_editar').attr('method'),
        success: function (response) {
            notificacionSuccess(response.mensaje);
            listarUsuario();
            cerrar_modal_editar();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
            activarBoton();
        }
    });
}

function eliminar(pk) {
    $.ajax({
        data: {
            csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val()
        },
        url: '/EliminarUsuario/' + pk + '/',
        type: 'post',
        success: function (response) {
            notificacionSuccess(response.mensaje);
            listarUsuario();
            cerrar_modal_eliminar();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
        }
    });
}


function listarTipo() {
    $.ajax({
        url: "/TipoReactorlista/",
        type: "get",
        dataType: "json",
        success: function (response) {
            if ($.fn.DataTable.isDataTable('#tablatipo')) {
                $('#tablatipo').DataTable().destroy();
            }
            $('#tablatipo tbody').html("");
            for (let i = 0; i < response.length; i++) {
                let fila = '<tr>';
                fila += '<td>' + (i + 1) + '</td>>';
                fila += '<td style="max-width:250px;" >' + response[i]["fields"]['descripcion'] + '</td>>';
                fila += '<td style="max-width:280px;" >' + response[i]["fields"]['especificaciontecnica'] + '</td>>';
                fila += '<td style="max-width:150px;" >' + response[i]["fields"]['tiporeactor'] + '</td>>';
                fila += '<td><button type="button" class="btn btn-primary btn-xs" onclick="abrir_modal_editar(\'/EditarTipo/' + response[i]['pk'] + '/\');"><i class="fa fa-pencil"></i></button> <button type="button" class="btn btn-danger btn-xs" onclick="abrir_modal_eliminar(\'/EliminarTipo/' + response[i]['pk'] + '/\');"><i class="fa fa-trash-o "></i></button></td>>';
                fila += '</tr>';
                $('#tablatipo tbody').append(fila);
            }
            $('#tablatipo').DataTable({
                "responsive": true,
                "lengthChange": false,
                "autoWidth": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print"],
                "paging": true,
                "ordering": true,
                "info": true,
            }).buttons().container().appendTo('#tablatipo_wrapper .col-md-6:eq(0)');
        }, error: function (error) {
            console.log(error);

        }
    });
}

function registrartiporeactor() {
    $.ajax({
        data: $('#form_reactor').serialize(),
        url: $('#form_reactor').attr('action'),
        type: $('#form_reactor').attr('method'),
        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_guardar();
            listarTipo();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
        }
    });
}

function editar() {
    $.ajax({
        data: $('#form_editar').serialize(),
        url: $('#form_editar').attr('action'),
        type: $('#form_editar').attr('method'),
        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_editar();
            listarTipo();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
        }
    });
}

function eliminartipo(pk) {
    $.ajax({
        data: {
            csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val()
        },
        url: '/EliminarTipo/' + pk + '/',
        type: 'post',
        success: function (response) {
            notificacionSuccess(response.mensaje);
            listarTipo();
            cerrar_modal_eliminar();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
        }
    });
}


function listarOrganismo() {
    $.ajax({
        url: "/Organismolista/",
        type: "get",
        dataType: "json",
        success: function (response) {
            if ($.fn.DataTable.isDataTable('#tablaorganismo')) {
                $('#tablaorganismo').DataTable().destroy();
            }
            $('#tablaorganismo tbody').html("");
            for (let i = 0; i < response.length; i++) {
                let fila = '<tr>';
                fila += '<td>' + (i + 1) + '</td>>';
                fila += '<td style="max-width:250px; " >' + response[i]["fields"]['nombrecientifico'] + '</td>>';
                fila += '<td style="width: 100px" >' + response[i]["fields"]['genero'] + '</td>>';
                fila += '<td style="width:81px;" >' + response[i]["fields"]['ph'] + '</td>>';
                fila += '<td><button type="button" class="btn btn-primary btn-xs" onclick="abrir_modal_editar(\'/EditarOrganismo/' + response[i]['pk'] + '/\');"><i class="fa fa-pencil"></i></button> <button type="button" class="btn btn-danger btn-xs" onclick="abrir_modal_eliminar(\'/EliminarOrganismo/' + response[i]['pk'] + '/\');"><i class="fa fa-trash-o "></i></button></td>';
                fila += '</tr>';
                $('#tablaorganismo tbody').append(fila);
            }
            $('#tablaorganismo').DataTable({
                "responsive": true,
                "lengthChange": false,
                "autoWidth": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print"],
                "paging": true,
                "ordering": true,
                "info": true,
            }).buttons().container().appendTo('#tablaorganismo_wrapper .col-md-6:eq(0)');
        }, error: function (error) {
            console.log(error);
        }
    });
}

function registrarorganismo() {
    $.ajax({
        data: $('#form_reactor').serialize(),
        url: $('#form_reactor').attr('action'),
        type: $('#form_reactor').attr('method'),
        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_guardar();
            listarOrganismo();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
        }
    });
}

function editar() {
    $.ajax({
        data: $('#form_editar').serialize(),
        url: $('#form_editar').attr('action'),
        type: $('#form_editar').attr('method'),
        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_editar();
            listarOrganismo();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
            activarBoton();
        }
    });
}

function eliminarorganismo(pk) {
    $.ajax({
        data: {
            csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val()
        },
        url: '/EliminarOrganismo/' + pk + '/',
        type: 'post',
        success: function (response) {
            notificacionSuccess(response.mensaje);
            listarOrganismo();
            cerrar_modal_eliminar();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
        }
    });
}


function listarReactor() {
    $.ajax({
        url: "/Reactorlista/",
        type: "get",
        dataType: "json",
        success: function (response) {
            if ($.fn.DataTable.isDataTable('#tablareactor')) {
                $('#tablareactor').DataTable().destroy();
            }
            $('#tablareactor tbody').html("");
            for (let i = 0; i < response.length; i++) {
                let fila = '<tr>';
                fila += '<td>' + (i + 1) + '</td>>';
                fila += '<td style="max-width:84px;" >' + response[i]["fields"]['marca'] + '</td>>';
                fila += '<td style="max-width:94px;" >' + response[i]["fields"]['modelo'] + '</td>>';
                fila += '<td style="max-width:149px;" >' + response[i]["fields"]['especificaciontecnica'] + '</td>>';
                fila += '<td style="max-width:71px;"><img src="/media/'+response[i]["fields"]['foto1']+'" style="max-width: 54px; max-height: 54px; width:100%;height: 100%" ></td>>';
                 fila += '<td style="max-width:71px;" ><img src="/media/'+response[i]["fields"]['foto2']+'" style="max-width: 54px; max-height: 54px; width:100%;height: 100%" ></td>>';
                fila += '<td style="max-width:71px;" ><img src="/media/'+response[i]["fields"]['foto3']+'" style="max-width: 54px; max-height: 54px; width:100%;height: 100%" ></td>>';
                fila += '<td style="max-width:71px;" ><img src="/media/'+response[i]["fields"]['foto4']+'" style="max-width: 54px; max-height: 54px; width:100%;height: 100%" ></td>>';
                fila += '<td style="max-width:130px;">' + response[i]["fields"]['tiporeactor'] + '</td>>';
                fila += '<td><button type="button" class="btn btn-primary btn-xs" onclick="abrir_modal_editar(\'/EditarReactor/' + response[i]['pk'] + '/\');"><i class="fa fa-pencil"></i></button> <button type="button" class="btn btn-danger btn-xs" onclick="abrir_modal_eliminar(\'/EliminarReactor/' + response[i]['pk'] + '/\');"><i class="fa fa-trash-o "></i></button></td>';
                fila += '</tr>';
                $('#tablareactor tbody').append(fila);
            }
            $('#tablareactor').DataTable({
                "responsive": true,
                "lengthChange": false,
                "autoWidth": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print"],
                "paging": true,
                "ordering": true,
                "info": true,
            }).buttons().container().appendTo('#tablareactor_wrapper .col-md-6:eq(0)');
        }, error: function (error) {
            console.log(error);

        }
    });
}

function registrarreactor() {
    var data = new FormData($('#form_reactor').get(0));
    $.ajax({
        data: data,
        url: $('#form_reactor').attr('action'),
        type: $('#form_reactor').attr('method'),
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_guardar();
            listarReactor();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
        }
    });
}

function editarreactor() {
    var data = new FormData($('#form_editar').get(0));
    $.ajax({
        data: data,
        url: $('#form_editar').attr('action'),
        type: $('#form_editar').attr('method'),
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_editar();
            listarReactor();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
            activarBoton();
        }
    });
}

function eliminarreactor(pk) {
    $.ajax({
        data: {
            csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val()
        },
        url: '/EliminarReactor/' + pk + '/',
        type: 'post',
        success: function (response) {
            notificacionSuccess(response.mensaje);
            listarReactor();
            cerrar_modal_eliminar();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
        }
    });
}


function listarBatch() {
    $.ajax({
        url: "/CaBatchlista/",
        type: "get",
        dataType: "json",
        success: function (response) {
            if ($.fn.DataTable.isDataTable('#tablabatch')) {
                $('#tablabatch').DataTable().destroy();
            }
            $('#tablabatch tbody').html("");
            for (let i = 0; i < response.length; i++) {
                let fila = '<tr>';
                fila += '<td>' + (i + 1) + '</td>>';
                fila += '<td style="max-width:120px " >' + response[i]["fields"]['titulo'] + '</td>>';
                fila += '<td style="max-width:120px " >' + response[i]["fields"]['descripcion'] + '</td>>';
                fila += '<td style="max-width:40px;">' + response[i]["fields"]['y'] + '</td>>';
                fila += '<td style="max-width:40px;">' + response[i]["fields"]['ks'] + '</td>>';
                fila += '<td style="max-width:40px;">' + response[i]["fields"]['umax'] + '</td>>';
                fila += '<td style="max-width:40px;">' + response[i]["fields"]['ms'] + '</td>>';
                fila += '<td style="max-width:40px;">' + response[i]["fields"]['f'] + '</td>>';
                fila += '<td style="max-width:40px;">' + response[i]["fields"]['t'] + '</td>>';
                fila += '<td style="max-width:40px;">' + response[i]["fields"]['v0'] + '</td>>';
                fila += '<td style="max-width:40px;">' + response[i]["fields"]['v'] + '</td>>';
                fila += '<td style="max-width:106px;">' + response[i]["fields"]['organismo'] + '</td>>';
                fila += '<td style="max-width:82px;">' + response[i]["fields"]['reactor'] + '</td>>';
                fila += '<td style="max-width:82px;">' + response[i]["fields"]['usuario'] + '</td>>';
                fila += '<td><button type="button" class="btn btn-primary btn-xs" onclick="abrir_modal_editar(\'/EditarCaCaBatch/' + response[i]['pk'] + '/\');"><i class="fa fa-pencil"></i></button> <button type="button" class="btn btn-danger btn-xs" onclick="abrir_modal_eliminar(\'/EliminarCaCaBatch/' + response[i]['pk'] + '/\');"><i class="fa fa-trash-o "></i></button></td>';
                fila += '</tr>';
                $('#tablabatch tbody').append(fila);
            }
            $('#tablabatch').DataTable({
                "responsive": false,
                "lengthChange": false,
                "autoWidth": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print"],
                "paging": true,
                "ordering": true,
                "info": true,
            }).buttons().container().appendTo('#tablabatch_wrapper .col-md-6:eq(0)');
        }, error: function (error) {
            console.log(error);

        }
    });
}

function registrarcabatch() {
    $.ajax({
        data: $('#form_reactor').serialize(),
        url: $('#form_reactor').attr('action'),
        type: $('#form_reactor').attr('method'),

        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_reactor();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
        }
    });
}

function editarcabatch() {
    $.ajax({
        data: $('#form_editar').serialize(),
        url: $('#form_editar').attr('action'),
        type: $('#form_editar').attr('method'),
        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_editar();
            listarBatch();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
            activarBoton();
        }
    });
}

function eliminarcabatch(pk) {
    $.ajax({
        data: {
            csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val()
        },
        url: '/EliminarCaCaBatch/' + pk + '/',
        type: 'post',
        success: function (response) {
            notificacionSuccess(response.mensaje);
            listarBatch();
            cerrar_modal_eliminar();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
        }
    });
}


function listarPrediccion() {
    $.ajax({
        url: "/CaPrediccionlista/",
        type: "get",
        dataType: "json",
        success: function (response) {
            if ($.fn.DataTable.isDataTable('#tablaprediccion')) {
                $('#tablaprediccion').DataTable().destroy();
            }
            $('#tablaprediccion tbody').html("");
            for (let i = 0; i < response.length; i++) {
                let fila = '<tr>';
                fila += '<td>' + (i + 1) + '</td>>';
                fila += '<td style="max-width:120px;">' + response[i]["fields"]['titulo'] + '</td>>';
                fila += '<td style="max-width:120px;">' + response[i]["fields"]['descripcion'] + '</td>>';
                fila += '<td style="max-width:64px;">' + response[i]["fields"]['x'] + '</td>>';
                fila += '<td style="max-width:64px;">' + response[i]["fields"]['v'] + '</td>>';
                fila += '<td style="max-width:64px;">' + response[i]["fields"]['so'] + '</td>>';
                fila += '<td style="max-width:64px;">' + response[i]["fields"]['umax'] + '</td>>';
                fila += '<td style="max-width:64px;">' + response[i]["fields"]['y'] + '</td>>';
                fila += '<td style="max-width:64px;">' + response[i]["fields"]['sf'] + '</td>>';
                fila += '<td style="max-width:64px;">' + response[i]["fields"]['tb'] + '</td>>';
                fila += '<td  style="max-width:106px">' + response[i]["fields"]['organismo'] + '</td>>';
                fila += '<td>' + response[i]["fields"]['reactor'] + '</td>>';
                fila += '<td>' + response[i]["fields"]['usuario'] + '</td>>';
                fila += '<td><button type="button" class="btn btn-primary btn-xs" onclick="abrir_modal_editar(\'/EditarCaPrediccion/' + response[i]['pk'] + '/\');"><i class="fa fa-pencil"></i></button> <button type="button" class="btn btn-danger btn-xs" onclick="abrir_modal_eliminar(\'/EliminarCaPrediccion/' + response[i]['pk'] + '/\');"><i class="fa fa-trash-o "></i></button></td>';
                fila += '</tr>';
                $('#tablaprediccion tbody').append(fila);
            }
            $('#tablaprediccion').DataTable({
                "responsive": true,
                "lengthChange": false,
                "autoWidth": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print"],
                "paging": true,
                "ordering": true,
                "info": true,
            }).buttons().container().appendTo('#tablaprediccion_wrapper .col-md-6:eq(0)');
        }, error: function (error) {
            console.log(error);

        }
    });
}

function registrarcaprediccion() {
    $.ajax({
        data: $('#form_reactor').serialize(),
        url: $('#form_reactor').attr('action'),
        type: $('#form_reactor').attr('method'),
        success: function (response) {
            notificacionSuccess(response.mensaje);
            cerrar_modal_reactor();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
        }
    });
}

function editarcaprediccion() {
    $.ajax({
        data: $('#form_editar').serialize(),
        url: $('#form_editar').attr('action'),
        type: $('#form_editar').attr('method'),
        success: function (response) {
            notificacionSuccess(response.mensaje);
            listarPrediccion();
            cerrar_modal_editar();

        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
            mostrarErroresCreacion(error);
            activarBoton();
        }
    });
}

function eliminarcaprediccion(pk) {
    $.ajax({
        data: {
            csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val()
        },
        url: '/EliminarCaPrediccion/' + pk + '/',
        type: 'post',
        success: function (response) {
            notificacionSuccess(response.mensaje);
            listarPrediccion();
            cerrar_modal_eliminar();
        },
        error: function (error) {
            notificacionError(error.responseJSON.mensaje);
        }
    });
}