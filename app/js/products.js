import { Address, darProvincia, delivery } from './customer/address.js';
import { Cart } from './cart/model.js';
import { config } from './config.js';
import { ProductCard, ProductList } from  './products/ui.js';
import { PosCategoryUl, PosCategoryLi } from  './categories/ui.js';
import { InvalidRequestException } from './exception.js';
import { CartButton } from './cart/ui.js';

customElements.define('cart-button', CartButton, { extends: "button" });
customElements.define('category-card', PosCategoryLi, { extends: "li" });
customElements.define('category-list', PosCategoryUl, { extends: "ul" });
customElements.define('product-list', ProductList);
customElements.define('product-card', ProductCard);

function displayRestaurantName() {
	let namePlaceholder = document.querySelector("h1.header__title");
	if(namePlaceholder === null) { return; }
	namePlaceholder.textContent = config["name"];
}

function displayProducts(products) {
	var placeholder = document.getElementById('full-product-list');
	products.sort((left, right) => { return parseInt(left.pos_categ_id) - parseInt(right.pos_categ_id); });
	var stored = Cart.products();
	var products_show = products.filter(prod=> prod["lst_price"] > 0);
	products_show = add_menu_products(products_show);
	products_show = products.filter(prod=> prod["menu"] == 'false');//Eliminamos los articulos que son menu
	Address.products_delivery = products.filter(prod=> !prod["name"].search("Entrega"));//Buscamos si tiene productos de envio a domicilio
	if (Address.products_delivery.length>0){
		var prod_delivery = new Object();
		Address.products_delivery.forEach(dely=>{
			prod_delivery = dely;
			prod_delivery.product_uom_qty = bus_qty_cart(dely.id);
		});
	    Address.products_delivery = prod_delivery
	}
	for (const product of products_show) {
		let pCard = document.createElement('product-card');
		product['product_uom_qty'] = bus_qty_cart(product["id"]);
		pCard.fromObject(product);
		pCard.setAttribute('display-textarea', 'false');
		placeholder.shadowRoot.appendChild(pCard);
	}
}

function add_menu_products(prod_add){
	prod_add.forEach(p=>{ //Recorremos productos para añadir si son de menu
		var categoria_ismenu = p['pos_categ_id']
		let data_cat_prod = document.querySelector('li[pos-category-id="' + categoria_ismenu + '"]'); // Seleccionamos la categoria del producto
		if (data_cat_prod!== null) {
			let ismenu = data_cat_prod.getAttribute('menu')//localizamos si la categoria es menu
			if (ismenu == "true"){ //añadimos al objeto el elmento menu
				p.menu = "true"
			}
			else{
				p.menu = "false"
			}
		} else {
			p.menu = "true" // Si es null, es porque es una subcategoria y esta borrada del cuadro de categorias por lo tanto es subcategoria true
		}	
	})
	return prod_add
}

function bus_qty_cart(id_product_bus) {
	let prod_store = Cart.products().filter( prod => prod["id"] == id_product_bus )
	let product_store_qty
	if(prod_store.length && prod_store[0]['product_uom_qty']) {
		product_store_qty  = prod_store[0]['product_uom_qty'];
	 }
	 else{
		product_store_qty = 0
	 }
	return product_store_qty;
}

