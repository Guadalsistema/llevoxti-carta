import { Cart } from './cart/model.js';
import { config } from './config.js';
import { ProductCategoryLi, ProductCard, ProductList } from  './products/ui.js';
import { waitForElm } from './utils.js';
import { InvalidRequestException } from './exception.js';

function displayProducts(products) {
	var placeholder = document.querySelector('product-list');
	products.sort((left, right) => { return left.category_id - right.category_id; });
	for (const product of products) {
		let pCard = document.createElement('product-card');
		product['product_uom_qty'] = 0;
		pCard.fromObject(product);
		let buttons = pCard.shadowRoot.querySelectorAll('.product__button');
		placeholder.shadowRoot.appendChild(pCard);
	}
}

function displayCategories(categories) {
	let pTemplate = document.getElementById("li-category-tmpl");
	let placeholder = document.querySelector('ul');
	categories.sort((left, right) => { return left.id - right.id; });
	for (const category of categories) {
		let container = pTemplate.content.querySelector('.menu__categories-item');
		container.textContent = category.name;
		container.setAttribute('category-id', category.id);
		var clone = document.importNode(pTemplate.content, true);
		placeholder.appendChild(clone);
	}

	placeholder.addEventListener('click', (ev) => {
		// TODO que no filtre que posicione
		const pList = document.querySelector('product-list');
		let show = pList.shadowRoot.querySelector('product-card[category-id*="' + ev.target.getAttribute("category-id") + '"]');
		if(show) {
			show.scrollIntoView();
		}
	});
	return Promise.resolve(categories)
}

function setBehaviour() {
	let cartButton = document.querySelector("#products-cart-button");
	cartButton.addEventListener('click',() => {
		var url_order = config["url"] + "/restaurant/order" + window.location.search;
		fetch(url_order, {
			method: 'POST',
			cache: 'no-cache',
			body: JSON.stringify(Cart.products()),
		})
		.then((response) => {
			if(response.ok) {
				return;
			}
			throw new InvalidRequestException(response.statusText);
		})
		.then(() => {
			Cart.clear();
			let cartCounter = document.querySelector('.products-cart-button > span');
			cartCounter.textContent = Cart.number_of_products();
		});
	});
	let seeCartButton = document.querySelector("#products-see-cart-button");
	seeCartButton.addEventListener('click',() => {
		window.location.href = window.location.origin + "/cart.html" + window.location.search;
	});
}

function fetchContent() {
	var url_products = config["url"] + "/menu";
	fetch(url_products, {
	  method: 'GET',
	}).then(res => res.json())
	.then(products => displayProducts(products));

	var url_categories = config["url"] + "/menu/category";
	const pList = document.querySelector('product-list').shadowRoot;
	fetch(url_categories, {
	  method: 'GET',
	}).then(res => res.json())
	.then(categories => displayCategories(categories));

	let cartCounter = document.querySelector('.products-cart-button > span');
	cartCounter.textContent = Cart.number_of_products();
}

function main() {
	fetchContent();
	setBehaviour();
}

customElements.define('product-category', ProductCategoryLi, { extends: "li" });
customElements.define('product-list', ProductList);
customElements.define('product-card', ProductCard);

main();
