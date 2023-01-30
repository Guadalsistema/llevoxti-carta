import { roundTo, Signal } from '../utils.js';

class Cart {
    static change_qty = new Signal();

	static toObjects() {
        let cartJSON = sessionStorage.getItem('order');
        if(cartJSON == null) {
            cartJSON = '[]';
        }
        return JSON.parse(cartJSON);
	}

    static add(newProduct) {
		let cart = this.toObjects();
        let found = false;
        for(let i = 0; !found && i < cart.length; i++) {
            if(newProduct.id == cart[i].id) {
                cart[i].product_uom_qty = parseInt(cart[i].product_uom_qty) + parseInt(newProduct.product_uom_qty);
                found = true;
            }
        }

        if(!found) {
            cart.push(newProduct);
        }

        sessionStorage.setItem('order', JSON.stringify(cart));
    
        this.change_qty.emit(this.length);
    }

    static update(newProduct) {
		let cart = this.toObjects();

        let found = false;
        for(let i = 0; !found && i < cart.length; i++) {
            if(newProduct.id == cart[i].id) {
                cart[i].product_uom_qty = parseInt(newProduct.product_uom_qty);
                found = true;
            }
        }

        if(!found) {
            cart.push(newProduct);
        }

        sessionStorage.setItem('order', JSON.stringify(cart));
        this.change_qty.emit(this.length);
    }

    static get length() {
		let cart = this.toObjects();
        // TODO remove menu products from menu
        return cart.length;
    }

	static number_of_products() {
        let cartJSON = sessionStorage.getItem('order');
        if(cartJSON == null) {
            return 0;
        }
        let cart = JSON.parse(cartJSON);
        return cart.reduce((accumulated, arrayItem) => accumulated + parseInt(arrayItem["product_uom_qty"]), 0);
	}

	static products() {
		return this.toObjects();
	}

    static get total_price() {
        let cartJSON = sessionStorage.getItem('order');        if(cartJSON == null) {
            return 0;
        }
        let cart = JSON.parse(cartJSON);
        return roundTo(cart.reduce((accumulated, arrayItem) => accumulated + (parseInt(arrayItem["product_uom_qty"]) * parseFloat(arrayItem["lst_price"])), 0),2);

    }

	static clear() {
        sessionStorage.removeItem('order');
        this.change_qty.emit(this.length);
	}
}

export { Cart };