function displaySubcategories(categories, categories_parent, products_cat, ismenu_pos_id, menu_display_name){
	let dialog_menu_fijo = document.getElementById("menufijo");
	document.getElementById('name_menu').innerHTML = menu_display_name;
	let products_ismenu = products_cat.filter(pro => pro.pos_categ_id == ismenu_pos_id); //Filtro los productos del menu
	let categories_menu = categories.filter( p => p.id==ismenu_pos_id) //Filtro del menu
	let categories_submenu = categories_parent.filter(p => p.parent_id==ismenu_pos_id) //Filtro del submenu
	// VISUALIZAMOS PRODUCTOS DEL MENU QUE LLEVA PRECIO
	var menu_cab  = document.getElementById('menu_cab');
	let fileCss = 'css/product-card-menu.css'; // CREAMOS LA VARIABLE DE css que se ejecuta ojo tiene que existir el archivo
	let lista_productos_modal=new ProductList(fileCss);
	products_ismenu.forEach(p => {
			p.show_image = false;
			p.product_uom_qty = bus_qty_cart(p.id);
	});
	
	var tipo_menu = "M"
	lista_productos_modal.loadObjects(products_ismenu,fileCss, tipo_menu);
	menu_cab.appendChild(lista_productos_modal);	
				// BUCLE DE SUBCATEGORIAS
	var sub_menu  = document.getElementById('menu_submenu');
	var sub_menu_fragment = document.createDocumentFragment()
	categories_submenu.forEach(item_subm =>{
		const dialog_menu_fijo = document.getElementById("sub_menu");
		const div_submenu = document.createElement('div')
		if(item_subm.menu == true){
			tipo_menu = "F"
		};
		if(item_subm.seleccionable  == true){
			tipo_menu = "S"
		};
		div_submenu.textContent = "-" + item_subm.name;//+ " Tipo: " + tipo_menu;
		div_submenu.setAttribute('class', 'menu_submenu');
		sub_menu_fragment.appendChild(div_submenu)
		let products_submenu = products_cat.filter(pro => pro.pos_categ_id == item_subm.id); //Filtro los productos del submenu
		products_submenu.forEach(p => {
			p.show_image = false;
			p.product_uom_qty = bus_qty_cart(p.id);
		});
		let lista_productos_modal=new ProductList(fileCss);
		let listProductMenu = document.createElement('div');
		listProductMenu.setAttribute('id', 'listProductMenu');
		listProductMenu.setAttribute('name', item_subm.id);
		listProductMenu.setAttribute('title', 'Menu Fijo: ' + tipo_menu + ' Nombre Menú: ' + item_subm.name);
		lista_productos_modal.loadObjects(products_submenu, fileCss, tipo_menu);
		listProductMenu.appendChild(lista_productos_modal);
		sub_menu_fragment.appendChild(listProductMenu);
	});	
	sub_menu.appendChild(sub_menu_fragment);	
	dialog_menu_fijo.showModal();
	//Quitamos los signos - de los productos de menu fijo
	let querySelec_menu = document.querySelectorAll("#listProductMenu"); // selecion de productos en dialog submenu
	querySelec_menu.forEach(p => {
		let pos = p.title.search('Fijo:');
		let tipo_submenu = p.title.slice(pos+6,pos+7);
		let contSelectProducts = p.childNodes[0].shadowRoot.querySelectorAll('product-card');
		contSelectProducts.forEach(botton_menos => {
			if(tipo_submenu == "F"){
				let minus = botton_menos.shadowRoot.querySelector('.minus')
				minus.style.display = 'none';
			}
		});	
	});
};

function displayCategories(categories) {

	let placeholder = document.querySelector('ul.main-menu');
	// drop category with parent_id
	categories.sort((left, right) => { return left.sequence - right.sequence; });
	let categories_parent = categories.filter( x => x.parent_id);
	categories = categories.filter( x => !x.parent_id);
	placeholder.loadObjects(categories);
	placeholder.addEventListener('click', (ev) => {
		if(ev.target.parentElement.getAttribute('menu')){  //Si la categoria es menú abrimos dialog
			var url_products = config["url"] + "/menu";
			let ismenu_pos_id = ev.target.parentElement.getAttribute('pos-category-id');
            let menu_display_name = ev.target.parentElement.getAttribute('display-name');
			fetch(url_products)
			.then(res => res.json())
			.then(products_cat => {displaySubcategories(categories, categories_parent, products_cat, ismenu_pos_id, menu_display_name);});
		}
		const pList = document.getElementById('full-product-list');
		var id_cat = ev.target.parentNode.getAttribute("pos-category-id");
		if (id_cat == null){
			id_cat = ev.target.getAttribute("pos-category-id")
		}
		
		let show = pList.shadowRoot.querySelector('product-card[category-id="' + id_cat + '"]');
		
		if(show !== null) {
			show.scrollIntoView();
		}
	});
	return Promise.resolve(categories)
}

function is_app_order() {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get(target, prop, _) { return target.get(prop); },
		has(target, key) {
			if (key[0] === '_') { return false; }
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
		if(response.ok) { return; }
		throw new InvalidRequestException(response.statusText);
	})
	.then(() => {
		Cart.clear();
		window.location.reload();
	});
}

function show_address_dialog() {
	Address.labels.forEach((label) => {
		let value = localStorage.getItem("lxt" + label);
		if (value !== null) {
			document.getElementById(label).value = value;
		}
	});
	var click_delivery = document.getElementById('recogida');
	delivery(click_delivery.checked);
	document.querySelector('#products-cart-button').style.display = "none";
	document.querySelector('#show-cart-button').style.display = "none";
	document.getElementById("address_dialog").showModal();
}

function check_order(){
	if(Cart.length > 0) {
		if (is_app_order()) {
			show_address_dialog();
		} else {
			send_order();
		}
	}
}

