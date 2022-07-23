import { Cart } from './cart/model.js';
import { config } from './config.js';
import { ProductCategoryLi, ProductCard, ProductList } from  './products/ui.js';

function displayProducts(products) {
	var placeholder = document.querySelector('product-list');
	for (const product of products) {
		let pCard = document.createElement('product-card');
		product['product_uom_qty'] = 1;
		pCard.minQty = 1;
		pCard.fromObject(product);
		pCard.addEventListener('click', ev => {
			Cart.add(pCard.toObject());
			pCard.setAttribute('product_uom_qty', pCard.minQty);
		});
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

function setBehaviour() {
	let cartButton = document.querySelector(".products-cart-button");
	cartButton.addEventListener('click',() => {
		var url_order = config["url"] + "/restaurant/order" + window.location.search;
		fetch(url_order, {
			method: 'POST',
			cache: 'no-cache',
			body: JSON.stringify(Cart.products()),
		}).then(() => { Cart.clear(); });
	});
}

function fetchContent() {
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

function main() {
	fetchContent();
	setBehaviour();
}

customElements.define('product-category', ProductCategoryLi, { extends: "li" });
customElements.define('product-list', ProductList);
customElements.define('product-card', ProductCard);

main();
