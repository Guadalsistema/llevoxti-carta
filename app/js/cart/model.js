import { roundTo } from '../utils.js';
import { Signal } from '../utils.js';

class Cart {
    static change_qty = new Signal();
    static product_updated = new Signal();

	static toObjects() {
        let cartJSON = sessionStorage.getItem('order');
        if(cartJSON == null) { cartJSON = '[]'; }
        return JSON.parse(cartJSON);
	}

    static add(newProduct) {
		let cart = this.toObjects();
        let found = false;
        let i = 0;
        while(!found && i < cart.length) {
            if(newProduct.id == cart[i].id) {
                cart[i].product_uom_qty = parseInt(cart[i].product_uom_qty) + parseInt(newProduct.product_uom_qty);
                found = true;
            }
            i++;
        }

        if(!found) { cart.push(newProduct); }

        //if(cart[i].note != newProduct.note) {
            //cart[i].note = newProduct.note;
        //}
        sessionStorage.setItem('order', JSON.stringify(cart));
        this.change_qty.emit(this.length);
        this.product_updated.emit(newProduct);
    }

    static update(newProduct) {
		let cart = this.toObjects();

        let found = false;
        let i = 0;
        while(!found && i < cart.length) {
            if(newProduct.id == cart[i].id) {
                cart[i].product_uom_qty = parseInt(newProduct.product_uom_qty);
               // if(cart[i].note !== null){
                if(newProduct.note!==null){
                    //newProduct.note = cart[i].note;
                    cart[i].note = newProduct.note
                };

                found = true;
                break;
            }
            i++;
        }

        if(!found) { cart.push(newProduct); }

        if(cart[i].note != newProduct.note) {
          //  cart[i].note = newProduct.note;
        }
        sessionStorage.setItem('order', JSON.stringify(cart));
        this.change_qty.emit(this.length);
        this.product_updated.emit(newProduct);
    }

    static get length() {
		let cart = this.toObjects();
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
        let cartJSON = sessionStorage.getItem('order');
        if(cartJSON == null) { return 0; }
        let cart = JSON.parse(cartJSON);
        return roundTo(cart.reduce(
            (accumulated, arrayItem) => accumulated + (parseInt(arrayItem["product_uom_qty"]) * parseFloat(arrayItem["lst_price"])), 0
        ),2);
    }

	static clear() {
        sessionStorage.removeItem('order');
        this.change_qty.emit(this.length);
	}
}

export { Cart };
