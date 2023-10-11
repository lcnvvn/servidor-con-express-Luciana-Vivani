import { Router } from "express";
import path from "path";
import { getJSONFromFile, getNewId, saveJSONToFile } from "../utilities.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const dbPath = path.join(__dirname, "../db/carts.json");

const carts = await getJSONFromFile(dbPath);

// get carts (test)
router.get("/carts", async (req, res) => {
  return res.status(200).json(carts);
});

// post new cart
router.post("/carts", async (req, res) => {
  const carts = await getJSONFromFile(dbPath);
  const newCart = {
    id: getNewId(),
    products: [],
  };
  carts.push(newCart);
  await saveJSONToFile(dbPath, carts);
  res.status(200).json(newCart);
});

// get cart by id
router.get("/carts/:cid", async (req, res) => {
  const carts = await getJSONFromFile(dbPath);
  const { cid } = req.params;
  let cart = carts.find((cart) => cart.id === cid);
  if (!cart) {
    return res.status(400).json(`⚠️ No se encuentra el cart con ID ${cid}`);
  }
  return res.status(200).json(cart);
});

// add product to cart
router.post("/carts/:cid/product/:pid", async (req, res) => {
  const carts = await getJSONFromFile(dbPath);
  const { cid, pid } = req.params;
  const cartIndex = carts.findIndex((cart) => cart.id === cid);
  let cart = carts.find((cart) => cart.id === cid);
  if (!cart) {
    return res.status(400).json(`⚠️ No se encuentra el cart con ID ${pid}`);
  }
  const existingCart = carts[cartIndex];
  const products = existingCart[1]; /* 
  const newProduct = {id: pid, quantity: 1}
  products.push(newProduct);
  carts.push(cart);
  await saveJSONToFile(dbPath, carts);
  res.status(200).json(cart); */
});

export default router;
