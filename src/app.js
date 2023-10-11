import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api", productsRouter, cartsRouter);

app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto 8080");
});
