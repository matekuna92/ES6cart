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
            price: currentProduct.querySelector('.product__price').innerText,
            quantity: 1
        };

        // ellenőrizni kell, hozzá lett-e már adva a product korábban
        const isInCart = cart.filter(cartItem => (cartItem.name === product.name)).length > 0;
        console.log(isInCart);
        // csak akkor tesszük bele, ha még nincs a kosárban (tagadjuk a fenti értéket)
        if(!isInCart)
        {
            // ES6 template string, így nincs szükség string összefűzésre
            cartDom.insertAdjacentHTML('beforeend',
            `<div class="cart__item">
                <img class="cart__item__image" src="${product.image}" alt="${product.name}">
                <h2 class="cart__item__name"> ${product.name} </h2>
                <h3 class="cart__item__price"> ${product.price} </h3>
                <h3 class="cart__item__quantity"> ${product.quantity} </h3>
                <button class="btn btn--primary btn--small btn--danger" data-action="DECREASE_QUANTITY"> &minus; </button>
                <button class="btn btn--primary btn--small" data-action="INCREASE_QUANTITY"> &plus; </button>
                <button class="btn btn--danger btn--small" data-action="DELETE_PRODUCT"> &times; </button>
                
            </div>`
            );

            cart.push(product);
            button.innerText = 'Already in cart';
            button.disabled = true;

            let cartItems = cartDom.querySelectorAll('.cart__item');
            
            cartItems.forEach(cartItem => {
                if( cartItem.querySelector('.cart__item__name').innerText === product.name )
                {
                    cartItem.querySelector('[data-action="INCREASE_QUANTITY"]')
                    .addEventListener('click', () => {
                        cart.forEach(item => {
                            if(item.name === product.name)
                            {
                                cartItem.querySelector('.cart__item__quantity').innerText = ++item.quantity;
                                // item.quantity++ esetén első kattintásra nem növeszik az érték mert ekkor
                                // először megjelenik az érték, aztán növeli az értékét.
                                // ++item.quantity esetén először növeli meg az értéket, aztán jelenik meg
                                cartItem.querySelector('[data-action="DECREASE_QUANTITY"]').classList.remove('btn--danger');
                            }
                        })
                    })

                    cartItem.querySelector('[data-action="DECREASE_QUANTITY"]')
                    .addEventListener('click', () => {
                        cart.forEach(item => {
                            if(item.name === product.name)
                            {
                                if( item.quantity > 1 )
                                {
                                    cartItem.querySelector('.cart__item__quantity').innerText = --item.quantity;
                                }
                                else
                                {
                                    cartItem.classList.add('cart__item__removed');
                                    setTimeout( () => cartItem.remove(), 250);
                                    
                                    // magában a cart tömmben viszont még mindig megmarad a termék
                                    console.log(cart);
                                    cart = cart.filter( cartItem => cartItem.name !== product.name);
                                    console.log(cart);

                                    // gomb visszaállítása disabled állapotról
                                    button.innerText = 'Add to cart';
                                    button.disabled = false;
                                }

                                if( item.quantity == 1 )
                                {
                                    cartItem.querySelector('[data-action="DECREASE_QUANTITY"]').classList.add('btn--danger');
                                }
                            }
                        })
                    })

                    cartItem.querySelector('[data-action="DELETE_PRODUCT"]')
                    .addEventListener('click', () => {
                        cart.forEach(item => {
                            if(item.name === product.name)
                            {
                                if( item.quantity > 1 )
                                {
                                    cartItem.querySelector('.cart__item__quantity').innerText = --item.quantity;
                                }
                                else
                                {
                                    cartItem.classList.add('cart__item__removed');
                                    setTimeout( () => cartItem.remove(), 250);
                                    
                                    // magában a cart tömmben viszont még mindig megmarad a termék
                                    console.log(cart);
                                    cart = cart.filter( cartItem => cartItem.name !== product.name);
                                    console.log(cart);

                                    // gomb visszaállítása disabled állapotról
                                    button.innerText = 'Add to cart';
                                    button.disabled = false;
                                }
                            }
                        })
                    })
                }
            });
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