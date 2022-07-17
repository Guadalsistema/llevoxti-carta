import { config } from './config.js';
import { ProductCategoryLi, ProductCard, ProductList } from  './products/ui.js';

function displayProducts(products) {
	var placeholder = document.querySelector('product-list');
	for (const product of products) {
		let pCard = document.createElement('product-card');
		pCard.setAttribute('product-id', product.id);
		pCard.setAttribute('category-id', product.pos_categ_id);
		pCard.setAttribute('name', product.name);
		pCard.setAttribute('price', product.lst_price);
		placeholder.shadowRoot.appendChild(pCard);
	}
}

function displayCategories(categories) {
	let pTemplate = document.getElementById("li-category-tmpl");
	let placeholder = document.querySelector('ul');
	for (const category of categories) {
		let container = pTemplate.content.querySelector('.menu__categories-item');
		container.textContent = category.name;
		container.setAttribute('category-id', category.id);
		var clone = document.importNode(pTemplate.content, true);
		placeholder.appendChild(clone);
	}
}

function workProducts() {
	var url_products = config["url"] + "/menu";
	fetch(url_products, {
	  method: 'GET',
	}).then(res => res.json())
	.then(products => displayProducts(products));
	var url_categories = config["url"] + "/menu/category";
	fetch(url_categories, {
	  method: 'GET',
	}).then(res => res.json())
	.then(categories => displayCategories(categories));
}

customElements.define('product-category', ProductCategoryLi, { extends: "li" });
customElements.define('product-list', ProductList);
customElements.define('product-card', ProductCard);

workProducts();
