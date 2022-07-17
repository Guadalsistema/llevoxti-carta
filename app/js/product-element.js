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
			productName.appendChild(hdos);

			let productAmount = document.createElement('div');
			productAmount.setAttribute('class', 'product__amount');
			productbox.appendChild(productAmount);
				let productButton = document.createElement('div');
				productButton.setAttribute('class', 'product__button');
				productAmount.appendChild(productButton);
				productButton.appendChild(document.createElement('div'));
				productButton.appendChild(document.createElement('div'));
				let productNumber = document.createElement('div');
				productNumber.setAttribute('class', 'product__number');
				productAmount.appendChild(productNumber);
					let p = document.createElement('p');
					p.textContent = 1;
					productNumber.appendChild(p);
				let productButton2 = document.createElement('div');
				productButton2.setAttribute('class', 'product__button');
				productAmount.appendChild(productButton2);
				productButton2.appendChild(document.createElement('div'));
			let productPrize = document.createElement('div');
			productPrize.setAttribute('class', 'product__prize');
			productbox.appendChild(productPrize);
				let htres = document.createElement('h3');
				productPrize.appendChild(htres);

		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'css/product-card.css');

		shadow.appendChild(linkElem);
		shadow.appendChild(productbox);
	}
}

class ProductCategoryLi extends HTMLLIElement {
	constructor() {
	  super();
  
	  // write element functionality in here
  
	}
}

export { ProductCategoryLi, ProductCard };
