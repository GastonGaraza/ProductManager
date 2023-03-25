const ProductManager = require('../ProductManager');
const productManager = new ProductManager('./');
const Product = require('../models/product.model');

exports.getProducts = async  (req, res) => { 
    try {
        let allProducts = [];
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            allProducts = await productManager.getProductsWithLimit(limit);
        }else{
            allProducts = await productManager.getProducts();
        }
        res.send(allProducts);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    };
}

exports.getProduct = async (req, res) => {  
    try {
        const pid = parseInt(req.params.pid);
        const findedProduct = await productManager.getProductById(pid);
        res.send(findedProduct);
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
      };
}

exports.addProduct = async (req, res) => {
    try {
        const {title, description, price, thumbnail, code, stock} = req.body;
        if (title && description && price && thumbnail && code && stock){
            const sameProduct = await productManager.checkProduct(code);
            if (!sameProduct){
                const productToAdd = new Product(title, description, price, thumbnail, code, stock)
                const productAdded = await productManager.addProduct(productToAdd);
                res.send(productAdded);
            }else{
                console.error("Product already exists with code: " + code);
                res.sendStatus(500);            }
        }       
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

exports.updateProduct = async (req, res) => {
    console.log(req.body);
    try {
        const pid = parseInt(req.params.pid);
        const modifiedProduct = await productManager.updateProduct(pid, req.body)
        res.send(modifiedProduct);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

exports.deleteProduct = async (req, res) => {
    console.log(req.body);
    try {
        const pid = parseInt(req.params.pid);
        const productToDelete = await productManager.deleteProduct(pid);
        res.send(productToDelete);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}