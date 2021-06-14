
document.addEventListener('DOMContentLoaded', ()=>{
    init();
})



const init = (e)=>{
setUpMainCart()

    let removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        let button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
    document.querySelector(".apply-code-btn").addEventListener('click', ()=>{
        checkCodeValidity()})
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)


}
let storage = new Storage()
 cart = Storage.getCart();


function purchaseClicked() {
    alert('Thank you for your purchase')
    let cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
   updateCartTotal()
   ifPromoApplied()
}


function quantityChanged(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
    ifPromoApplied()
}



function addItemToCart(item) {
    let cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    let cartItems = document.getElementsByClassName('cart-items')[0]
   
    let cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${item.image}" width="100" height="100">
            <span class="cart-item-title">${item.name}</span>
        </div>
        <span class="cart-price cart-column">${item.price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value=${item.amount}>
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}


function setUpMainCart(){
let cart = getCartFromLocalStorage()
  populateCart(cart);
  updateCartTotal()
}


function populateCart(cart){
  cart.forEach(item=>addItemToCart(item))
}


function getCartFromLocalStorage(){
 return localStorage.getItem('cart')?JSON.parse
  (localStorage.getItem('cart')):[];
}


function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
    document.getElementsByClassName('sub-total')[0].innerText =  total
}



function checkCodeValidity(){
    let code = document.querySelector(".input-field").value
    code = code.trim();
    const regex = /^[a-z0-9]+$/i;
	const valid = code.match(regex); 
    if(valid!==null){
    calculateDiscount();
     alert("Promo Code applied successfully")
     document.querySelector(".apply-code-btn").disabled = true;
    
    }else
    alert("invalid code")
    
}


function calculateDiscount(){
    let subTotal = document.getElementsByClassName('sub-total')[0];
    let value  = parseFloat(subTotal.innerText)/2;
    document.querySelector(".total-checkout").innerText = value;
    document.querySelector(".discount").innerText = value;

}

function ifPromoApplied(){
    let discount =document.querySelector(".discount").innerText;
    if(discount!= 0.0){
        calculateDiscount()
    }
}

