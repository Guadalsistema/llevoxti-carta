class ProductCard extends HTMLElement {
	constructor(){
		super();
		let shadow = this.attachShadow({mode: 'open'});
		const style = document.createElement('style');
		style.textContent = ``;
		shadow.appendChild(style);
		// write element functionality in here
	}
}

class ProductCategoryLi extends HTMLLIElement {
	constructor() {
	  super();
  
	  // write element functionality in here
  
	}
}

export { ProductCategoryLi, ProductCard };
