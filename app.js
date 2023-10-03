const express = require("express");
const app = express();

const { ProductManager } = require("./productManager.js");
const productManager = new ProductManager("./products.json");

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const products = await productManager.getProducts();
  const limit = req.query.limit;
  if (limit) {
    res.send(products.slice(0, limit));
  } else {
    res.send(products);
  }
});

app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductByID(Number(pid));
  if (!product) {
    res.send(`No existe un producto con id ${pid}`);
  } else {
    res.json(product);
  }
});

app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});
