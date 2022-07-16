import { config } from './config.js';
import { roundTo } from './utils.js';
import { ProductCategoryLi, ProductCard } from  './product-element.js';

function displayProducts(products) {
	let pTemplate = document.getElementById("product-row-tmpl");
	let placeholder = document.querySelector('div.product');
	for (const product of products) {
		let container = pTemplate.content.querySelector('.product__box');
		let name = pTemplate.content.querySelector('h2');
		let price = pTemplate.content.querySelector('h3');
		name.textContent = product.name;
		price.textContent = roundTo(product.lst_price,2) + '€';
		container.setAttribute('product-id', product.id);
		container.setAttribute('category-id', product.pos_categ_id);
		var clone = document.importNode(pTemplate.content, true);
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
	.then(products => displayProducts(products))
	.catch(error => console.error('Error:', error));
	var url_categories = config["url"] + "/menu/category";
	fetch(url_categories, {
	  method: 'GET',
	}).then(res => res.json())
	.then(categories => displayCategories(categories))
	.catch(error => console.error('Error:', error));
}

customElements.define('product-category', ProductCategoryLi, { extends: "li" });
customElements.define('product-card', ProductCard);

workProducts();
