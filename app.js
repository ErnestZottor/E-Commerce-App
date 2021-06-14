const main = document.querySelector(".product-page");
const productWrapper = document.querySelector(".prod-details-wrap");
const aside = document.querySelector(".mini-cart");
const itemWrapperDiv = document.querySelector(".body");
const contBtn = document.querySelector(".close-cart");
const cartItems = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total-price");
const subTotal = document.querySelector(".subtotal")
const itemQty = document.querySelector(".item-to-cart")
const itemQuantity = document.getElementsByClassName("item-quantity")
const quantityField = document.getElementsByClassName("qty-field");
const cattt = document.querySelector(".cart-total-title")
const mainCartItems = document.querySelector("cart-items")
const anchorCart = document.querySelector(".cart")
const updateBtns = document.getElementsByClassName("ctrl")
const catRow = document.querySelector(".cart-row")
 


let cart =[]

class Products{

async getProducts(){
    try {
        let results = await fetch('products.json');
        let data = await results.json();
        let products = data.items;
        products =products.map(item=>{
            const {id,name,description,rating,image,price} = item.prod.item1;
            const {image1, image2, image3} = item.prod.item1.leftImage;
            const {txt1, txt2, txt3, txt4, txt5, txt6,} = item.sizes;
            const {col1,col2, col3, hex1,hex2, hex3}= item.colors;
            return {id,name,description,rating,image,price,image1, image2, image3,txt1, txt2, txt3, txt4, txt5, txt6,col1,col2, col3, hex1,hex2, hex3};
           
        })
        return products
    } catch (error) {
        console.log(error)
    }
  }
}


// --------------------------- UI Class ----------------------------------------------------------

class UI{
  
 displayProducts(products){
    let result = '';
    products.forEach(product => {
        
        result += `
        
        <div class="prod-details-wrap">
        <section class="productLeft">
          <img src=${product.image1} alt="choose" />
          <img src=${product.image2} alt="choose" />
          <img src=${product.image3} alt="choose" />
        </section>

        <div class="prod-img-wrap">
          <div class="img" style="background-image: url(${product.image})"></div>
        </div>
        <aside class="prod-desc">
          <h1 data-var="name" class="primary--text"></h1>
          <span class="desc" data-var="description"></span>
          <h2 class="price primary--text">
            <span data-var="price.currency">$</span>
            <span data-var="price.amount">${product.price}</span>
          </h2>
          <div class="color-picker">
            <span class="cl template"></span>
            <span
              class="cl"
              data-text="lightgray"
              style="background-color: ${product.hex1}"
            ></span>
            <span
              class="cl"
              data-text="paleblack"
              style="background-color: ${product.hex2}"
            ></span>
            <span
              class="cl"
              data-text="lightviolet"
              style="background-color: ${product.hex3}"
            ></span>
          </div>
          <div class="info">Color: ${product.col1} <span id="prod-color-text"></span></div>
          <p class="size-chart">Size Chart </p> 
          <div class="size-picker">
            <span class="sz template">
              <span data-text=${product.txt1}>${product.txt1} </span>
            </span>
            <span class="sz" ${product.txt1}>
              <span data-var="text">${product.txt2} </span>
            </span>
            <span class="sz" data-text=${product.txt3}>
              <span data-var="text">${product.txt3}</span>
            </span>
            <span class="sz" data-text=${product.txt4}>
              <span data-var="text">${product.txt4}</span>
            </span>
            <span class="sz" data-text=${product.txt5}>
              <span data-var="text">${product.txt5}</span>
            </span>
            <span class="sz" data-text=${product.txt6}>
              <span data-var="text">${product.txt6}</span>
            </span>
            
          </div>
          <div class="info" style="color: #4b851d">In Stock</div>
          <div class="quantity-selector">
            <button class="ctrl" data-function="sub">-</button>
            <input type="text" class="qty-field" id="quantity-field"  value="1" />
            <button class="ctrl" id="increase-item" data-function="add">+</button>
          </div>

          <div class="button-set">
            <button class="add-to-cart-btn"id="add-to-cart-btn" data-code=${product.id}>Add to cart</button>
          </div>
        </aside>
      </div>
        
        ` 
        ; 
    });
    main.innerHTML = result
 }  

