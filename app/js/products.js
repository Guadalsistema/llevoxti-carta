import { Address } from './customer/address.js';
import { Cart } from './cart/model.js';
import { config } from './config.js';
import { ProductCategoryLi, ProductCard, ProductList } from  './products/ui.js';
import { InvalidRequestException } from './exception.js';

customElements.define('product-category', ProductCategoryLi, { extends: "li" });
customElements.define('product-list', ProductList);
customElements.define('product-card', ProductCard);

function displayRestaurantName() {
	let namePlaceholder = document.querySelector("h1.header__title");
	if(namePlaceholder === null) { return; }
	namePlaceholder.textContent = config["name"];
}

function displayProducts(products) {
	var placeholder = document.getElementById('full-product-list');
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
		const pList = document.getElementById('full-product-list');
		let show = pList.shadowRoot.querySelector('product-card[category-id*="' + ev.target.getAttribute("category-id") + '"]');
		if(show) {
			show.scrollIntoView();
		}
	});
	return Promise.resolve(categories)
}

function darProvincia(cpostal){
	let cp_provincias={
		1:"Álava", 2:"Albacete", 3:"Alicante", 4:"Almer\u00EDa", 5:"\u00C1vila",
		6:"Badajoz", 7:"Baleares", 8:"Barcelona", 9:"Burgos", 10:"C\u00E1ceres",
		11:"C\u00E1diz", 12:"Castell\u00F3n", 13:"Ciudad Real", 14:"C\u00F3rdoba", 15:"Coruña",
		16:"Cuenca", 17:"Gerona", 18:"Granada", 19:"Guadalajara", 20:"Guip\u00FAzcoa",
		21:"Huelva", 22:"Huesca", 23:"Ja\u00E9n", 24:"Le\u00F3n", 25:"L\u00E9rida",
		26:"LaRioja", 27:"Lugo", 28:"Madrid", 29:"Málaga", 30:"Murcia",
		31:"Navarra", 32:"Orense", 33:"Asturias", 34:"Palencia", 35:"LasPalmas",
		36:"Pontevedra", 37:"Salamanca", 38:"Santa Cruz de Tenerife", 39:"Cantabria", 40:"Segovia",
		41:"Sevilla", 42:"Soria", 43:"Tarragona", 44:"Teruel", 45:"Toledo",
		46:"Valencia", 47:"Valladolid", 48:"Vizcaya", 49:"Zamora", 50:"Zaragoza",
		51:"Ceuta", 52:"Melilla"
	};
	if(cpostal.length == 5 && cpostal <= 52999 && cpostal >= 1000) {
		return cp_provincias[parseInt(cpostal.substring(0, 2))];
	}
	else {
		return"---";
	}
}

function is_app_order() {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get(target, prop, _) { return target.get(prop); },
		has(target, key) {
			if (key[0] === '_') {
				return false;
			}
			return Boolean([...target.keys()].find((v) => v === key));
		}
	});
	return 'table' in params && params.table == "app";
}

function send_order() {
	var url_order = config["url"] + "/restaurant/order" + window.location.search;

	let products = Cart.products();
	let filtered = products.filter((prod) => prod.product_uom_qty > 0);
	let order = {
		order: filtered,
	};

	if (is_app_order()) {
		if (!Address.valid()) {
			console.log("Invalid address");
			return;
		}
		order["address"] = Address.toObject();
	}

	fetch(url_order, {
		method: 'POST',
		cache: 'no-cache',
		body: JSON.stringify(order),
	})
	.then((response) => {
		if(response.ok) {
			return;
		}
		throw new InvalidRequestException(response.statusText);
	})
	.then(() => {
		let cartCounter = document.querySelector('.products-cart-button > span');
		var pList = document.getElementById('full-product-list');
		for (let pCard of pList.shadowRoot.querySelectorAll('product-card[product_uom_qty]:not([product_uom_qty="0"])')) {
			pCard.setAttribute("product_uom_qty", "0");
		}

		Cart.clear();
		cartCounter.textContent = Cart.number_of_products();
	});
}

function show_address_dialog() {
	Address.labels.forEach((label) => {
		let value = localStorage.getItem("lxt" + label);
		if (value !== null) {
			document.getElementById(label).value = value;
		}
	});
	document.getElementById("address_dialog").showModal();
}

function setBehaviour() {
	// Show Cart dialog
	let showCartButton = document.getElementById("show-cart-button");
	showCartButton.addEventListener('click', () => {
		let cartDialog = document.getElementById("cart-dialog");
		let cartProductList = document.getElementById("cart-product-list");
		cartProductList.clear();
		let products = Cart.toObjects();
		cartProductList.loadObjects(products);
		const lambda = (x) => parseInt(x.getAttribute('product_uom_qty'));
		cartProductList.displayProductCards(lambda)
		cartDialog.showModal();
	});

	var inputCP = document.getElementById('zip');
	inputCP.onkeyup = function(){
		document.getElementById('state_id').value = darProvincia(inputCP.value);
	}
	let dialog_form = document.getElementById("address_dialog");
	let dialog_send = document.getElementById("dialog-address-send");
	dialog_send.addEventListener('click', (ev) => {
		ev.preventDefault();
		Address.labels.forEach((label) => {
			let value = document.getElementById(label).value;
			if (value !== "") {
				localStorage.setItem("lxt" + label, value);
			}
		});
		send_order();
		dialog_form.close();
	});
	let dialog_cancel = document.getElementById("dialog-address-cancel");
	dialog_cancel.addEventListener('click', (ev) => {
		ev.preventDefault();
		Address.labels.forEach((label) => {
			let value = document.getElementById(label).value;
			if (value !== "") {
				localStorage.setItem("lxt" + label, value);
			}
		});
		dialog_form.close();
	});
	let cartButton = document.querySelector("#products-cart-button");
	cartButton.addEventListener('click',() => {
		if(Cart.length > 0) {
			if (is_app_order()) {
				show_address_dialog();
			} else {
				send_order();
			}
		}
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

	let cartCounter = document.querySelector('.products-cart-button > span');
	cartCounter.textContent = Cart.number_of_products();
}

function main() {
	displayRestaurantName();
	fetchContent();
	setBehaviour();
}

main();
