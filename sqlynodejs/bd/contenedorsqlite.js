const knex = require("./knex");

module.exports = class Contenedor {
  async guardarMensaje(datos) {
    try {
      return await knex("mensajes").insert(datos);
    } catch (error) {
      console.log(error, "ERROR EN: contenedorsqlite guardarMensaje()");
    }
  }

  async obtenerMensajes() {
    return await knex("mensajes");
  }
};
