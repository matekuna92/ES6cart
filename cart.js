let addToCartButtons = document.querySelectorAll('[data-action=ADD_TO_CART]');
let cartDom = document.querySelector('.cart');
let cart = [];

// ES6
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        let currentProduct = button.parentNode;
        
        const product = {
            image: currentProduct.querySelector('.product__image').getAttribute('src'),
            name: currentProduct.querySelector('.product__name').innerText,
            price: currentProduct.querySelector('.product__price').innerText
        };

        // ellenőrizni kell, hozzá lett-e már adva a product korábban
        const isInCart = cart.filter(cartItem => (cartItem.name === product.name)).length > 0;
        console.log(isInCart);
        // csak akkor tesszük bele, ha még nincs a kosárban (tagadjuk a fenti értéket)
        if(!isInCart)
        {
            // ES6 template string, így nincs szükség string összefűzésre
            cartDom.insertAdjacentHTML('beforeend',
            `<div class="cart-item">
                <img class="cart__item__image" src="${product.image}" alt="${product.name}">
                <h2 class="cart__product__name"> ${product.name} </h2>
                <h3 class="cart__product__price"> ${product.price} </h3>
            </div>`
            );

            cart.push(product);
            button.innerText = 'Already in cart';
        }
    });
});

/* ES5
addToCartButtons.forEach(function(button)
{
    console.log(button);
})
*/

// aktuális szülő eltárolása

// product template, amelyben az adott terméket tároljuk, amire kattintottunk

// beiilesztés, megjelenítjük a kosárban a terméket