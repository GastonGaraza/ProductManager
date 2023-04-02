const express = require('express')
const productRouter = require('./routes/product.router');
const cartRouter = require('./routes/cart.router');
const viewsRouter = require('./routes/views.router');

const ProductManager = require('./ProductManager');
const productManager = new ProductManager('./');
const Product = require('./models/product.model');

const app = express()
const PORT = process.env.PORT || 8080;

const handlebars = require('express-handlebars');

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine','handlebars' );

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/virtual', express.static(__dirname + '/public'));

app.use('', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

http.listen(PORT, (err) => {
    if (err) return console.log(`Error running the server on port ${PORT}`)

    console.log(`Servidor iniciado en el puerto ${PORT}`)
})

const socketIO = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

// Handle Socket.io connections
socketIO.on('connection', async (socket) => {
    console.log('New client connected');

    let allProducts = await productManager.getProducts();
    
    socketIO.emit('allProducts', allProducts);

    await socket.on('addProduct', async function (datos) {
        if (datos.title && datos.description && datos.price && datos.thumbnail && datos.code && datos.stock){
            const sameProduct = await productManager.checkProduct(datos.code);
            if (!sameProduct){
                const productToAdd = new Product(datos.title, datos.description, datos.price, datos.thumbnail, datos.code, datos.stock)
                const productAdded = await productManager.addProduct(productToAdd);
                allProducts = await productManager.getProducts();
                socketIO.emit('allProducts', allProducts);
            }else{
                socketIO.emit('errorInsert', "A product with the code (" + datos.code + ") already exists");       }
            }  
    });

    // Handle Socket.io disconnections
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});