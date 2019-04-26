const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios();
const { crearMensaje } = require('../utilidades/utilidades');

io.on('connection', (client) => {



    client.on('entrarChat', (data, callback) => {

        let esPrivado = (!data.sala);

        console.log(esPrivado);

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);
        let mensajeAdmin = crearMensaje('Administrador', `${data.nombre} se unió`);
        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        let personasSala = usuarios.getPersonasPorSala(data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', personasSala);
        client.broadcast.to(data.sala).emit('crearMensaje', mensajeAdmin);

        callback(personasSala);

    })

    client.on('disconnect', () => {
        //console.log('personassss: ', usuarios.getPersonas());
        let personaBorrada = usuarios.borrarPersona(client.id);
        //console.log('personaBorrada:', personaBorrada);
        let mensaje = crearMensaje('Administrador', `${personaBorrada.nombre} salió`);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', mensaje);
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    })

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    })

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
    })

});