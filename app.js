let tg = window.Telegram.WebApp;
tg.expand();

let item = "";

let btn1 = document.getElementById("btn1");
let btn2 = document.getElementById("btn2");
let btn3 = document.getElementById("btn3");
let btn4 = document.getElementById("btn4");

btn1.addEventListener("click", function(){
    if (tg.MainButton.isVisible){
        tg.MainButton.hide();
    }
    else{
        tg.MainButton.SetText("Вы выбрали товар ....");
        item = "1";
    }
});
btn1.addEventListener("click", function(){
    if (tg.MainButton.isVisible){
        tg.MainButton.hide();
    }
    else{
        tg.MainButton.SetText("Вы выбрали товар ....");
        item = "2";
    }
});
btn1.addEventListener("click", function(){
    if (tg.MainButton.isVisible){
        tg.MainButton.hide();
    }
    else{
        tg.MainButton.SetText("Вы выбрали товар ....");
        item = "3";
    }
});
btn1.addEventListener("click", function(){
    if (tg.MainButton.isVisible){
        tg.MainButton.hide();
    }
    else{
        tg.MainButton.SetText("Вы выбрали товар ....");
        item = "4";
    }
});

Telegram.WebApp.onEvent("mainButtonLicked", function(){
    tg.sendData(item);
});

let usercard = document.getElementById("usercard");
let p = document.getElementById("p");

p.innerText = '${tg.initData.user.first_name} ${tg.initDtaUnsafe.user.last_name}';
usercard.appendChild(p);