function setBehaviour() {
	// Show Cart dialog
	let showCartButton = document.getElementById("show-cart-button");
	let cartDialog = document.getElementById("cart-dialog");

	cartDialog.addEventListener('close', () => document.querySelector('#products-cart-button').style.display = "flex");
	cartDialog.addEventListener('close', () => document.querySelector('#show-cart-button').style.display = "flex");
	
	showCartButton.addEventListener('click', () => {
		if(Cart.length > 0) {
			let fileCss = 'css/product-card-cart.css'; // CREAMOS LA VARIABLE DE css que se ejecuta ojo tiene que existir el archivo
			let cartProductList =new ProductList(fileCss);
			cartProductList = document.getElementById("cart-product-list");
			cartProductList.clear();
			let products = Cart.toObjects();
			products = add_menu_products(products); // añadimos si son menu o submenu
			cartProductList.loadObjects(products, fileCss);
			const lambda = (x) => parseInt(x.getAttribute('product_uom_qty'));
			cartProductList.displayProductCards(lambda)
			document.querySelector('#products-cart-button').style.display = "none";
			document.querySelector('#show-cart-button').style.display = "none";
			document.getElementById("t_pedido").value = Cart.total_price;
			cartDialog.showModal();
				//Quitamos los signos - de los productos de menu fijo
				let prod_cart = document.getElementById('cart-product-list') 	
				prod_cart = prod_cart.shadowRoot.querySelectorAll('product-card');
				for(let i=0;i < prod_cart.length;i++){
					var prod_store = prod_cart[i].getAttribute('product-id');
            		var prod_menu = products.filter(prod=>prod['id']==prod_store);
					if (prod_menu[0]['menu'] == "true"){
						let minus = prod_cart[i].shadowRoot.querySelector('.minus')
						minus.style.display = 'none';
						let sum = prod_cart[i].shadowRoot.querySelector('.sum')
						sum.style.display = 'none';
					}
				}	
		}
	});
    // Recogida o envio de comandas
	var click_delivery = document.getElementById('recogida');
	click_delivery.onclick= function(){
		 delivery(click_delivery.checked)
	};
	// Codigos postales
	const $click_zip = document.getElementById('zip')
		const option = document.createElement('option');
		$click_zip.appendChild(option);
		if($click_zip.length >= 0){
			let zip_store = config["zip"].split(',')
			zip_store.forEach(z=>{
				const option = document.createElement('option');
				option.value = z;
				option.text = z;
				$click_zip.appendChild(option);
			})
		}
	document.getElementById('zip').addEventListener('change', event => {
		if (parseInt(event.target.value) > 0) { 
			document.getElementById('state_id').value = darProvincia(event.target.value);
			document.getElementById("dialog-address-send").hidden = ""
			delivery();
		}else{
			document.getElementById("dialog-address-send").hidden = "true"
		}
	  });
	let dialog_form_cart = document.getElementById("cart-dialog"); // Volver del carrito
	let dialog_cancel_cart = document.getElementById("dialog-cart-cancel");
	dialog_cancel_cart.addEventListener('click', (ev) => {
		dialog_form_cart.close()
	})
	let dialog_send_cart = document.getElementById("dialog-cart-send");//Enviar desde carrito
	dialog_send_cart.addEventListener('click', (ev) => {
		check_order();
		dialog_form_cart.close()
	})
	
	let dialog_form = document.getElementById("address_dialog");
	dialog_form.addEventListener('close', () => document.querySelector('#products-cart-button').style.display = "flex");
	dialog_form.addEventListener('close', () => document.querySelector('#show-cart-button').style.display = "flex");

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
	let dialog_cancel_menu = document.getElementById("dialog-cancel-menu");
	dialog_cancel_menu.addEventListener('click', (ev) => {
		ev.preventDefault();
	    menufijo.close();
		document.getElementById("menu_cab").innerHTML = "";
		document.getElementById("menu_submenu").innerHTML = "";

	});
	let cartButton = document.querySelector("#products-cart-button");
	cartButton.addEventListener('click',() => {
		check_order();
	});
}

function fetchContent() {
	var products;
	var products_categoria;
	var url_products = config["url"] + "/menu";
	var url_categories = config["url"] + "/menu/category";
	var local_products;
	fetch(url_products)
	.then(res => res.json())
	.then(products => {displayProducts(products);});
	
	fetch(url_categories)
	.then(res => res.json())
	.then(categories => displayCategories(categories));

	let cartCounter = document.querySelector('.products-cart-button > span');
	cartCounter.textContent = Cart.number_of_products();
	document.getElementById("t_pedido").value = Cart.total_price;
}

function main() {
	displayRestaurantName();
	fetchContent();
	setBehaviour();
	Cart.product_updated.connect(document, (el) => {
		const pList = document.getElementById('full-product-list');
		let qty = el.product_uom_qty;
		delete el.product_uom_qty;
		let arr = pList.findAll(el);
		arr.forEach((ell) => ell.setAttribute('product_uom_qty', qty));
	});
}

main();
