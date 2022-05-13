const con_mongodb = require('../config/con_mongodb');
var ObjectID = require('mongodb').ObjectID;
//const usuario =  db.collection('usuarios');

module.exports = {
    async listarPlatillo(req, res) {
        const db = await con_mongodb();
        let listar_todos = await db.collection('menu').find({}).toArray();
        res.json(listar_todos);
    },
    async eliminarPlatillo(req, res) {
        let variable = req.params.id;
        const db = await con_mongodb();
        let uborrado = await db.collection("menu").findOneAndDelete({ platillo: variable });
        if (uborrado) {
            res.json([{ mensaje: "platillo borrado " + variable }])
        } else
            res.json([{ mensaje: "platillo NO borrado " + variable }])
    },
    async insertarPlatillo(req, res) {
        let platillo = req.body.platillo;
        let descripcion = req.body.descripcion;

        const db = await con_mongodb();
        await db.collection('menu').insertOne({
            platillo: platillo, descripcion: descripcion
        });
        res.json([
            { mensaje: "platillo registado " + platillo }
        ])
    },
    async updatePlatillo(req, res) {
        try {
            const db = await con_mongodb();
            var platilloExistente = await db.collection('menu').findOne();

            await db.collection('menu').findOneAndUpdate(
                {
                    _id: ObjectID(req.params.id)
                },
                {
                    $set: {
                        "platillo": req.body.platillo || platilloExistente.platillo,
                        "descripcion": req.body.descripcion || platilloExistente.descripcion
                    }
                }
            );
            res.json([
                { mensaje: "platillo actualizada " }
            ])
        } catch (error) {
            res.json([
                { mensaje: "error al actualizar platillo" }
            ])
        }

    }
}