const con_mongodb = require('../config/con_mongodb');
var ObjectID = require('mongodb').ObjectID;
//const usuario =  db.collection('usuarios');

module.exports = {
    async listarRol(req, res) {
        const db = await con_mongodb();
        let listar_todos = await db.collection('rol').find({}).toArray();
        res.json(listar_todos);
    },
    async eliminarRol(req, res) {
        let variable = req.query.id;
        const db = await con_mongodb();
        let uborrado = await db.collection("rol").findOneAndDelete({ variable: variable });
        if (uborrado) {
            res.json([{ mensaje: "rol borrado " + variable }])
        } else
            res.json([{ mensaje: "rol NO borrado " + variable }])
    },
    async insertarRol(req, res) {
        let nombrerol = req.body.nombrerol;
        let descripcion = req.body.descripcion;

        const db = await con_mongodb();
        await db.collection('rol').insertOne({
            nombrerol: nombrerol, descripcion: descripcion
        });
        res.json([
            { mensaje: "rol registado " + nombrerol }
        ])
    },
    async updateRol(req, res) {
        try {
            const db = await con_mongodb();
            var rolExistente = await db.collection('rol').findOne();

            await db.collection('rols').findOneAndUpdate(
                {
                    _id: ObjectID(req.params.id)
                },
                {
                    $set: {
                        "nombrerol": req.body.nombrerol || rolExistente.nombre,
                        "descripcion": req.body.descripcion || rolExistente.apellidoP

                    }
                }
            );
            res.json([
                { mensaje: "rol actualizado " + nombrerol }
            ])
        } catch (error) {
            res.json([
                { mensaje: "error al actualizar rol" }
            ])
        }

    }
}