const options = {
  client: "mysql",
  connection: {
    host: "127.0.0.1", 
    user: "root",
    password: "",
    database: "Productos",
  },
  pool: { min: 0, max: 7 },
};

const knex = require("knex")(options);
const nombreTabla = "articulos"; 

class Contenedor {
  async getAll() {
    const resultado = await knex
      .from(nombreTabla)
      .select("*")
      .then((articulos) => {
        return articulos;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        
      });
    return resultado;
  }

  async newArticle(article) {
    console.log("intentando guardar", article);
    const resultado = await knex(nombreTabla)
      .insert(article)
      .then(() => console.log("Articulo guardado!"))
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return resultado;
  }

  async crearTabla() {
    const resultado = await knex.schema
      .createTable(nombreTabla, (table) => {
        table.increments("id");
        table.string("titulo");
        table.string("precio");
        table.string("thumbnail");
      })
      .then(() => console.log(`Tabla ${nombreTabla} creada con exito.`))
      .catch((err) => {
        if (err.sqlMessage === "Table 'articulos' already exists") {
          console.log(
            `No se pudo crear la tabla "${nombreTabla}" porque ya existe.`
          );
        } else {
          console.log(err);
          throw err;
        }
      });
    return resultado;
  }
}

module.exports = {
  getAll: Contenedor.prototype.getAll,
  getById: Contenedor.prototype.getById,
  newArticle: Contenedor.prototype.newArticle,
  crearTabla: Contenedor.prototype.crearTabla,
};
