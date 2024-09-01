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
