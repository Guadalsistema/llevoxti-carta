import { config } from '../config.js'
import { roundTo } from '../utils.js';
import { ModelHTMLElement } from '../model.js';
import { Cart } from '../cart/model.js'
import { isEmpty } from '../utils.js';

/**
 * Product card
 * Display the foto, qty and name of a product
 * 
 * @param {*} func Recive a function to hide products if true
 */
class ProductCard extends ModelHTMLElement {
	__minQty = 0;

	get minQty() {
		return this.__minQty;
	}

	set minQty(val) {
		this.__minQty = val;
		let p = this.shadowRoot.querySelector('p');
		if (parseInt(p) < parseInt(val)) {
			this.setAttribute('product_uom_qty', val);
		}
	}

	get optionalFields() {
		return {
			'show_image': 'show-image',
			'display_textarea': 'display-textarea'
		};
	}

	get fields() {
		return {
			'id': 'product-id',
			'pos_categ_id': 'category-id',
			'name': 'name',
			'lst_price': 'price',
			'product_uom_qty': 'product_uom_qty',
			'note': 'note'
		};
	}

	static get observedAttributes() {
		return ['name', 'price', "product_uom_qty", 'product-id', 'show-image', 'note', 'display-textarea'];
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if(attrName == "name") {
			let h2 = this.shadowRoot.querySelector('h2');
			h2.textContent = newVal;
			let img = this.shadowRoot.querySelector('img');
			img.setAttribute('alt', newVal);
			return;
		}
		if(attrName == "product-id") {
			let img = this.shadowRoot.querySelector('img');
			img.setAttribute('src', config['url'] + '/web/image/product.product/' + newVal + '/image_128');
			img.classList.add("product__imagen");
			return;
		}
		if(attrName == "price") {
			let h3 = this.shadowRoot.querySelector('h3');
			h3.textContent = roundTo(newVal,2) + '€';
     		if(newVal<= 0){
				h3.style.display= 'none';
			}
			return;
		}
		if(attrName == "show-image") {
			let img = this.shadowRoot.querySelector('img');
			if(newVal=='false'){
				img.style.display = 'none';
			} else {
				img.style.display = 'block';
			}
			return;
		}

		if(attrName == "note") {
			let nota = this.shadowRoot.querySelector('textarea');
			nota.value = newVal;
			return;
		}

		if(attrName == "display-textarea") {
			let textarea = this.shadowRoot.querySelector('textarea');
			if(newVal=='false'){
				textarea.style.display = 'none';
			} else {
				textarea.style.display = 'block';
			}
			return;
		}

		if(attrName == "product_uom_qty") {
			if(parseInt(newVal) < this.minQty) {
				this.setAttribute("product_uom_qty", this.minQty);
				return;
			}
			let p = this.shadowRoot.querySelector('p');
			if(isEmpty(oldVal)) { oldVal = 0; }
			if (parseInt(oldVal) != parseInt(newVal)) {
				Cart.update(this.toObject());
			}
			const cartCounter = document.querySelector('.products-cart-button > span');
			if(cartCounter) {
				cartCounter.textContent = Cart.number_of_products();
			}
			p.textContent = newVal;
			let minus = this.shadowRoot.querySelector('.minus');
			let qty = this.shadowRoot.querySelector('.product__number');
			let cat_id_pro = this.getAttribute("category-id");
			let tipo_cat_pro = document.getElementsByName(cat_id_pro);
			let tipo_submenu =""
			if (tipo_cat_pro.length > 0){
				tipo_submenu = this.tipo_submenu(tipo_cat_pro[0].title)
			}
			if(parseInt(newVal) <= 0) {
				minus.style.display = 'none';
				qty.style.display = 'none';
			} else {
				if (tipo_submenu!="F"){
					minus.style.display = 'block';
			}
			qty.style.display = 'block';
			}
			return;
		}
	}

	addQty(val) {
		let qty = parseInt(this.getAttribute('product_uom_qty'));
		this.setAttribute('product_uom_qty', qty + val);
		document.getElementById("t_pedido").value = Cart.total_price;
	}