 getBagButtons(){
   
     const buttons =[...document.querySelectorAll(".add-to-cart-btn")];
     buttons.forEach(button=>{
        let id = button.dataset.code;
        let inCart = cart.find(item=>item.id===id);
         if(inCart){
      button.innerText ="In Cart";
      alert("Item already in cart");
    }
    
       button.addEventListener('click',(event)=>{
       let cartItem = {...Storage.getProduct(id), amount:1} 
        cart= [...cart, cartItem]
        
       Storage.saveCart(cart);
       this.setCartValues(cart);
       this.addItemToMiniCart(cartItem)
       this.updateCartAmount(cartItem)
      this.showMiniCart();
        
       }) 
     
         
     })
 }


 setCartValues(cart){ 
   let tempTotal= 0;
   let itemsTotal= 0;
   cart.map(item=>{
     tempTotal+= item.price* item.amount;
     itemsTotal+= item.amount;
     
   })
    cartItems.innerHTML=itemsTotal 
    subTotal.innerText = parseFloat(tempTotal.toFixed(2));
 }



inputFieldValue(){
  let inputFields = [...quantityField]
  let value= 0;
  inputFields.forEach((qtyValues)=>{
    value = new Number(qtyValues.value);
  })
  return value
}


updateCartAmount(items){
  let quant = itemQuantity[0];
  quant.innerText = this.inputFieldValue();
  items.amount= this.inputFieldValue();
  Storage.saveCart(cart);
  this.setCartValues(cart);
}


update(){
  let selectors = [...updateBtns]
  let inputField = quantityField[0]
  let value =0;
    selectors.forEach((ctrl) => {
    ctrl.addEventListener("click", () => {
          value = new Number(inputField.value);
          switch (ctrl.dataset.function) {
        case "add":
          inputField.value = ++value;
          break;

        case "sub":
          if (value > 1) inputField.value = --value;
          break;
      }
  
    });
    });
}

 
openMiniCart(){
  anchorCart.addEventListener('click',this.showMiniCart)
}


showMiniCart(){
   aside.id = 'show-cart'
   
 }


closeMiniCart(button,aside){
  button.addEventListener('click',()=>{
  aside.id = 'none'
  })
}

addItemToMiniCart(item){
  const div = document.createElement('div');
  div.classList.add('item-wrap')
  div.innerHTML =
  `
  <div class="img">
    <img src="${item.image}" alt="" />
  </div>
  <div>
    <h3 data-var="name" class="item-name">${item.name}</h3>
    <h3>
      <span data-var="price.currency">$</span>
      <span data-var="price.amount">${item.price}</span>
    </h3>
    <div class="info">
      <span data-var="customization.color">${item.col1}</span>&nbsp;/
      <span data-var="customization.size">${item.txt1}</span>
    </div>
    <div class="quantity">
      Quantity:
      <span class="item-quantity" id="item-quant">${item.amount}</span>
    </div>
   </div>
  `
  itemWrapperDiv.prepend(div)
  
}

	colorAndSizeChecker() {
		const selectedSize = document.querySelector(" .sz.active"),
			selectedColor = document.querySelector(" .cl.active");

		if (!selectedColor) {
			alert("Please select color");
			return;
		}

		if (!selectedSize) {
			alert("Please select size");
			return;
		}
  }


setUpApp(cart){
  cart = Storage.getCart();
  this.setCartValues(cart);
  this.populateCart(cart);
}


populateCart(cart){
  cart.forEach(item=>this.addItemToMiniCart(item))
}





}


// ------------------- Local Storage Class --------------------------------------



class Storage {

static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products));
}


static getProduct(id){
  let products = JSON.parse(localStorage.getItem('products'));
  return products.find(product => product.id===id)
}


static saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
}


static getCart(){
  return localStorage.getItem('cart')?JSON.parse
  (localStorage.getItem('cart')):[];
}


}


// ----------------------------- Content loading ------------------------------------

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const products = new Products();
     ui.setUpApp();
    // get all produtcs
    products.getProducts().then(products=>{
      
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons()
       // ui.logic()
    }).then(()=>{
      ui.closeMiniCart(contBtn, aside)
     ui.update()
     ui.openMiniCart()
    })
        
})

