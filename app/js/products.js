import { config } from './config.js';
import { ProductCategoryLi, ProductCard, ProductList } from  './products/ui.js';

function displayProducts(products) {
	var placeholder = document.querySelector('div.product');
	let rTemplate = document.getElementById("product-card-tmpl");
	for (const product of products) {
		let container = rTemplate.content.querySelector('product-card');
		container.setAttribute('product-id', product.id);
		container.setAttribute('category-id', product.pos_categ_id);
		container.setAttribute('name', product.name);
		container.setAttribute('price', product.lst_price);
		var clone = document.importNode(rTemplate.content, true);
		placeholder.appendChild(clone);
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
