const express = require('express');
const ProductManager = require('../ProductManager');
const productManager = new ProductManager('./');

const viewRouter = express.Router();

viewRouter.get('/', async (req, res)=>{
    allProducts = await productManager.getProducts();

    res.render('home', {
        allProducts,
        title : "Product Manager"
    })
})

viewRouter.get('/realtimeproducts', async (req, res)=>{
    allProducts = await productManager.getProducts();

    res.render('realTimeProducts', {
        title : "Product Manager"
    })
})

module.exports = viewRouter
