var socket = io();

socket.on('connect', function() {
    console.log('Conectado al servidor');



    socket.emit('entrarChat', { nombre: 'Fernando' }, function(data) {
        console.log(data);

    })



});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
    socket.emit('salirChat', { usuario: 'Fernando' })
});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(data) {
    console.log('respuesta server: ', data);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor: ', mensaje);
});