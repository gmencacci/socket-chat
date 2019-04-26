var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre es necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}


socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(data) {
        console.log('Usuarios conectados', data);
    })
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
    socket.emit('salirChat', { usuario: 'Fernando' })
});


// Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(data) {
//     console.log('respuesta server: ', data);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor: ', mensaje);
});

socket.on('listaPersona', function(personas) {
    console.log(personas);
});


socket.on('mensajePrivado', function(mensaje) {
    console.log(mensaje);
})