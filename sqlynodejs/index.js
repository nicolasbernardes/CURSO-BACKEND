const express = require("express");
let app = express();
let moment = require("moment");
let path = require("path");
let { Server: HttpServer } = require("http");
let { Server: SocketIO } = require("socket.io");
const PORT = 8080;
const Contenedor = require("./Contenedor");
const req = require("express/lib/request");
const hbs = require("express-handlebars");

const ContenedorMDB = require("./bd/ContenedorMDB"); 

const ContenedorSqlite = require("./bd/contenedorsqlite"); 
const sqliteContenedor = new ContenedorSqlite();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", hbs.engine());

app.set("view engine", "handlebars");
app.set("views", "./views/hbs");

app.get("/", async (req, res, next) => {
  res.render("index", {});
});

app.post("/articulos", async (req, res) => {
  try {
    const nuevoContenedor = new Contenedor();
    const { titulo, precio, thumbnail } = req.body;

    const nProducto = {
      titulo: titulo, 
      precio: precio,
      thumbnail: thumbnail,
    };

    const resultado = await nuevoContenedor.save(nProducto);
    res.redirect("/");
  } catch (error) {}
});

let http = new HttpServer(app);
const io = new SocketIO(http);

io.on("connection", async (socket) => {
  const res = await ContenedorMDB.crearTabla(); 

  console.log("Nuevo cliente conectado:", socket.id);

  socket.emit("init", "");

  socket.on("from_front", async (data) => {
   
    try {
      console.log("llegaron datos:", data);

      sqliteContenedor.guardarMensaje(data);

      const mensajesAntiguos = await sqliteContenedor.obtenerMensajes();

      io.sockets.emit("fill_message", mensajesAntiguos);
    } catch (error) {
      console.log("ERROR, SE NECESITA BASE DE DATOS SQLITE3");
    }
  });

  socket.on("disconnect", (data) => {
    data.id;
  });

  

  

  const articulos = await ContenedorMDB.getAll();

  socket.emit("initArticles", articulos);
  socket.on("newArticle", async (narticulo) => {
    const nProducto = {
      titulo: narticulo.titulo, 
      precio: narticulo.precio,
      thumbnail: narticulo.thumbnail,
    };
    const res = await ContenedorMDB.newArticle(nProducto); 
    const articulos = await ContenedorMDB.getAll();
    io.sockets.emit("initArticles", articulos); 
  });
});

http.listen(PORT, (err) => {
  console.log(`Server on http://localhost:${PORT}`);
});
