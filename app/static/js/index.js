const csrfToken = document.getElementById('id_token').value;

document.addEventListener('DOMContentLoaded', function() {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const slideContainer = document.querySelector('.slides');
    const firstSlideClone = slides[0].cloneNode(true);
    slideContainer.appendChild(firstSlideClone);

    function showNextSlide() {
        const slideWidth = slides[0].clientWidth;
        currentIndex++;

        slideContainer.style.transition = 'transform 0.5s ease';
        slideContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        if (currentIndex === slides.length) {
            setTimeout(() => {
                slideContainer.style.transition = 'none';
                slideContainer.style.transform = 'translateX(0px)'; 
                currentIndex = 0; 
            }, 500); 
        }
    }

    setInterval(showNextSlide, 3000);
});


function prepararModal() {
    var form = document.getElementById('formAsistencia');
    var mensajeContent = document.querySelector('.msj-content');
    var botonValidar = document.getElementById('sendAsistencia');
    var botonConfirmar = document.getElementById('confirmarAsistencia');

    if (form) {
        form.reset();
        console.log('Form reset');
    } else {
        console.log('Form not found');
    }

    if (mensajeContent) {
        mensajeContent.innerHTML = '';
    }

    if (botonValidar) {
        botonValidar.style.display = 'block';
    }

    if (botonConfirmar) {
        botonConfirmar.style.display = 'none';
    }
}

document.getElementById('sendAsistencia').addEventListener('click', function(event) {
    event.preventDefault();

    const telefono = document.getElementById('nombreAsistente').value.trim();
    const mensajeContent = document.querySelector('.msj-content');
    const botonValidar = document.getElementById('sendAsistencia');
    
    if (!telefono) {
        mensajeContent.innerHTML = 'El código de confirmación es obligatorio';
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
    var prueba = csrfToken  
    console.log(prueba)

    fetch('/confirmar-asistencia/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken   
        },
        body: JSON.stringify(data),
        credentials: 'include' 
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.status === 'success') {
            const invitados = data.invitados;
            const invitadosContainer = document.querySelector('.msj-content');
            invitadosContainer.innerHTML = '';

            if (invitados.length > 0) {
                botonValidar.style.display = 'none';
                const mensajeSeleccion = '<p><strong>Por favor, selecciona las personas que van a asistir:</strong></p>';
                invitadosContainer.insertAdjacentHTML('beforeend', mensajeSeleccion);
                invitados.forEach(invitado => {
                    const invitadoItem = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="invitado" id="invitado_${invitado.id}" value="${invitado.id}" ${invitado.confirmado ? 'checked' : ''}>
                            <label class="form-check-label" for="invitado_${invitado.id}">
                                ${invitado.nombre}
                            </label>
                        </div>
                    `;
                    invitadosContainer.insertAdjacentHTML('beforeend', invitadoItem);
                });
                const botonConfirmar = '<button type="button" id="confirmarAsistencia" class="boton">Confirmar</button>';
                invitadosContainer.insertAdjacentHTML('beforeend', botonConfirmar);
                $('#modalAsistencia').modal('show');
                document.getElementById('confirmarAsistencia').addEventListener('click', function() {
                    const invitadosSeleccionados = Array.from(document.querySelectorAll('input[name="invitado"]:checked'))
                        .map(input => input.value);
                    fetch('/confirmar-asistencia/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrfToken  
                        },
                        body: JSON.stringify({ invitados: invitadosSeleccionados })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            $('#modalAsistencia').modal('hide');
                            const mensaje = '¡Asistencia confirmada exitosamente!';
                            document.getElementById('mensajeAgradecimiento').innerHTML = mensaje;
                            $('#modalAgradecimiento').modal('show');
                        } else {
                            const mensajeError = 'Error al confirmar asistencia';
                            document.getElementById('mensajeError').innerHTML = mensajeError;
                            $('#modalError').modal('show');
                        }
                    })
                    .catch(error => {
                        console.error('Error al confirmar asistencia:', error);
                        $('#modalAsistencia').modal('hide');
                        document.getElementById('mensajeError').innerHTML = 'Error en la solicitud';
                        $('#modalError').modal('show');
                    });
                });
            }
        } else {
            const mensajeError = 'No hay invitados con ese código de confirmación';
            mensajeContent.innerHTML = mensajeError;
            mensajeContent.style.color = 'red'; 
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        mensajeContent.innerHTML = 'Error en la solicitud';
        mensajeContent.style.color = 'red'; 
    });
});


document.getElementById('sendSugerenciaCancion').addEventListener('click', function(event) {
    event.preventDefault();

    const nombreUsuario = document.getElementById('nombreSugerencia').value.trim();
    const descripcionSugerencia = document.getElementById('descripcionSugerencia').value.trim();
    const linkSugerencia = document.getElementById('linkSugerencia').value.trim();
    const mensajeContent = document.getElementById('mensaje_error');
    mensajeContent.innerHTML = '';
    

    if (!nombreUsuario) {
        mensajeContent.innerHTML = 'El campo "Tu nombre" es obligatorio.';
        mensajeContent.style.color = 'red';
        mensajeContent.style.fontWeight = 'bold';
        mensajeContent.style.marginTop = '10px';
        return; 
    }

    if (!descripcionSugerencia) {
        mensajeContent.innerHTML = 'El campo "Nombre de canción y autor" es obligatorio.';
        mensajeContent.style.color = 'red';
        mensajeContent.style.fontWeight = 'bold';
        mensajeContent.style.marginTop = '10px';
        return; 
    }

    if (!linkSugerencia) {
        mensajeContent.innerHTML = 'El campo "Enlace" es obligatorio.';
        mensajeContent.style.color = 'red';
        mensajeContent.style.fontWeight = 'bold';
        mensajeContent.style.marginTop = '10px';
        return; 
    }

    const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be|spotify\.com|soundcloud\.com|vimeo\.com)\/.+$/;
    if (!urlPattern.test(linkSugerencia)) {
        mensajeContent.innerHTML = 'Por favor, ingrese un enlace válido de YouTube, Spotify, SoundCloud o Vimeo.';
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
            'X-CSRFToken': csrfToken  
        },
        body: JSON.stringify(data),
        credentials: 'include' 
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

  