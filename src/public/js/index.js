const socket = io();
socket.on('allProducts', allProducts => {
    const ul = document.querySelector('ul');
    ul.innerHTML = ""; 
    allProducts.forEach((product) => {
        const li = document.createElement('li');
        li.innerText = "Title: " + product.title + " Code: " + product.code + " Price: " + product.price;
        ul.appendChild(li);
    });
});

const addProduct = function () {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const code = document.getElementById('code').value;
    const stock =  document.getElementById('stock').value;
    socket.emit('addProduct', { title, description, price, thumbnail, code, stock });
};
socket.on('errorInsert', message => {
    alert(message);
});