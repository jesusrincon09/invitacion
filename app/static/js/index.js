document.getElementById('sendAsistencia').addEventListener('click', function(event) {
    event.preventDefault();

    const telefono = document.getElementById('nombreAsistente').value.trim();
    const mensajeContent = document.querySelector('.msj-content');

    if (!telefono) {
        mensajeContent.innerHTML = 'El número de teléfono es obligatorio';
        mensajeContent.style.color = 'red'; 
        mensajeContent.style.fontWeight = 'bold'; 
        mensajeContent.style.marginTop = '10px'; 
        return;
    }

    mensajeContent.innerHTML = '';
    mensajeContent.style.color = ''; 
    mensajeContent.style.fontWeight = ''; 
    mensajeContent.style.marginTop = ''; 

    const data = { telefono: telefono };

    fetch('/confirmar-asistencia/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') 
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.status === 'success') {
            $('#modalAsistencia').modal('hide');
            const mensaje = `¡Gracias, ${data.nombre}, por confirmar tu asistencia!`;
            document.getElementById('mensajeAgradecimiento').innerHTML = mensaje;
            $('#modalAgradecimiento').modal('show');
        } else {
            $('#modalAsistencia').modal('hide');
            const mensajeError = 'Usted no está en la lista de invitados';
            document.getElementById('mensajeError').innerHTML = mensajeError;
            $('#modalError').modal('show');
        }
    })
    .catch(error => {
        $('#modalAsistencia').modal('hide');
        document.getElementById('mensajeError').innerHTML = 'Error en la solicitud';
        $('#modalError').modal('show');
    });
});
document.getElementById('sendSugerenciaCancion').addEventListener('click', function(event) {
    event.preventDefault();

    const nombreUsuario = document.getElementById('nombreSugerencia').value.trim();
    const descripcionSugerencia = document.getElementById('descripcionSugerencia').value.trim();
    const linkSugerencia = document.getElementById('linkSugerencia').value.trim();
    const mensajeContent = document.getElementById('mensaje_error'); 

    if (!nombreUsuario || !descripcionSugerencia || !linkSugerencia) {
        mensajeContent.innerHTML = 'Todos los campos son obligatorios.';
        mensajeContent.style.color = 'red'; 
        mensajeContent.style.fontWeight = 'bold'; 
        mensajeContent.style.marginTop = '10px'; 
        return;
    }

    const data = {
        nombre_usuario: nombreUsuario,
        descripcion_sugerencia: descripcionSugerencia,
        link: linkSugerencia
    };

    fetch('/sugerir-cancion/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            $('#modalSugerirCancion').modal('hide');
            mensajeContent.innerHTML = data.message;
            mensajeContent.style.color = 'green'; 
            document.getElementById('mensajeAgradecimiento').innerHTML = 'Su sugerencia ha sido enviada correctamente';
            $('#modalAgradecimiento').modal('show'); 
        } else {
            $('#modalSugerirCancion').modal('hide');
            mensajeContent.innerHTML = 'Ocurrió un error al enviar la sugerencia';
            $('#modalError').modal('show');
        }
    })
    .catch(error => {
        $('#modalSugerirCancion').modal('hide');
        mensajeContent.innerHTML = 'Error en la solicitud';
        $('#modalError').modal('show');
    });
});
$('#modalSugerirCancion').on('hidden.bs.modal', function () {
    $('#formSugerirCancion')[0].reset();
    $('.msj-content').empty();  
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
