function mostrarErroresCreacion(errores) {
    $(errores).html("");
    let error = "";
    for (let item in errores.responseJSON.error) {
        error += '<div class="alert alert-danger" <strong>' + errores.responseJSON[item] + '</strong></div>';
    }
    $('$errores').append(error);
}

function notificacionError(mensaje) {
    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: mensaje,
        showConfirmButton: false,
        timer: 3000
    });
}

function notificacionSuccess(mensaje) {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: mensaje,
        showConfirmButton: false,
        timer: 3000
    });

}

function activarBoton() {
    if ($('#boton_creacion').prop('disable')) {
        $('#boton_creacion').prop(('disable', false));
    } else {
        $('#boton_creacion').prop(('disable', true));
    }
}

function cerrar_modal_editar() {
    $('#editar_modal').modal('hide');
}

function cerrar_modal_eliminar() {
    $('#eliminar_modal').modal('hide');
}

function cerrar_modal_reactor() {
    $('#reactor_modal').modal('hide');
}

function abrir_modal_eliminar(url) {
    $('#eliminar_modal').load(url, function () {
        $(this).modal('show');
    });
}

function abrir_modal_editar(url) {
    $('#editar_modal').load(url, function () {
        $(this).modal('show');
    });
}


function abrir_modal_reactor(url, usuario) {
    $('#reactor_modal').load(url, function () {
        $(this).modal('show');
        $('#id_y').val($('#Y').val()).prop('readonly', true);
        $('#id_ks').val($('#Ks').val()).prop('readonly', true);
        $('#id_umax').val($('#Umax').val()).prop('readonly', true);
        $('#id_ms').val($('#ms').val()).prop('readonly', true);
        $('#id_f').val($('#F').val()).prop('readonly', true);
        $('#id_t').val($('#t').val()).prop('readonly', true);
        $('#id_v0').val($('#V0').val()).prop('readonly', true);
        $('#id_v').val($('#V').val()).prop('readonly', true);
        $('#id_vf').val($('#Vf').val()).prop('readonly', true);
        $('#id_so').val($('#So').val()).prop('readonly', true);
        $('#id_n').val($('#N').val()).prop('readonly', true);
        $('#id_x').val($('#X').val()).prop('readonly', true);
        $("#id_usuario option:contains(" + usuario + ")").prop('selected', 'selected');
        $('#id_usuario option:not(:selected)').prop('disabled', true);
        console.log(usuario)
    });
}

function abrir_modal_prediccion(url, usuario) {
    $('#reactor_modal').load(url, function () {
        $(this).modal('show');
        $('#id_x').val($('#X').val()).prop('readonly', true);
        $('#id_v').val($('#V').val()).prop('readonly', true);
        $('#id_so').val($('#So').val()).prop('readonly', true);
        $('#id_umax').val($('#Umax').val()).prop('readonly', true);
        $('#id_y').val($('#Y').val()).prop('readonly', true);
        $('#id_sf').val($('#Sf').val()).prop('readonly', true);
        $('#id_tb').val($('#Tb').val()).prop('readonly', true);
        $("#id_usuario option:contains(" + usuario + ")").prop('selected', 'selected');
        $('#id_usuario option:not(:selected)').prop('disabled', true);
        console.log(usuario)
    });
}


function cerrar_modal_prediccion() {
    $('#reactor_modal').modal('hide');
}

function cerrar_modal_guardar() {
    $('#registro_modal').modal('hide');
}

function abrir_modal_guardar(url) {
    $('#registro_modal').load(url, function () {
        $(this).modal('show');
    });
}

