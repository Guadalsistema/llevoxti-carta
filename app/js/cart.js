import { Cart } from './cart/model.js';
import { config } from './config.js';
import { Address } from './customer/address.js';
import { ProductCard, ProductList } from  './products/ui.js';

function loadProducts(products) {
	let placeholder = document.querySelector('product-list');
	for (const product of Cart.products()) {
		let pCard = document.createElement('product-card');
		pCard.fromObject(product);
		pCard.addEventListener('click', ev => {
			Cart.update(pCard.toObject());
		});
		placeholder.shadowRoot.appendChild(pCard);
	}
}

function main() {
	let orderButton = document.getElementById("order-button");
	orderButton.addEventListener('click', (ev) => {
		if(Cart.length == 0) {
			return
		}
		var url_order = config["url"] + "/restaurant/order" + window.location.search;
		fetch(url_order, {
			method: 'POST',
			cache: 'no-cache',
			body: JSON.stringify(Cart.products()),
		}).then(
			(response) => {
				Cart.clear();
				let pList = document.querySelector("product-list");
				pList.clear();
				window.location.href = window.location.origin + "/products.html" + window.location.search;
			}
		);
	});
	loadProducts();
}

customElements.define('product-list', ProductList);
customElements.define('product-card', ProductCard);

main();
