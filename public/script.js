// Open and close menu from a small device 

const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}


// Add to cart function
function addToCart() {
    const productName = document.querySelector('[data-product-name]').innerText;
    const productPrice = document.querySelector('[data-product-price]').innerText.replace('$', '');
    const productSize = document.getElementById('productSize').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const mainImgSrc = initialMainImgSrc;

    if (productSize === "Select Size") {
        alert('Please select a size');
        return;
    }

    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';

    const cartItem = {
        name: productName,
        price: parseFloat(productPrice),
        size: productSize,
        quantity: parseInt(productQuantity),
        image: mainImgSrc
    };

    setTimeout(function() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        let found = false;
        cart.forEach(item => {
            if (item.name === cartItem.name && item.size === cartItem.size && item.image === cartItem.image) {
                item.quantity += cartItem.quantity;
                found = true;
            }
        });

        if (!found) {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        loadingIndicator.style.display = 'none';
        updateCartItemCount();
        showMiniCart();
    }, 1000);
}

// Function to load cart items from localStorage and display them
function loadCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');

    // Clear the container
    cartItemsContainer.innerHTML = '';

    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let subtotal = 0;

    // Generate the cart items HTML
    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const cartItemHTML = `
            <tr>
                <td><a href="#" data-index="${index}" class="removeItem"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${item.image}" alt=""></td>
                <td>${item.name}</td>
                <td>${item.size}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity}" min="1" data-index="${index}" class="updateQuantity"></td>
                <td>$${itemSubtotal.toFixed(2)}</td>
            </tr>
        `;

        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    // Update the subtotal and total
    cartSubtotal.innerText = `$${subtotal.toFixed(2)}`;
    cartTotal.innerText = `$${subtotal.toFixed(2)}`;

    // Attach event listeners to remove buttons and quantity inputs
    attachEventListeners();
}

// Function to attach event listeners to remove buttons and quantity inputs
function attachEventListeners() {
    const removeButtons = document.querySelectorAll('.removeItem');
    const quantityInputs = document.querySelectorAll('.updateQuantity');

    removeButtons.forEach(button => {
        button.addEventListener('click', removeItem);
    });

    quantityInputs.forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
}

// Function to remove an item from the cart
function removeItem(event) {
    event.preventDefault();
    const index = event.target.closest('a').dataset.index;

    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove the item from the cart
    cart.splice(index, 1);

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reload the cart
    loadCart();

    // Call updateCartItemCount initially and whenever the cart changes
    updateCartItemCount();
}

// Function to update the quantity of an item
function updateQuantity(event) {
    const index = event.target.dataset.index;
    const newQuantity = parseInt(event.target.value);

    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update the quantity of the item
    cart[index].quantity = newQuantity;

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reload the cart
    loadCart();

    updateCartItemCount();
}


// Mini Cart Logic
function showMiniCart() {
    const miniCart = document.getElementById('miniCart');
    const miniCartItems = document.getElementById('miniCartItems');
    miniCartItems.innerHTML = '';

    // Get the cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Populate the mini cart with items
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'mini-cart-item';

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <span><strong>${item.name}</strong></span>
                <span>Size: ${item.size}</span>
                <span>Quantity: ${item.quantity}</span>
                <span>Price: $${item.price.toFixed(2)}</span>
            </div>
        `;

        miniCartItems.appendChild(itemDiv);
    });

    miniCart.classList.add('open');
}

function closeMiniCart() {
    const miniCart = document.getElementById('miniCart');
    miniCart.classList.remove('open');
}

function updateCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalCount = 0;

    cart.forEach(item => {
        totalCount += item.quantity;
        console.log('Item quantity')
    });

    const cartItemCountElement = document.getElementById('cartItemCount');
    if(cartItemCountElement){
        cartItemCountElement.textContent = totalCount;
    }
}

// Coupon Logic
function applyCoupon() {
    const couponInput = document.getElementById('couponInput').value.trim();
    const cartSubtotalElement = document.getElementById('cartSubtotal');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (couponInput === 'Miluz') {
        let cartSubtotal = parseFloat(cartSubtotalElement.innerText.replace('$', ''));
        let discount = cartSubtotal * 0.10;
        let newTotal = cartSubtotal - discount;
        
        cartTotalElement.innerText = `$${newTotal.toFixed(2)}`;
        
        // Clear the input field
        document.getElementById('couponInput').value = '';
        
        // Show the success alert
        alert('10% Coupon applied');
    } else {
        alert('Invalid coupon code');
    }
}

// Add event listener for apply coupon button
document.addEventListener('DOMContentLoaded', (event) => {
    const applyCouponButton = document.getElementById('applyCouponButton');
    if (applyCouponButton) {
        applyCouponButton.addEventListener('click', applyCoupon);
    }

    const addToCartButton = document.getElementById('addToCartButton');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', addToCart);
    }

    // Call updateCartItemCount initially and whenever the cart changes
    updateCartItemCount();

    if (document.getElementById('cartItems')) {
        loadCart();
    }
});


// Update Image on click

var MainImg = document.getElementById("MainImg");
var smallimg = document.getElementsByClassName("small-img");

smallimg[0].onclick = function(){
    MainImg.src = smallimg[0].src;
}

smallimg[1].onclick = function(){
    MainImg.src = smallimg[1].src;
}

smallimg[2].onclick = function(){
    MainImg.src = smallimg[2].src;
}

smallimg[3].onclick = function(){
    MainImg.src = smallimg[3].src;
}

// Zoom functionality
MainImg.addEventListener('mousemove', function(event) {
    const rect = MainImg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    MainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    MainImg.style.transform = 'scale(2)';
});

MainImg.addEventListener('mouseleave', function() {
    MainImg.style.transform = 'scale(1)';
});

MainImg.addEventListener('click', function() {
    if (MainImg.classList.contains('zoomed')) {
        MainImg.classList.remove('zoomed');
        MainImg.style.transform = 'scale(1)';
    } else {
        MainImg.classList.add('zoomed');
        MainImg.style.transform = 'scale(2)';
    }
});


