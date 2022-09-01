import { config } from '../config.js'
import { roundTo } from '../utils.js';
import { ModelHTMLElement } from '../model.js';
import { Cart } from '../cart/model.js'

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
		return ['name', 'price', "product_uom_qty", 'product-id'];
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
			return;
		}
		if(attrName == "product_uom_qty") {
			if(parseInt(newVal) < this.minQty) {
				this.setAttribute("product_uom_qty", this.minQty);
				return;
			}
			let p = this.shadowRoot.querySelector('p');
			Cart.update(this.toObject());
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
	}

	constructor(...args){
		super(...args);
		let shadow = this.attachShadow({mode: 'open'});
		let productbox = document.createElement('div');
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
				productButtonAdd.addEventListener('click', (ev) => {
					ev.stopPropagation();
					this.addQty(1)
				});
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
			productPrize.setAttribute('class', 'product__prize');
						productbox.appendChild(productPrize);
				let htres = document.createElement('h3');
				htres.textContent = roundTo(this.getAttribute('price'), 2) + '€';
				productPrize.appendChild(htres);

		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'css/product-card.css');

		shadow.appendChild(linkElem);
		shadow.appendChild(productbox);
	}
}

class ProductList extends ModelHTMLElement {
	// todo name list setter
	constructor(){
		super();
		let shadow = this.attachShadow({mode: 'open'});

		let container = document.createElement('div');
		container.setAttribute('class', 'product');
		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'css/product-card.css');
		shadow.appendChild(linkElem);
		shadow.appendChild(container);
	}

	clear() {
		for (let pCard of this.shadowRoot.querySelectorAll('product-card')) {
			pCard.remove();
		}
	}

}

class ProductCategoryLi extends HTMLLIElement {
	constructor() {
	  super();

	  // write element functionality in here

	}
}

export { ProductCategoryLi, ProductCard, ProductList };
