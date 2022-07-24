import { Cart } from './cart/model.js';
import { config } from './config.js';
import { ProductCategoryLi, ProductCard, ProductList } from  './products/ui.js';
import { waitForElm } from './utils.js';

function displayProducts(products) {
	var placeholder = document.querySelector('product-list');
	let cartCounter = document.querySelector('.products-cart-button > span');
	for (const product of products) {
		let pCard = document.createElement('product-card');
		product['product_uom_qty'] = 0;
		pCard.fromObject(product);
		pCard.style.display = 'none';
		placeholder.shadowRoot.appendChild(pCard);
	}

	placeholder.addEventListener('click', (ev) => {
		Cart.add(ev.target.toObject());
		ev.target.setAttribute('product_uom_qty', ev.target.minQty);
		cartCounter.textContent = Cart.number_of_products();
	});
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

	placeholder.addEventListener('click', (ev) => {
		const pList = document.querySelector('product-list');
		let hidde = pList.shadowRoot.querySelectorAll('product-card[style*="display: block"]');
		hidde.forEach((item) => { item.style.display = "none"; });
		let show = pList.shadowRoot.querySelectorAll('product-card[category-id*="' + ev.target.getAttribute("category-id") + '"]');
		show.forEach((item) => { item.style.display = "block"; });
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
		}).then(() => {
			Cart.clear();
			let cartCounter = document.querySelector('.products-cart-button > span');
			cartCounter.textContent = Cart.number_of_products();
		});
	});
	let seeCartButton = document.querySelector("#products-see-cart-button");
	seeCartButton.addEventListener('click',() => {
		window.location.replace(window.location.origin + "/cart.html" + window.location.search);
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
	.then(categories => displayCategories(categories))
	.then((categories)=>{
		const pList = document.querySelector('product-list');
		return waitForElm(pList.shadowRoot, 'product-card:nth-child(' + categories.length + ')')
	})
	.then(() => {
		const pList = document.querySelector('product-list');
		const cList = document.querySelector('ul');
		const firstCategory = cList.querySelector('li');
		let show = pList.shadowRoot.querySelectorAll('product-card[category-id*="' + firstCategory.getAttribute("category-id") + '"]');
		show.forEach((item) => { item.style.display = "block"; });
	});
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
