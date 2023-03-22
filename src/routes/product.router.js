const express = require('express');
const productController = require('../controllers/product.controller')

const productRouter = express.Router();

productRouter.get('/:pid', productController.getProduct);
productRouter.get('/', productController.getProducts);
productRouter.post('/', productController.addProduct);
productRouter.put('/:pid', productController.updateProduct);
productRouter.delete('/:pid', productController.deleteProduct);

module.exports = productRouter;