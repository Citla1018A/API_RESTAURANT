const { MongoClient } = require('mongodb');

// Nombre de bd
const dbName = 'restaurant';
// Conexión URL (estas corriendo en local :D)
const url = 'mongodb://52.87.163.76:27017';//ip amazon 

const client = new MongoClient(url, {
  useUnifiedTopology: true
});

module.exports = async () => {
  // Conectamos al servidor
  await client.connect();

  return client.db(dbName); // retornamos la conexión con el nombre de la bd a usar
};