import { roundTo, InvalidArgumentException } from '../utils.js';

class ProductCard extends HTMLElement {
	static get fields() {
		return {
			'id': 'product-id',
			'pos_categ_id': 'category-id',
			'name': 'name',
			'lst_price': 'price',
		};
	}

	static get observedAttributes() {
		return ['name', 'price'];
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if(attrName == "name") {
			let h2 = this.shadowRoot.querySelector('h2');
			h2.textContent = newVal;
			return;
		}
		if(attrName == "price") {
			let h3 = this.shadowRoot.querySelector('h3');
			h3.textContent = roundTo(newVal) + '€';
			return;
		}
	}

	add1OnClick() {
		let p = this.productAmount.querySelector('p');
		p.textContent = parseInt(p.textContent) + 1;
	}

	minus1OnClick() {
		let p = this.productAmount.querySelector('p');
		p.textContent = Math.max(parseInt(p.textContent) - 1, 1);
	}

	fromObject(obj) {
		for(const key in ProductCard.fields) {
			if(!obj[key]) {
				throw InvalidArgumentException;
			}
			this.setAttribute(ProductCard.fields[key], obj[key]);
		}
	}

	toObject() {	
		obj = {}
		for(const key in ProductCard.fields) {
			obj[key] = this.getAttribute(ProductCard.fields[key]);
		}
		return obj;
	}

	constructor(){
		super();
		let shadow = this.attachShadow({mode: 'open'});
		let productbox = document.createElement('div');
		productbox.setAttribute('class', 'product__box');

			let productName = document.createElement('div');
			productName.setAttribute('class', 'product__name');
			productbox.appendChild(productName);
			let hdos = document.createElement('h2');
			hdos.textContent = this.getAttribute('name');
			productName.appendChild(hdos);

			this.productAmount = document.createElement('div');
			this.productAmount.setAttribute('class', 'product__amount');
			productbox.appendChild(this.productAmount);
				let productButtonAdd = document.createElement('div');
				productButtonAdd.setAttribute('class', 'product__button sum');
				productButtonAdd.appendChild(document.createElement('div'));
				productButtonAdd.appendChild(document.createElement('div'));
				productButtonAdd.onclick = this.add1OnClick.bind(this);
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
				productButtonMinus.onclick = this.minus1OnClick.bind(this);
				this.productAmount.appendChild(productButtonMinus);
			let productPrize = document.createElement('div');
			productPrize.setAttribute('class', 'product__prize');
			productbox.appendChild(productPrize);
				let htres = document.createElement('h3');
				htres.textContent = roundTo(this.getAttribute('price')) + '€';
				productPrize.appendChild(htres);

		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'css/product-card.css');

		shadow.appendChild(linkElem);
		shadow.appendChild(productbox);
	}
}

class ProductList extends HTMLElement {
	// todo name list setter

	constructor(){
		super();
		let shadow = this.attachShadow({mode: 'open'});

		let container = document.createElement('div');
		container.setAttribute('class', 'product');
			let h1 = document.createElement('h1');
			h1.setAttribute('class', 'product__title');
			h1.textContent = "TODO";
			container.appendChild(h1);

		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'css/product-card.css');
		shadow.appendChild(linkElem);
		shadow.appendChild(container);
	}
}

class ProductCategoryLi extends HTMLLIElement {
	constructor() {
	  super();
  
	  // write element functionality in here
  
	}
}

export { ProductCategoryLi, ProductCard, ProductList };
