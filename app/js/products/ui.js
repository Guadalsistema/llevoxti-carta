import { config } from '../config.js'
import { roundTo } from '../utils.js';
import { ModelHTMLElement } from '../model.js';
import { Cart } from '../cart/model.js'
import { isEmpty } from '../utils.js';

class ProductCard extends ModelHTMLElement {
	__minQty = 0;

	get minQty() {
		return this.__minQty;
	}

	set minQty(val) {
		this.__minQty = val;
		let p = this.shadowRoot.querySelector('p');
		if (parseInt(p) < parseInt(val)) {
			this.setAttribute('product_uom_qty', val);
		}
	}
	get optionalFields() {
		return {
			'show_image': 'show-image',
		};
	}
	get fields() {
		return {
			'id': 'product-id',
			'pos_categ_id': 'category-id',
			'name': 'name',
			'lst_price': 'price',
			'product_uom_qty': 'product_uom_qty',
		};
	}

	static get observedAttributes() {
		return ['name', 'price', "product_uom_qty", 'product-id', 'show-image'];
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if(attrName == "name") {
			let h2 = this.shadowRoot.querySelector('h2');
			h2.textContent = newVal;
			let img = this.shadowRoot.querySelector('img');
			img.setAttribute('alt', newVal);
			return;
		}
		if(attrName == "product-id") {
			let img = this.shadowRoot.querySelector('img');
			img.setAttribute('src', config['url'] + '/web/image/product.product/' + newVal + '/image_128');
			img.classList.add("product__imagen");
			return;
		}
		if(attrName == "price") {
			let h3 = this.shadowRoot.querySelector('h3');
			h3.textContent = roundTo(newVal,2) + '€';
     		if(newVal<= 0){
				h3.style.display= 'none';
			}
			return;
		}
		if(attrName == "show-image") {
			let img = this.shadowRoot.querySelector('img');
			if(newVal=='false'){
				img.style.display = 'none';
			} else {
				img.style.display = 'block';
			}
			return;
		}
		if(attrName == "product_uom_qty") {
			if(parseInt(newVal) < this.minQty) {
				this.setAttribute("product_uom_qty", this.minQty);
				return;
			}
			let p = this.shadowRoot.querySelector('p');
			if(isEmpty(oldVal)) { oldVal = 0; }
			if (parseInt(oldVal) != parseInt(newVal)) {
				Cart.update(this.toObject());
			}
			const cartCounter = document.querySelector('.products-cart-button > span');
			if(cartCounter) {
				cartCounter.textContent = Cart.number_of_products();
			}
			p.textContent = newVal;
			let minus = this.shadowRoot.querySelector('.minus');
			let qty = this.shadowRoot.querySelector('.product__number');
			if(parseInt(newVal) <= 0) {
				minus.style.display = 'none';
				qty.style.display = 'none';
			} else {
				minus.style.display = 'block';
				qty.style.display = 'block';
			}
			return;
		}
	}

