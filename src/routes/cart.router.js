const express = require('express');
const cartController = require('../controllers/cart.controller')

const cartRouter = express.Router();

cartRouter.get('/:cid', cartController.getCart);
cartRouter.post('/', cartController.addCart);
cartRouter.post('/:cid/products/:pid', cartController.addCartItem);

module.exports = cartRouter;