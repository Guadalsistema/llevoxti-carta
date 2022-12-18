import { Cart } from './cart/model.js';
import { config } from './config.js';
import { ProductCategoryLi, ProductCard, ProductList } from  './products/ui.js';
import { waitForElm } from './utils.js';
import { InvalidRequestException } from './exception.js';

function displayRestaurantName() {
	let namePlaceholder = document.querySelector("h1.header__title");
	if(namePlaceholder === null) { return; }
	namePlaceholder.textContent = config["name"];
}

function displayProducts(products) {
	var placeholder = document.querySelector('product-list');
	products.sort((left, right) => { return left.category_id - right.category_id; });
	var stored = Cart.products();
	for (const product of products) {
		let pCard = document.createElement('product-card');
		var store = stored.filter( prod => prod["id"] == product["id"] );
		if(store.length && store[0]['product_uom_qty']) {
			product['product_uom_qty'] = store[0]['product_uom_qty'];
		} else {
			product['product_uom_qty'] = 0;
		}
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
		var url_order = config["url"] + "restaurant/order" + window.location.search;

		alert(url_order);
		var Isapp = url_order.indexOf("App");
        alert(Isapp);
		if(Isapp >= 0) {
			alert("Es un pedido App" + window.location.origin);
    		window.open(window.location.origin + "/contactus.html", "_self");
		} else {
			alert("No es un pedido App");
		}

		let products = Cart.products();
		let filtered = products.filter((prod) => prod.product_uom_qty > 0);
		fetch(url_order, {
			method: 'POST',
			cache: 'no-cache',
			body: JSON.stringify(filtered),
		})
		.then((response) => {
			if(response.ok) {
				return;
			}
			throw new InvalidRequestException(response.statusText);
		})
		.then(() => {
			let cartCounter = document.querySelector('.products-cart-button > span');
			var pList = document.querySelector('product-list');
			for (let pCard of pList.shadowRoot.querySelectorAll('product-card[product_uom_qty]:not([product_uom_qty="0"])')) {
				pCard.setAttribute("product_uom_qty", "0");
			}

			Cart.clear();
			cartCounter.textContent = Cart.number_of_products();
		});
	});
	/*let seeCartButton = document.querySelector("#products-see-cart-button");
	seeCartButton.addEventListener('click',() => {
		window.location.href = window.location.origin + "/cart.html" + window.location.search;
	});*/
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
	displayRestaurantName();
	fetchContent();
	setBehaviour();
}

customElements.define('product-category', ProductCategoryLi, { extends: "li" });
customElements.define('product-list', ProductList);
customElements.define('product-card', ProductCard);

main();
