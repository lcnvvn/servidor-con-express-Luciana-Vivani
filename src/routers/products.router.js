import { Router } from "express";
import path from "path";
import { getJSONFromFile, getNewId, saveJSONToFile } from "../utilities.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../db/products.json");
const router = Router();

const products = await getJSONFromFile(dbPath);

// get products
router.get("/products", async (req, res) => {
  const limit = req.query.limit;
  if (limit) {
    res.status(200).send(products.slice(0, limit));
  } else {
    return res.status(200).json(products);
  }
});

// get product by id
router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  let product = products.find((prod) => prod.id === pid);
  if (!product) {
    return res.status(404).json(`⚠️ No se encuentra el producto con ID ${pid}`);
  }
  return res.status(200).json(product);
});

//add product
router.post("/products", async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;
  let duplicateProduct = products.find((prod) => prod.code === code);
  if (duplicateProduct) {
    return res
      .status(400)
      .json(`⚠️ Ya existe un producto con el código ${code}`);
  }
  if (!(title && description && code && price && stock && category)) {
    return res.status(400).json(`⚠️ Falta algún campo`);
  }
  const id = getNewId();
  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnail: [],
  };
  products.push(newProduct);
  await saveJSONToFile(dbPath, products);
  return res.status(201).json(newProduct);
});

// update product
router.put("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const productIndex = products.findIndex((prod) => prod.id === pid);
  if (productIndex === -1) {
    return res.status(400).json(`⛔ No se encuentra el producto con ID ${pid}`);
  } else {
    const existingProduct = products[productIndex];
    if (req.body.title) existingProduct.title = req.body.title;
    if (req.body.description)
      existingProduct.description = req.body.description;
    if (req.body.code) existingProduct.code = req.body.code;
    if (req.body.price) existingProduct.price = req.body.price;
    if (req.body.status) existingProduct.status = req.body.status;
    if (req.body.stock) existingProduct.stock = req.body.stock;
    if (req.body.category) existingProduct.category = req.body.category;
    if (req.body.thumbnail) existingProduct.thumbnail = req.body.thumbnail;
    products.push(existingProduct);
    await saveJSONToFile(dbPath, products);
    return res.status(200).json(`✅ Producto con ID ${pid} actualizado.`);
  }
});

// delete product
router.delete("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  let productIndex = products.findIndex((prod) => prod.id === pid);
  if (productIndex > -1) {
    products.splice(productIndex, 1);
    await saveJSONToFile(dbPath, products);
    return res.status(200).json(`✅ Se ha borrado el producto con ID ${pid}`);
  } else {
    return res.status(200).json(`⛔ No se encuentra el producto con ID ${pid}`);
  }
});

export default router;
