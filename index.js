const { response } = require("express");
const express = require("express"),
  bodyParser = require('body-parser'),
  jwt = require('jsonwebtoken'),
  config = require('./config/config')

const app = express()
const con_mongodb = require('./config/con_mongodb');

app.set('llavecita', config.llavecita);
app.use(bodyParser.urlencoded({ extends: true }));
app.use(bodyParser.json());

const rutasProtegidas = express.Router();

const usuarioController = require('./controllers/usuarioController');
const platillosController = require('./controllers/platillosController');
const rolController = require('./controllers/rolController');
// get en raiz
app.get('/', (req, res) => {
  res.json([{ mensaje: "raiz de la web api" }])
})

// USUARIOS
app.get('/lusuarios', rutasProtegidas, usuarioController.listarUsuarios);
app.delete('/Dusuario/:_id', rutasProtegidas, usuarioController.eliminarUsuarios);
app.post('/Ausuario', rutasProtegidas, usuarioController.insertarUsuarios);
app.put('/Pusuario/:_id', rutasProtegidas, usuarioController.updateUsuarios);
//PLATILLOS
app.get('/lplatillos', rutasProtegidas, platillosController.listarPlatillo);
app.delete('/Dplatillos/:id', rutasProtegidas, platillosController.eliminarPlatillo);
app.post('/Aplatillo', rutasProtegidas, platillosController.insertarPlatillo);
app.put('/Pplatillo/:id', rutasProtegidas, platillosController.updatePlatillo);
//ROL
app.get('/lrol', rutasProtegidas, rolController.listarRol);
app.delete('/Drol/:_id', rutasProtegidas, rolController.eliminarRol);
app.post('/Arol', rutasProtegidas, rolController.insertarRol);
app.put('/Prol/:_id', rutasProtegidas, rolController.updateRol);


// post en ruta /login con parametro json
app.post('/login', async (req, res) => {
  let nombre = req.body.nombre;
  let pas = req.body.password;

  const db = await con_mongodb();
  let uencontrado = await db.collection('usuarios').findOne({ nombre: nombre, password: pas });
  if (uencontrado) {
    const payload = { check: true };

    const token = jwt.sign(payload, app.get('llavecita'),
      { expiresIn: 120 });

    res.json({
      _id: uencontrado._id, token: token
    });
  }
  else
    res.json({
      _id: "0", token: "acceso denegado"
    });
})



rutasProtegidas.use((req, res, next) => {
  const token = req.headers['access-token'];

  if (token) {
    jwt.verify(token, app.get('llavecita'), (err, decoded) => {
      if (err) {
        return res.json({ mensaje: 'Token inválida ' + err });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send({
      mensaje: 'Token no proveída.'
    });
  }
});

app.listen(7002, () => console.log("webapi corriendo"))
