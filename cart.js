let addToCartButtons = document.querySelectorAll('[data-action=ADD_TO_CART]');
let cartDom = document.querySelector('.cart');

//let cart = [];
// már a localstorage-ból jön a cart, a string-et vissza kell parse-olni tömbbé
// üres tömb, ha nincs adat, különben null-t kapunk
let cart = JSON.parse(localStorage.getItem('cart')) || []; 

// a storage-ban megmaradnak az itemek újratöltés után, viszont a DOM megjelenítést is le kell kezelni
// minden elemre, ami a storage tömbben van jöjjön létre a div

// ha vannak itemek a tömbben, hozzáadjuk a dom-hoz ugyanúgy, mintha az Add to cart gombot használnánk
// ekkor a click események nem működnek  a gombokon, mert az if-en kívül vannak eredetileg

if( cart.length > 0 )
{
    cart.forEach( (product) => {
        insertProductToDOM(product);

            // localstorage esetén is kezelni kell, ha már benne van a tömbben az item, legyen disabled a gomb
            // nem kell külön eventListenert létrehozni 
            addToCartButtons.forEach( button => {
                let currentProduct = button.parentNode;

                // ha a szülő elem neve megegyezik a localstorage-ban tárolt product nevével, akkor disabled
                if(currentProduct.querySelector('.product__name').innerText === product.name)
                {
                    handleActionButtons(button, product);
                }
            }) 
        })
}

// ES6
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        let currentProduct = button.parentNode;
        
        // mikor nem storage-ból adunk hozzá, alapértelmezetten 1 a mennyiség, így 
        // a btn-danger feltételt elég vizsgálni csak a localstorage-ból való hozzáadás esetén
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
            insertProductToDOM(product);     

            cart.push(product);
            // tömb átalakítása stringgé, a setItem csak string formátumot fogad el
            localStorage.setItem('cart', JSON.stringify(cart));

            handleActionButtons(button, product);
        }
    });
});

// mivel product-ra hivatkozunk a függvényen belül, át kell adni paraméterként
function insertProductToDOM(product)
{
    cartDom.insertAdjacentHTML('beforeend',
            `<div class="cart__item">
                <img class="cart__item__image" src="${product.image}" alt="${product.name}">
                <h2 class="cart__item__name"> ${product.name} </h2>
                <h3 class="cart__item__price"> ${product.price} </h3>
                <h3 class="cart__item__quantity"> ${product.quantity} </h3>
                <button class="btn btn--primary btn--small ${(product.quantity === 1 ? 'btn--danger' : '' )}" 
                    data-action="DECREASE_QUANTITY"> &minus; </button>
                <button class="btn btn--primary btn--small" data-action="INCREASE_QUANTITY"> &plus; </button>
                <button class="btn btn--danger btn--small" data-action="DELETE_PRODUCT"> &times; </button>
                
            </div>`
            );
}

function handleActionButtons(button, product)
{
    button.innerText = 'Already in cart';
    button.disabled = true;

    let cartItems = cartDom.querySelectorAll('.cart__item');
    
    cartItems.forEach(cartItem => {
        if( cartItem.querySelector('.cart__item__name').innerText === product.name )
        {
            cartItem.querySelector('[data-action="INCREASE_QUANTITY"]')
            .addEventListener('click', () => increaseAction(product, cartItem));

            cartItem.querySelector('[data-action="DECREASE_QUANTITY"]')
            .addEventListener('click', () => decreaseAction(product, cartItem, button));

            cartItem.querySelector('[data-action="DELETE_PRODUCT"]')
            .addEventListener('click', () => deleteAction(product, cartItem, button));
        }
    });
}

function increaseAction(product, cartItem)
{
    console.log('cartItem:', cartItem);
    cart.forEach(item => {
        if(item.name === product.name)
        {
            cartItem.querySelector('.cart__item__quantity').innerText = ++item.quantity;
            // item.quantity++ esetén első kattintásra nem növeszik az érték mert ekkor
            // először megjelenik az érték, aztán növeli az értékét.
            // ++item.quantity esetén először növeli meg az értéket, aztán jelenik meg
            cartItem.querySelector('[data-action="DECREASE_QUANTITY"]').classList.remove('btn--danger');
            // minden egyes változást is menteni kell a storage-ba
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    })
}

function decreaseAction(product, cartItem, button)
{
    cart.forEach(item => {
        if(item.name === product.name)
        {
            if( item.quantity > 1 )
            {
                cartItem.querySelector('.cart__item__quantity').innerText = --item.quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
            }
            else
            {
                deleteAction(product, cartItem, button);
            }

            if( item.quantity == 1 )
            {
                cartItem.querySelector('[data-action="DECREASE_QUANTITY"]').classList.add('btn--danger');
            }
        }
    })
}

function deleteAction(product, cartItem, button)
{
    cart.forEach(item => {
        if(item.name === product.name)
        {
                cartItem.classList.add('cart__item__removed');
                setTimeout( () => cartItem.remove(), 250);
                
                // magában a cart tömmben viszont még mindig megmarad a termék
                console.log(cart);
                cart = cart.filter( cartItem => cartItem.name !== product.name);
                localStorage.setItem('cart', JSON.stringify(cart));
                console.log(cart);

                // gomb visszaállítása disabled állapotról
                button.innerText = 'Add to cart';
                button.disabled = false;
        }
    })
}

/* ES5
addToCartButtons.forEach(function(button)
{
    console.log(button);
})
*/

// aktuális szülő eltárolása

// product template, amelyben az adott terméket tároljuk, amire kattintottunk

// beiilesztés, megjelenítjük a kosárban a terméket