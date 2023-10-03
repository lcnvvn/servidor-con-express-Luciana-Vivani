const { promises: fs } = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    const products = await getJSONFromFile(this.path);
    const { title, description, price, thumbnail, code, stock } = product;
    let duplicateProduct = products.find((prod) => prod.code === code);
    if (duplicateProduct) {
      throw new Error(`ya existe un producto con el código ${code}`);
    }
    if (!(title && description && price && thumbnail && code && stock)) {
      throw new Error(`falta algún campo`);
    }
    const id = products.length + 1;
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    products.push(newProduct);
    await saveJSONToFile(this.path, products);
  }

  getProducts() {
    return getJSONFromFile(this.path);
    //console.log(`➡️ Productos: ${JSON.stringify(products, null, 3)}`);
  }

  async getProductByID(id) {
    const products = await getJSONFromFile(this.path);
    let product = products.find((prod) => prod.id === id);
    if (!product) {
      console.log(`⚠️ No se encuentra el producto con ID ${id}`);
    }
    return product;
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    const products = await getJSONFromFile(this.path);
    const productIndex = products.findIndex((prod) => prod.id === id);

    if (productIndex === -1) {
      console.log(`⛔ No se encuentra el producto con ID ${id}`);
    } else {
      const existingProduct = products[productIndex];
      if (title) existingProduct.title = title;
      if (description) existingProduct.description = description;
      if (price) existingProduct.price = price;
      if (thumbnail) existingProduct.thumbnail = thumbnail;
      if (code) existingProduct.code = code;
      if (stock) existingProduct.stock = stock;
      await saveJSONToFile(this.path, products);
      console.log(`✅ Producto con ID ${id} actualizado.`);
    }
  }

  async deleteProduct(id) {
    const products = await getJSONFromFile(this.path);
    let productIndex = products.findIndex((prod) => prod.id === id);
    if (productIndex > -1) {
      products.splice(productIndex, 1);
      await saveJSONToFile(this.path, products);
      console.log(`✅ Se ha borrado el producto con ID ${id}`);
    } else {
      console.log(`⛔Error: no se ha podido borrar el producto con ID ${id}`);
    }
  }
}

///// Utilidades

const getJSONFromFile = async (path) => {
  try {
    await fs.access(path);
  } catch (error) {
    return [];
  }
  const content = await fs.readFile(path, "utf-8");
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`el archivo ${path} no tiene un formato JSON válido.`);
  }
};

const saveJSONToFile = async (path, data) => {
  const content = JSON.stringify(data, null, 2);
  try {
    await fs.writeFile(path, content, "utf-8");
  } catch (error) {
    throw new Error(`el archivo ${path} no pudo ser escrito.`);
  }
};

module.exports = {
  ProductManager,
};
