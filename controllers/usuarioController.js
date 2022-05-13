const con_mongodb = require('../config/con_mongodb');
var ObjectID = require('mongodb').ObjectID;
//const usuario =  db.collection('usuarios');

module.exports = {
    async listarUsuarios(req, res) {
        const db = await con_mongodb();
        let listar_todos = await db.collection('usuarios').find({}).toArray();
        res.json(listar_todos);
    },
    async eliminarUsuarios(req, res) {
        let variable = req.params._id;
        const db = await con_mongodb();
        let uborrado = await db.collection("usuarios").findOneAndDelete({ _id: ObjectID(variable) });
        if (uborrado) {
            res.json([{ mensaje: "Usuario borrado " + variable }])
        } else
            res.json([{ mensaje: "Usuario NO borrado " + variable }])
    },
    async insertarUsuarios(req, res) {
        let nombre = req.body.nombre;
        let apellidoP = req.body.apellidoP;
        let apellidoM = req.body.apellidoM;
        let telefono = req.body.telefono;
        let password = req.body.password;
        let rol = req.body.rol;
        let ubicacion = req.body.ubicacion;
        const db = await con_mongodb();
        await db.collection('usuarios').insertOne({
            nombre: nombre, apellidoP: apellidoP,
            apellidoM: apellidoM, telefono: telefono,
            password: password, rol: rol, ubicacion: ubicacion
        });
        res.json([
            { mensaje: "usuario registado " + nombre }
        ])
    },
    async updateUsuarios(req, res) {
        try {
            const db = await con_mongodb();
            var usuarioExistente = await db.collection('usuarios').findOne();

            await db.collection('usuarios').findOneAndUpdate(
                {
                    _id: ObjectID(req.params.id)
                },
                {
                    $set: {
                        "nombre": req.body.nombre || usuarioExistente.nombre,
                        "apellidoP": req.body.apellidoP || usuarioExistente.apellidoP,
                        "apellidoM": req.body.apellidoM || usuarioExistente.apellidoM,
                        "telefono": req.body.telefono || usuarioExistente.telefono,
                        "password": req.body.password || usuarioExistente.password,
                        "rol": ObjectID(req.body.rol) || usuarioExistente.rol
                    }
                }
            );
            res.json([
                { mensaje: "usuario actualizado " + nombre }
            ])
        } catch (error) {
            res.json([
                { mensaje: "usuario actualizado" }
            ])
        }

    }
}
