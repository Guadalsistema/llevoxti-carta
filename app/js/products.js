import { config } from './config.js';

function displayCategories(products) {
	let pTemplate = document.getElementById("product-row-tmpl");
	let placeholder = document.querySelector('div.product');
	for (const product of products) {
		let container = pTemplate.content.querySelector('.product__box');
		let name = pTemplate.content.querySelector('h2');
		let price = pTemplate.content.querySelector('h3');
		name.textContent = product.name;
		price.textContent = product.price + '€';
		container.setAttribute('product-id', product.id);
		container.setAttribute('category-id', product.pos_categ_id);
		var clone = document.importNode(pTemplate.content, true);
		placeholder.appendChild(clone);
	}
}

function workProducts() {
	var url = config["url"] + "/menu";
	fetch(url, {
	  method: 'GET',
	}).then(res => res.json())
	.then(products => displayCategories(products))
	.catch(error => console.error('Error:', error));
}

customElements.define('product-card', ProductCard);

workProducts();