	count_qty_submenu(submenu){
		let submenu_pro_qty = document.getElementsByName(submenu); // localizamos el submenu
		if(submenu_pro_qty.length > 0){
			let tipo_submenu = this.tipo_submenu(submenu_pro_qty[0].title); // Comprobamos el tipo de menu que es
			let cont_uds_submenu = 0;
			let product_menu_cab_qty = 0;
			if(tipo_submenu == "S"){ // Si el submenu es Seleccionable
				//Contador submenu unidades
					let products_submenu_qty = submenu_pro_qty[0].childNodes[0].shadowRoot.querySelectorAll('product-card') //Selecionamos los productos de submenu
					products_submenu_qty.forEach (pro_qtyt => {
					cont_uds_submenu = cont_uds_submenu +  parseInt(pro_qtyt.getAttribute('product_uom_qty')) // Contador de unidades de submenu
				})
				//Localizamos menu Cabecera
					let menu_cab = document.getElementById('menu_cab');// localizamos div menu cabecera
					let product_menu_cab = menu_cab.childNodes[0].shadowRoot.querySelector('product-card') // Localizamos producto cabecera
					product_menu_cab_qty = parseInt(product_menu_cab.getAttribute('product_uom_qty')) // Localizamos cantidad producto cabecera
		};
		let products_submenu_qty = submenu_pro_qty[0].childNodes[0].shadowRoot.querySelectorAll('product-card') //Selecionamos los productos de submenu
		//alert( cont_uds_submenu + " " + product_menu_cab_qty +  " nos hemos pasado");
		if(cont_uds_submenu == product_menu_cab_qty){ // Si hemos seleccionado el maximo de productos quitamo el boton +
				products_submenu_qty.forEach(botton_mas => {
				let minus = botton_mas.shadowRoot.querySelector('.sum')
				minus.style.display = 'none';
			})
		} else { //Si no visualizamos el botton +
				products_submenu_qty.forEach(botton_mas => {
				let minus = botton_mas.shadowRoot.querySelector('.sum')
				minus.style.display = 'block';	
				})
			}
			if(cont_uds_submenu > product_menu_cab_qty){ //Si los pruductos de submenu superan a los del producto cabecera 
				//let qty = parseInt(this.getAttribute('product_uom_qty'));
				//this.setAttribute('product_uom_qty', qty -1);
				let inx = 0
				products_submenu_qty.forEach (pro_qty => { // recorremos los artículos y al primero que tenga >0 le quitamos 1 unidad
					if (parseInt(pro_qty.getAttribute('product_uom_qty')) > 0 && inx == 0){
						let pro_sub_qty = parseInt(pro_qty.getAttribute('product_uom_qty'))
						pro_qty.setAttribute('product_uom_qty', pro_sub_qty -1)
						inx = 1
					}
				})

			}
		return
	}
	}

    tipo_submenu(submenu){
		 let pos = submenu.search('Fijo:');
		 let tipo_submenu = submenu.slice(pos+6,pos+7);
        return(tipo_submenu);
	}

	tipo_submenu_product_menu(id_cat){ //Localizamos si es el producto cabecera para modificar los menus fijos
        var data_cat_prod_qty = document.querySelector('li[pos-category-id="' + id_cat + '"]'); // Seleccionamos la categoria del producto
		var tipo_submenu ;
		var product_menu = "";
		if(data_cat_prod_qty !== null){ 
			tipo_submenu = data_cat_prod_qty.getAttribute('menu'); // Selecionamos si la categoria pertenece a un menu
			if (tipo_submenu = true){
				tipo_submenu = "F"
			} 
			else{
				tipo_submenu = "S"
			}
			product_menu = data_cat_prod_qty.getAttribute('menu-product-id'); // Selecionamos el producto relacionadon con al categoria
		}
		return tipo_submenu, product_menu 
	}

	display_qty_producs_submenu(sum_minus) {
		let newCant = this.getAttribute('product_uom_qty'); // unidades
		let cat_prod_qty = this.getAttribute("category-id"); // categoria del producto seleccionado
		let id_prod_qty = this.getAttribute("product-id"); // id del producto seleccionado
		let ismenu_cat_prod_qty , prod_cat_prod_qty = this.tipo_submenu_product_menu(cat_prod_qty);
		if (id_prod_qty == prod_cat_prod_qty){  // Si el producto cabecera
			let querySelec_menu = document.querySelectorAll("#listProductMenu"); // selecion de productos en dialog submenu
			querySelec_menu.forEach(p => {
			let tipo_submenu = this.tipo_submenu(p.title)
					if(tipo_submenu == "F"){ // Ponemos todos los productos Fijos igual que articulo menu cabecera
						p.childNodes[0].setProductsQty(newCant); //importante
					};
					if(tipo_submenu == "S"){
						let  cat_prod_submenu_qt = p.attributes.name.value // Categoría Sumenu
						let by_count_submenu = this.count_qty_submenu(cat_prod_submenu_qt);//Contador de unidades de produto del submenu
						//alert("aqui")
					};

			});

		}	else { 
			// Si no es producto cabecera
			let cat_prod_qty = this.getAttribute("category-id"); // categoria del producto seleccionado
			let by_count_submenu = this.count_qty_submenu(cat_prod_qty);//Contador de unidades de produto del submenu
		}
		return;
	}

