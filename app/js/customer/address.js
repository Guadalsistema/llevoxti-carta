import { Cart } from '../cart/model.js';

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
function delivery(home_delivery) {
	Address.delivery.forEach((d_delivery) => {
		document.getElementById(d_delivery).hidden = home_delivery;
		document.getElementById(d_delivery).required = home_delivery;
	});
	//Calculamos los gastos de envio
	if(home_delivery==false){
	  	if(Address.products_delivery.product_uom_qty ==0){//Añado producto Entrega a carrito
			Address.products_delivery.product_uom_qty = 1
			Cart.add(Address.products_delivery);
			Address.products_delivery.product_uom_qty = 1;
			document.getElementById("delivery").innerText = 'Gastos de Envío: ' + Address.products_delivery.product_uom_qty * Address.products_delivery.lst_price + '€';
			//alert('Gastos de envio Añadido');
	  	}
	}else{
		if(Address.products_delivery.product_uom_qty == 1){ //Quito producto Entrega a carrito
			Address.products_delivery.product_uom_qty = -1
			Cart.add(Address.products_delivery);
			Address.products_delivery.product_uom_qty = 0;
			document.getElementById("delivery").innerText = 'Gastos de Envío: ' + Address.products_delivery.product_uom_qty * Address.products_delivery.lst_price + '€';
			//alert('Gastos de envio Quitados');
		}
	}
	document.getElementById("deli_tot").innerText = 'Total Pedido: ' + Cart.total_price + '€';
}

class Address {
	static mandatory = ["email", "name", "phone", "street", "zip", "city", "state_id"];
	static labels = ["email", "name", "phone", "street", "zip", "city", "state_id", "comment"];
	static delivery = ["street", "zip", "city", "state_id"];
	static products_delivery;
	static valid() {
		let array = Address.mandatory.map((label) => {
			let value = localStorage.getItem("lxt" + label);
			if (value === null) {
				return "";
			}
			return value;
		} );
		return array.every((v) => v !== "");
	}

	static toObject() {
		let object = {}
		let array = Address.mandatory.forEach((label) => {
			let value = localStorage.getItem("lxt" + label);
			if (value !== null) {
				object[label] = value;
			}
		} );
		return object;
	}
}

export { Address, darProvincia, delivery };
