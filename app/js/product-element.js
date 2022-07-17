import { roundTo } from './utils.js';

class ProductCard extends HTMLElement {
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

			let productAmount = document.createElement('div');
			productAmount.setAttribute('class', 'product__amount');
			productbox.appendChild(productAmount);
				let productButton = document.createElement('div');
				productButton.setAttribute('class', 'product__button sum');
				productButton.appendChild(document.createElement('div'));
				productButton.appendChild(document.createElement('div'));
				productButton.onclick = this.add1OnClick;
				productAmount.appendChild(productButton);
				let productNumber = document.createElement('div');
				productNumber.setAttribute('class', 'product__number');
				productAmount.appendChild(productNumber);
					let p = document.createElement('p');
					p.textContent = 1;
					productNumber.appendChild(p);
				let productButton2 = document.createElement('div');
				productButton2.setAttribute('class', 'product__button minus');
				productButton2.appendChild(document.createElement('div'));
				productButton2.onclick = this.minus1OnClick;
				productAmount.appendChild(productButton2);
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

	add1OnClick() {
		let p = this.shadowRoot.querySelector('p');
		p.textContent = parseInt(p.textContent) + 1;
	}

	minus1OnClick() {
		let p = this.shadowRoot.querySelector('p');
		p.textContent = Math.max(parseInt(p.textContent) - 1, 0);
	}
}

class ProductCategoryLi extends HTMLLIElement {
	constructor() {
	  super();
  
	  // write element functionality in here
  
	}
}

export { ProductCategoryLi, ProductCard };
