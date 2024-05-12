// Cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

// Open Cart
cartIcon.onclick = () => {
    cart.classList.add("active");
};

// Close Cart
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// Cart Working JS
if (document.readyState == 'loading') {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// Making Function
function ready() {
    // Remove Item From Cart
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeItemFromCart);
    }

    // Quantity Changes
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    // Add To Cart
    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener("click", addItemToCart);
    }

    // Buy button Work
    document
        .getElementsByClassName("btn-buy")[0]
        .addEventListener("click", openOrderForm);

    // Submit Order
    document.querySelector('#submit-order').addEventListener('click', function() {
        var name = document.querySelector('#name').value;
        var email = document.querySelector('#email').value;
        var address = document.querySelector('#address').value;

        // Дополнительная логика для обработки заказа

        // Пример вывода данных в консоль
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('address:', address);

        // Очистка формы после отправки заказа
        document.querySelector('#name').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('#address').value = '';

        // Закрытие окна с формой заказа
        document.querySelector('.order-form').style.display = 'none';

        // Дополнительные действия, например, обновление информации о заказе или уведомление пользователя

        // После успешного оформления заказа
        clearCartAndTotal();
    });

    // Close Order Form
    document.querySelector('#close-form').addEventListener('click', function() {
        document.querySelector('.order-form').style.display = 'none';
    });
}

// Open Order Form
function openOrderForm() {
    document.querySelector('.order-form').style.display = 'block';
}

// Buy Button
function buyButtonClicked() {
    var cartContent = document.querySelector(".cart-content");
    var items = cartContent.querySelectorAll('.cart-box');

    if (items.length === 0) {
        // Если корзина пуста, не показывать форму заказа
        alert("Your cart is empty. Please add items to your cart before proceeding to checkout.");
        return;
    }

    var message = "Order Details:\n";

    items.forEach(function(item) {
        var title = item.querySelector('.cart-product-title').innerText;
        var price = item.querySelector('.cart-price').innerText;
        var quantity = item.querySelector('.cart-quantity').value;

        message += `${title} - ${price} x ${quantity}\n`;
    });

    // Отправка данных на Telegram
    tg.sendData({
        text: message
    });

    // Очистка корзины после отправки заказа
    clearCartAndTotal();
}

// Remove Items From Cart
function removeItemFromCart(event) {
    var buttonClicked = event.target;
    buttonClicked.parentNode.remove(); // Corrected to remove only the parent element (the specific item)
    updateTotal();
}

// Quantity Changes
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

// Add To Cart
function addItemToCart(event) {
    var button = event.target;
    var shopProducts = button.parentElement; // Corrected parent selector
    var title = shopProducts.querySelector(".product-title").innerText; // Corrected selector
    var price = shopProducts.querySelector(".price").innerText; // Corrected selector
    var productImg = shopProducts.querySelector(".product-img").src; // Corrected selector
    var size = shopProducts.querySelector(".size-selector").value; // Get selected size
    var color = shopProducts.querySelector(".color-selector").value; // Get selected color
    addProductToCart(title, price, productImg, size, color); // Pass color to addProductToCart
    updateTotal();
}

// Add Product To Cart
function addProductToCart(title, price, productImg, size, color) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.querySelector(".cart-content"); // Corrected selector
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText.trim() === title.trim()) {
            tg.sendData({ text: "You have already added this item to cart" });
            return;
        }
    }

    var cartBoxContent = `
                        <img src="${productImg}" alt="" class="cart-img">
                        <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <div class="cart-size">${size}</div>
                            <div class="cart-color">${color}</div> <!-- Display selected color -->
                            <input type="number" value="1" class="cart-quantity">
                        </div>
                        <!-- Remove Cart -->
                        <i class='bx bx-trash-alt cart-remove'></i>
    `;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);

    // Добавляем обработчик на кнопку удаления товара
    cartShopBox
        .getElementsByClassName("cart-remove")[0]
        .addEventListener("click", removeItemFromCart);

    // Добавляем обработчик на изменение количества товара
    cartShopBox
        .querySelector('.cart-quantity')
        .addEventListener("change", quantityChanged);
}

// Update Total
function updateTotal() {
    var cartBoxes = document.querySelectorAll('.cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.querySelector('.cart-price');
        var quantityElement = cartBox.querySelector('.cart-quantity');
        var price = parseFloat(priceElement.innerText.replace("sum", ""));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    // If price contains some cents value
    total = total.toFixed(3);
   
    document.querySelector(".total-price").innerText = "sum " + total;
}

// Функция для очистки корзины и обнуления общей цены после успешного оформления заказа
function clearCartAndTotal() {
    var cartContent = document.querySelector(".cart-content");
    // Очистка корзины
    while (cartContent.firstChild) {
        cartContent.removeChild(cartContent.firstChild);
    }
    // Обнуление общей цены
    updateTotal();
}

// Теперь мы будем использовать tg.sendData для отправки данных в Telegram.

// Функция для фильтрации товаров по имени
function filterProductsByName(name) {
    var products = document.querySelectorAll('.product-box');
    
    products.forEach(function(product) {
        var productName = product.dataset.name;
        
        // If selected name is "All" or product name matches the selected name, display the product
        if (name === 'All' || productName === name) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Добавляем слушатель событий для изменения выбранного имени
document.getElementById('name-filter').addEventListener('change', function() {
    var selectedName = this.value;
    filterProductsByName(selectedName);
});