	constructor(fileCss, tipo_menu, ...args){
		super(...args);
		if (typeof fileCss == 'undefined'){
			fileCss = 'css/product-card.css'
		};
		let shadow = this.attachShadow({mode: 'open'});
		let productbox = document.createElement('div');
		productbox.setAttribute('id', 'product__box');
		productbox.setAttribute('class', 'product__box');

			let productName = document.createElement('div');
			productName.setAttribute('class', 'product__name');
			productbox.appendChild(productName);
			let hdos = document.createElement('h2');
			hdos.textContent = this.getAttribute('name');
			productName.appendChild(hdos);

			let image = document.createElement('img');
			productbox.appendChild(image);

			this.productAmount = document.createElement('div');
			this.productAmount.setAttribute('class', 'product__amount');
			productbox.appendChild(this.productAmount);
				let productButtonAdd = document.createElement('div');
				productButtonAdd.setAttribute('class', 'product__button sum');
				productButtonAdd.appendChild(document.createElement('div'));
				productButtonAdd.appendChild(document.createElement('div'));
				productButtonAdd.addEventListener('click', (ev) => {
					ev.stopPropagation();
					this.addQty(1);
					this.display_qty_producs_submenu(1);
				})
				if(tipo_menu == "F"){
					productButtonAdd.hidden = "True"; 
				}
				this.productAmount.appendChild(productButtonAdd);
				let productNumber = document.createElement('div');
				productNumber.setAttribute('class', 'product__number');
				this.productAmount.appendChild(productNumber);
					let p = document.createElement('p');
					p.textContent = 1;
					productNumber.appendChild(p);
				let productButtonMinus = document.createElement('div');
				productButtonMinus.setAttribute('class', 'product__button minus');
				productButtonMinus.appendChild(document.createElement('div'));
				productButtonMinus.addEventListener('click', (ev) => {
					ev.stopPropagation();
					this.addQty(-1)
					this.display_qty_producs_submenu(-1);
				});
				this.productAmount.appendChild(productButtonMinus);
				let productPrize = document.createElement('div');
			    productPrize.setAttribute('id', 'product__prize');
			    productPrize.setAttribute('class', 'product__prize');
				productbox.appendChild(productPrize);
				let htres = document.createElement('h3');
				htres.textContent = roundTo(this.getAttribute('price'), 2) + '€';
				productPrize.appendChild(htres);

			let productNoteDiv = document.createElement('div');
			productNoteDiv.setAttribute('class', 'product__note');
			productNoteDiv.setAttribute('id', 'product__note');

				let textArea = document.createElement("textarea");
				textArea.name = "OrderLineNote";
				textArea.id = "note";
				textArea.setAttribute('placeholder', 'Deja aquí tu comentario...');
				textArea.rows = "4";
				textArea.cols = 100;
				textArea.addEventListener('input', (ev) => {
					this.setAttribute('note', ev.target.value);
					Cart.update(this.toObject());
				});
				productNoteDiv.appendChild(textArea);

			productbox.appendChild(productNoteDiv);

		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', fileCss);

		shadow.appendChild(linkElem);
		shadow.appendChild(productbox);
	}
}


class ProductList extends ModelHTMLElement {

	static get observedAttributes() {
		return ['display_products_with_0_qty'];
	}

	// todo name list setter
	constructor(fileCss){
		super();
		if (typeof fileCss == 'undefined'){
			fileCss = 'css/product-card.css'
		};
		let shadow = this.attachShadow({mode: 'open'});

		let container = document.createElement('div');
		container.setAttribute('class', 'product');
		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', fileCss);
		shadow.appendChild(linkElem);
		shadow.appendChild(container);
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if(attrName == "display_products_with_0_qty") {
			let h2 = this.shadowRoot.querySelector('h2');
			h2.textContent = newVal;
			let img = this.shadowRoot.querySelector('img');
			img.setAttribute('alt', newVal);
			return;
		}
	}

	clear() {
		for (let pCard of this.shadowRoot.querySelectorAll('product-card')) {
			pCard.remove();
		}
	}

	/**
	 * Hide product function
	 * 
	 * @param {*} func Recive a function to hide products if true
	 */
	displayProductCards(func=undefined) {
		if(func === undefined) {
			func = () => true;
		}
		let cards = this.shadowRoot.querySelectorAll('product-card');
		let index = 0;
		for(var card of cards) {
			let display = "none";
			if(func(card, index)) {
				display = "block";
			}
			card.style.display = display;
			index++;
		}
	}

	/**
	 * @param {array} products
	 */
	loadObjects(products, fileCss, tipo_menu) {
		for (const product of products) {
			let pCard = new ProductCard(fileCss, tipo_menu);
			pCard.fromObject(product);
			this.shadowRoot.appendChild(pCard);
		}
	}

	/**
	 * @param {object} use the properties of object for filter, if key doesn't exist discard it
	 * 
	 * @return Array of elements
	 */
	findAll(obj) {
		let arr = Array.from(this.shadowRoot.querySelectorAll("product-card"));
		return arr.filter((el) => {
			for (const [key, value] of Object.entries(obj)) {
				let inKey = el.fields[key];
				if (!el.hasAttribute(inKey) || el.getAttribute(inKey) != value) {
					return false;
				}
			}
			return true;
		});
	}

	/**
	 * Set the products-card to Qty
	 * 
	 * @param {int} qty
	 */
	setProductsQty(qty) {
		let cards = this.shadowRoot.querySelectorAll('product-card');
		cards.forEach((card) => card.setAttribute("product_uom_qty", qty));
	}
}

export { ProductCard, ProductList };
