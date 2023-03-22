const fs = require('fs');
const Product = require('./models/product.model');
const Cart = require('./models/cart.model');

class ProductManager {
	constructor(path) {
		this.path = path;
		this.productsFile = this.path + 'productos.json';
		this.cartsFile = this.path + 'carrito.json';
	}

	async writeFile(pathToWrite, data) {
		try {
			await fs.promises.writeFile(pathToWrite ,JSON.stringify(data,null,'\t'));
		} catch (error) {
			console.error("Error writing file: " + error.message);
		}
	};

	getProducts = async () => {
        if (fs.existsSync(this.productsFile)) {
			try {
				const allProducts = await fs.promises.readFile(this.productsFile, 'utf-8');
				if (Object.keys(allProducts).length > 0) {
					return JSON.parse(allProducts);
				}else {
					return [];
				}
			} catch (error) {
				console.error("Can't read products from the filesystem" + error.message);
			}
        }
        else{
            return [];
        }
    }

	getCarts = async () => {
        if (fs.existsSync(this.cartsFile)) {
			try {
				const allCarts = await fs.promises.readFile(this.cartsFile, 'utf-8');
				if (Object.keys(allCarts).length > 0) {
					return JSON.parse(allCarts);
				}else {
					return [];
				}
			} catch (error) {
				console.error("Can't read carts from the filesystem" + error.message);
			}
        }
        else{
            return [];
        }
    }

	getProductsWithLimit = async limit => {
		let allProducts = await this.getProducts();
		return allProducts.slice(0, limit);
    }

	addProduct = async productToAdd => {
		let allProducts = await this.getProducts();
		let productId = 1;
		try {
			allProducts.length === 0 ? productId : productId = allProducts[allProducts.length-1].id + 1;
			if (productToAdd.title != "" && productToAdd.description != "" && productToAdd.price > 0 && productToAdd.thumbnail != "" && productToAdd.code != "" && productToAdd.stock > 0){
				let newProduct = {...productToAdd, id: productId};
				allProducts.push(newProduct);
				await this.writeFile(this.productsFile, allProducts);
				return newProduct;
			}else{
				console.error("All the fields are mandatory (title, description, price, thumbnail, code, stock)");
			}
		} catch (error) {
			console.error("Can't save the product: " + productToAdd.title + " : " + error);	
		}
	}

	addCart = async () => {
		let allCarts = await this.getCarts();
		let cartId = 1;
		try {
			allCarts.length === 0 ? cartId : cartId = allCarts[allCarts.length-1].id + 1;
			const newCart = {...new Cart(), id: cartId};
			allCarts.push(newCart);
			await this.writeFile(this.cartsFile, allCarts);
			return newCart;
		} catch (error) {
			console.error("Can't save the cart: " + error);	
		}
	}

	getProductById = async productId => {
		let allProducts = await this.getProducts();
		for (let i = 0; i < allProducts.length; i++) {
			if (allProducts[i].id === productId) {
				return allProducts[i];
			}
		}
		return null;
	}

	getCartById = async cartId => {
		let allCarts = await this.getCarts();
		for (let i = 0; i < allCarts.length; i++) {
			if (allCarts[i].id === cartId) {
				return allCarts[i];
			}
		}
		return null;
	}

	addCartItem = async (cid, pid, quantity) => {
		let allCarts = await this.getCarts();
		for (let i = 0; i < allCarts.length; i++) {
			if (allCarts[i].id === cid) {
				const item = {"pid": pid, "quantity": quantity};
				let findedItem = null;
				for (let j = 0; j < allCarts[i].products.length; j++) {
					if (allCarts[i].products[j].pid === pid) {
						findedItem = allCarts[i].products[j];
						allCarts[i].products[j].quantity += quantity;
						break;
					}
				}
				if (!findedItem){
					allCarts[i].products.push(item);
				}
				await this.writeFile(this.cartsFile, allCarts);
				return allCarts[i];
			}
		}
		return null;
	}

	deleteProduct = async productId => {
		let allProducts = await this.getProducts();
        for (let i = 0; i < allProducts.length; i++) {
            if (allProducts[i].id === productId) {
                // allProducts.splice(i, 1);
				allProducts[i].status = false;
                await this.writeFile(this.productsFile, allProducts);
                return true;
            }
        }
		console.error("Can't delete the product: " + productId);	
        return false;
	}

	updateProduct = async (productId, productNewValues) => {
		let allProducts = await this.getProducts();
        for (let i = 0; i < allProducts.length; i++) {
            if (allProducts[i].id === productId) {
				if (productNewValues.title != undefined && productNewValues.title != ""){allProducts[i].title = productNewValues.title;}else{console.log("Product title cant be empty")};
				if (productNewValues.description != undefined && productNewValues.description!= "") {allProducts[i].description = productNewValues.description;}else{console.log("Product description cant be empty")};
				if (productNewValues.price != undefined && productNewValues.price >= 0) {allProducts[i].price = productNewValues.price;}else{console.log("Product price cant be negative")};
				if (productNewValues.thumbnail != undefined && productNewValues.thumbnail != "") {allProducts[i].thumbnail = productNewValues.thumbnail;}else{console.log("Product thumbnail cant be empty")};
				if (productNewValues.code != undefined && productNewValues.code != "") {allProducts[i].code = productNewValues.code;}else{console.log("Product code cant be empty")};
				if (productNewValues.stock != undefined && productNewValues.stock >= 0) {allProducts[i].stock = productNewValues.stock;}else{console.log("Product stock cant be negative")};
                await this.writeFile(this.productsFile, allProducts);
                return allProducts[i];
            }
        }
		console.error("Can't update the product: " + productId);	
        return null;
	}
}

module.exports = ProductManager;

let productManager = new ProductManager('./');
const testCases = async () => {
	let getProducts = await productManager.getProducts();
	console.log(getProducts);
	let addProduct = await productManager.addProduct(
		{
			title: 'producto prueba',
            description: 'Este es un producto prueba',
            price: 200,
            thumbnail: 'Sin imagen',
            code: 'abc123',
			stock: 25
		}
	);
	console.log(addProduct);
	getProducts = await productManager.getProducts();
	console.log(getProducts);
	let getProductById = await productManager.getProductById(8);
	console.log(getProductById);
	getProductById = await productManager.getProductById(1);
	console.log(getProductById);

    let updateProduct = await productManager.updateProduct(1, 
		{
            price: 150,
			stock: 34
		}
	);
	console.log(updateProduct);
}