	addQty(val) {
		let qty = parseInt(this.getAttribute('product_uom_qty'));
		this.setAttribute('product_uom_qty', qty + val);
		document.getElementById("t_pedido").value = Cart.total_price;
	}
    tipo_submenu(submenu){
		 let pos = submenu.search(':');
		 let tipo_submenu = submenu.slice(pos+2,pos+3);
        return(tipo_submenu);
	}
	display_qty_producs_submenu() {
		let newCant = this.getAttribute('product_uom_qty');
		let querySelec_menu = document.querySelectorAll("#listProductMenu");
		querySelec_menu.forEach(p => {
			let tipo_submenu = this.tipo_submenu(p.title)
			let contSelectProducts = p.childNodes[0].shadowRoot.querySelectorAll('product-card');
					if(tipo_submenu == "F"){
						p.childNodes[0].setProductsQty(newCant); //importante
					};
			});
		return;
	}
	constructor(fileCss, tipo_menu, ...args){
		super(...args);
		if (typeof fileCss == 'undefined'){
			fileCss = 'css/product-card.css'
		};
		let shadow = this.attachShadow({mode: 'open'});
		let productbox = document.createElement('div');
		productbox.setAttribute('id', 'product__box');
		productbox.setAttribute('class', 'product__box');

			let productName = document.createElement('div');
			productName.setAttribute('class', 'product__name');
			productbox.appendChild(productName);
			let hdos = document.createElement('h2');
			hdos.textContent = this.getAttribute('name');
			productName.appendChild(hdos);

			let image = document.createElement('img');
			productbox.appendChild(image);

			this.productAmount = document.createElement('div');
			this.productAmount.setAttribute('class', 'product__amount');
			productbox.appendChild(this.productAmount);
				let productButtonAdd = document.createElement('div');
				productButtonAdd.setAttribute('class', 'product__button sum');
				productButtonAdd.appendChild(document.createElement('div'));
				productButtonAdd.appendChild(document.createElement('div'));
				if (tipo_menu == "F" || tipo_menu == "S"){
					//Si el tipo de menu es fijo ocultamos boton para no poder añadir ni quitar
					productButtonAdd.addEventListener('click', (ev) => {
						ev.stopPropagation();
						this.addQty(1);
						this.display_qty_producs_submenu();
				     });
				if(tipo_menu == "F"){
					productButtonAdd.hidden = "True"; 
				}
				}
				else {	
					productButtonAdd.addEventListener('click', (ev) => {
						ev.stopPropagation();
						this.addQty(1)
						});
				}
				this.productAmount.appendChild(productButtonAdd);
				let productNumber = document.createElement('div');
				productNumber.setAttribute('class', 'product__number');
				this.productAmount.appendChild(productNumber);
					let p = document.createElement('p');
					p.textContent = 1;
					productNumber.appendChild(p);
				let productButtonMinus = document.createElement('div');
				productButtonMinus.setAttribute('class', 'product__button minus');
				productButtonMinus.appendChild(document.createElement('div'));
				productButtonMinus.addEventListener('click', (ev) => {
					ev.stopPropagation();
					this.addQty(-1)
				});
				this.productAmount.appendChild(productButtonMinus);
			let productPrize = document.createElement('div');
			    productPrize.setAttribute('id', 'product__prize');
			    productPrize.setAttribute('class', 'product__prize');
				productbox.appendChild(productPrize);
				let htres = document.createElement('h3');
				htres.textContent = roundTo(this.getAttribute('price'), 2) + '€';
				productPrize.appendChild(htres);

		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', fileCss);

		shadow.appendChild(linkElem);
		shadow.appendChild(productbox);
	}
}
class ProductList extends ModelHTMLElement {

	static get observedAttributes() {
		return ['display_products_with_0_qty'];
	}

	// todo name list setter
	constructor(fileCss){
		super();
		if (typeof fileCss == 'undefined'){
			fileCss = 'css/product-card.css'
		};
		let shadow = this.attachShadow({mode: 'open'});

		let container = document.createElement('div');
		container.setAttribute('class', 'product');
		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', fileCss);
		shadow.appendChild(linkElem);
		shadow.appendChild(container);
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if(attrName == "display_products_with_0_qty") {
			let h2 = this.shadowRoot.querySelector('h2');
			h2.textContent = newVal;
			let img = this.shadowRoot.querySelector('img');
			img.setAttribute('alt', newVal);
			return;
		}
	}

	clear() {
		for (let pCard of this.shadowRoot.querySelectorAll('product-card')) {
			pCard.remove();
		}
	}

	/**
	 * Hide product function
	 * 
	 * @param {*} func Recive a function to hide products if true
	 */
	displayProductCards(func=undefined) {
		if(func === undefined) {
			func = () => true;
		}
		let cards = this.shadowRoot.querySelectorAll('product-card');
		let index = 0;
		for(var card of cards) {
			let display = "none";
			if(func(card, index)) {
				display = "block";
			}
			card.style.display = display;
			index++;
		}
	}

	/**
	 * @param {array} products
	 */
	loadObjects(products, fileCss, tipo_menu) {
		for (const product of products) {
			let pCard = new ProductCard(fileCss, tipo_menu);
			pCard.fromObject(product);
			this.shadowRoot.appendChild(pCard);
		}
	}

	/**
	 * @param {object} use the properties of object for filter, if key doesn't exist discard it
	 * 
	 * @return Array of elements
	 * 
	 * TODO:
	 * - return NodeList
	 * - Use all childs not only product-card
	 */
	findAll(obj) {
		let arr = Array.from(this.shadowRoot.querySelectorAll("product-card"));
		return arr.filter((el) => {
			for (const [key, value] of Object.entries(obj)) {
				let inKey = el.fields[key];
				if (!el.hasAttribute(inKey) || el.getAttribute(inKey) != value) {
					return false;
				}
			}
			return true;
		});
	}

	/**
	 * Set the products-card to Qty
	 * 
	 * @param {int} qty
	 */
	setProductsQty(qty) {
		let cards = this.shadowRoot.querySelectorAll('product-card');
		cards.forEach((card) => card.setAttribute("product_uom_qty", qty));
	}
}

export { ProductCard, ProductList };
