const sqlite3 = {
  client: "sqlite3",
  connection: {
    filename: __dirname + "mydb.sqlite",
  },
  useNullAsDefault: true,
};

const knex = require("knex")(sqlite3);


module.exports = knex;
