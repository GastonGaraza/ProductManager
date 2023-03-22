const ProductManager = require('../ProductManager');
const productManager = new ProductManager('../');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartitem.model');

exports.getCart = async (req, res) => {  
    try {
        const cid = parseInt(req.params.cid);
        const findedCart = await productManager.getCartById(cid);
        res.send(findedCart);
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
      };
}

exports.addCart = async (req, res) => {
    try {
        const cartAdded = await productManager.addCart();
        res.send(cartAdded);    
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

exports.addCartItem = async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const quantity = !req.body.quantity ? 1 : req.body.quantity;
        const findedCart = await productManager.addCartItem(cid, pid, quantity);  
        res.send(findedCart);  
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

