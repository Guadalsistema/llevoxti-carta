import { config } from './config.js';
import { ProductCard } from './product-element.js'

function displayCategories(products) {
	let placeholder = document.getElementById("product-list");
	let pTemplate = document.getElementById('product-row-list');
	for (const product of products) {
		let card = pTemplate.content.querySelector('product-card');
		card.setAttribute("product-id", product.id);
		card.setAttribute("category-id", product.pos_categ_id);
		card.setAttribute("name", product.name);
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
