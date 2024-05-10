// Cart
let cartIcon = document.querySelector("#cart-icon"); // Получаем элемент иконки корзины
let cart = document.querySelector(".cart"); // Получаем элемент корзины
let closeCart = document.querySelector("#close-cart"); // Получаем кнопку закрытия корзины

// Открытие корзины при клике на иконку
cartIcon.onclick = () => {
    cart.classList.add("active");
};

// Закрытие корзины при клике на кнопку закрытия
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// Проверяем, загрузилась ли вся страница, прежде чем начинать взаимодействие с элементами
if (document.readyState == 'loading') {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// Функция ready, которая выполняет необходимые действия после загрузки страницы
function ready() {
    // Удаление товара из корзины
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeItemFromCart);
    }

    // Изменение количества товара
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    // Добавление товара в корзину
    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener("click", addItemToCart);
    }
    // Обработчик кнопки "Купить"
    document
        .getElementsByClassName("btn-buy")[0]
        .addEventListener("click", buyButtonClicked);
}

// Функция нажатия на кнопку "Купить"
function buyButtonClicked(){
    var cartContent = document.querySelector(".cart-content"); // Получаем контейнер корзины
    var items = cartContent.querySelectorAll('.cart-box'); // Получаем все элементы товаров в корзине

    if(items.length === 0) { // Проверяем, есть ли товары в корзине
        alert("Your cart is empty!"); // Выводим сообщение, если корзина пуста
        return;
    }

    var message = "Order Details:\n"; // Создаем сообщение с деталями заказа

    items.forEach(function(item){ // Проходим по каждому товару в корзине
        var title = item.querySelector('.cart-product-title').innerText; // Получаем название товара
        var price = item.querySelector('.cart-price').innerText; // Получаем цену товара
        var quantity = item.querySelector('.cart-quantity').value; // Получаем количество товара
        
        message += `${title} - ${price} x ${quantity}\n`; // Добавляем детали товара в сообщение
    });

    // Отправка данных на Telegram
    tg.sendData({
        text: message
    }).then(() => {
        // Очистка корзины после отправки заказа
        while (cartContent.firstChild) {
            cartContent.removeChild(cartContent.firstChild);
        }
        updateTotal();
    }).catch((error) => {
        console.error("Error sending data to Telegram:", error);
    });
}

// Функция удаления товара из корзины
function removeItemFromCart(event) {
    var buttonClicked = event.target;
    buttonClicked.parentNode.remove(); // Удаляем только родительский элемент (конкретный товар)
    updateTotal();
}

// Функция изменения количества товара
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

// Функция добавления товара в корзину
function addItemToCart(event) {
    var button = event.target;
    var shopProducts = button.closest(".shop-product"); // Получаем родительский элемент товара
    var title = shopProducts.querySelector(".product-title").innerText; // Получаем название товара
    var price = shopProducts.querySelector(".price").innerText; // Получаем цену товара
    var productImg = shopProducts.querySelector(".product-img").src; // Получаем изображение товара
    addProductToCart(title, price, productImg); // Вызываем функцию добавления товара в корзину
    updateTotal();
}

// Функция добавления товара в корзину
function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div"); // Создаем новый элемент для товара в корзине
    cartShopBox.classList.add("cart-box"); // Добавляем класс для стилизации
    var cartItems = document.querySelector(".cart-content"); // Получаем контейнер корзины
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title"); // Получаем названия всех товаров в корзине
    for (var i = 0; i < cartItemsNames.length; i++) { // Проверяем, не добавлен ли уже такой товар в корзину
        if (cartItemsNames[i].innerText.trim() === title.trim()) {
            alert("You have already added this item to cart"); // Выводим сообщение, если товар уже добавлен
            return;
        }
    }

    // Создаем HTML содержимое для элемента товара в корзине
    var cartBoxContent = `
                        <img src="${productImg}" alt="" class="cart-img">
                        <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <input type="number" value="1" class="cart-quantity">
                        </div>
                        <!-- Remove Cart -->
                        <i class='bx bx-trash-alt cart-remove'></i>
    `;
    cartShopBox.innerHTML = cartBoxContent; // Добавляем HTML содержимое в элемент товара в корзине
    cartItems.append(cartShopBox); // Добавляем элемент товара в корзину

    // Добавляем обработчик на кнопку удаления товара
    cartShopBox
        .getElementsByClassName("cart-remove")[0]
        .addEventListener("click", removeItemFromCart);

    // Добавляем обработчик на изменение количества товара
    cartShopBox
        .querySelector('.cart-quantity')
        .addEventListener("change", quantityChanged);
}

// Функция обновления общей суммы заказа
function updateTotal() {
    var cartBoxes = document.querySelectorAll('.cart-box'); // Получаем все элементы товаров в корзине
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) { // Проходим по каждому товару в корзине
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.querySelector('.cart-price'); // Получаем элемент с ценой товара
        var quantityElement = cartBox.querySelector('.cart-quantity'); // Получаем элемент с количеством товара
        var price = parseFloat(priceElement.innerText.replace("$", "")); // Получаем цену товара
        var quantity = quantityElement.value; // Получаем количество товара
        total += price * quantity; // Обновляем общую сумму заказа
    }
    // Если цена содержит копейки, округляем до двух знаков после запятой
    total = Math.round(total * 100) / 100;
   
    document.querySelector(".total-price").innerText = "$" + total; // Обновляем отображение общей суммы заказа

}
