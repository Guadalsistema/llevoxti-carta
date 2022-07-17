import { roundTo } from '../utils.js';

class ProductCard extends HTMLElement {
	add1OnClick() {
		let p = this.productAmount.querySelector('p');
		p.textContent = parseInt(p.textContent) + 1;
	}

	minus1OnClick() {
		let p = this.productAmount.querySelector('p');
		p.textContent = Math.max(parseInt(p.textContent) - 1, 1);
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
	constructor(){
		super();
		
	}
}

class ProductCategoryLi extends HTMLLIElement {
	constructor() {
	  super();
  
	  // write element functionality in here
  
	}
}

export { ProductCategoryLi, ProductCard, ProductList };