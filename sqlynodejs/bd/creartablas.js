const knex = require("./knex");

knex.schema
  .createTable("mensajes", (table) => {
    table.increments("id");
    table.string("email");
    table.string("user");
    table.string("message");
    table
      .timestamp("fecha", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  })
  .then(() => {
    console.log("tabla mensajes creada!!!");
  })
  .catch((error) => {
    console.log("error:", error);
    throw error;
  })
  .finally(() => {
    console.log("Cerrando la conexion...");
    process.exit(0);
  });
