const fs = require("fs");
const ruta = __dirname + "/datos.txt"; 

module.exports = class Contenedor {
  
  constructor(id, titulo, precio, thumbnail) {
    
    this.id = id;
    this.titulo = titulo;
    this.precio = precio;
    this.thumbnail = thumbnail;
  }
  async escribir(texto) {
    try {
      await fs.promises.writeFile(ruta, texto);
      texto != ""
        ? console.log("Guardado con exito!")
        : console.log("Archivo vaciado con exito!");
    } catch (err) {
      
      console.log(err);
    }
  }
  async getAll() {
    try {
      let contenido = await fs.promises.readFile(ruta, "utf-8");

      if (contenido && contenido.length > 0) {
        contenido = JSON.parse(contenido);
        contenido = contenido.sort(function (a, b) {
          return a.id - b.id;
        });
        return contenido;
      } else {
        throw "No hay contenido";
      }
    } catch (err) {
      console.log("No se puedo leer el archivo, se creara uno nuevo!");
    }
  }
  async getById(number) {
    const productos = await this.getAll();
    const result = productos.filter((x) => x.id == number);
    return result[0];
  }
  async deleteById(number) {
    //    const eliminar=await getById(number);
    let productos = await this.getAll();
    const nproductos = productos.filter((x) => x.id != number);

    if (productos.length == nproductos.length) {
      return { codigo: 400, message: "No hay ningun producto con esa id." };
    } else {
      this.escribir(JSON.stringify(nproductos));
      return { codigo: 200, message: "Producto eliminado con exito." };
    }
  }
  async deleteAll() {
    this.escribir("");
  }
  async verificarID() {
    try {
      await this.verificarArchivo();
      let contenido = await fs.promises.readFile(ruta, "utf-8");

      if (contenido.length > 0) {
        contenido = JSON.parse(contenido);
        contenido = contenido.sort(function (a, b) {
          return a.id - b.id;
        });
        let ultimoId = contenido[contenido.length - 1].id;

        return ultimoId + 1;
      } else {
        console.log("vacio");
        return 1;
      }
    } catch (err) {
      console.log("Error de lectura: ", err);
    }
  }
  async save(producto) {
    try {
      if (producto != undefined) {
       
        if (!producto.id) {
          producto.id = await this.verificarID(); 
        }
        let productos = await this.getAll();
        if (!Array.isArray(productos)) productos = [];

        productos.push(producto);
        productos = JSON.stringify(productos);

        await this.escribir(productos);
        return producto.id; 
      } else {
        throw "No se recibio un objeto!";
      }
    } catch (err) {
      console.warn("Sucedio algo horrible: ", err);
      return err;
    }
  }

  async verificarArchivo() {
    try {
      let contenido = await fs.promises.readFile(ruta, "utf-8");
      if (contenido) {
        return true;
      }
    } catch (err) {
     

      if (err) {
        await this.escribir("");
        console.log("No existe el archivo, se crea uno nuevo.");
      }
    }
  }

  async updateById(number, data) {
    const producto = await this.getById(number);

    if (data.titulo) {
      producto.titulo = data.titulo;
    }

    if (data.thumbnail) {
      producto.thumbnail = data.thumbnail;
    }

    if (data.precio) {
      producto.precio = data.precio;
    }

    await this.deleteById(producto.id);
    await this.save(producto);
    return producto;
  }
};
