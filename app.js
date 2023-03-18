const express = require('express')

const app = express()
const PORT = 4000

const ProductManager = require('./ProductManager');
const productManager = new ProductManager('./Products.json');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/products', async  (req, res) => {  
    try {
        let allProducts = [];
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            allProducts = await productManager.getProductsWithLimit(limit);
        }else{
            allProducts = await productManager.getProducts();
        }
        res.send(allProducts);
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      };
});

app.get('/products/:pid', async (req, res)=>{  
    try {
        const pid = parseInt(req.params.pid);
        const findedProduct = await productManager.getProductById(pid);
        res.send(findedProduct);
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      };
}) 

app.listen(PORT, (err) => {
    if (err) return console.log(`Error running the server on port ${PORT}`)

    console.log(`Servidor iniciado en el puerto ${PORT}`)
})
