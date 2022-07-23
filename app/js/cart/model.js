class Cart {
    static add(newProduct) {
        let cartJSON = sessionStorage.getItem('order');
        if(cartJSON == null) {
            cartJSON = '[]';
        }
        let cart = JSON.parse(cartJSON);

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
    }

    static update(newProduct) {
        let cartJSON = sessionStorage.getItem('order');
        if(cartJSON == null) {
            cartJSON = '[]';
        }
        let cart = JSON.parse(cartJSON);

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
    }

    static get length() {
        let cartJSON = sessionStorage.getItem('order');
        if(cartJSON == null) {
            return 0;
        }
        let cart = JSON.parse(cartJSON);
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
        let cartJSON = sessionStorage.getItem('order');
        if(cartJSON == null) {
            cartJSON = '[]';
        }
        return JSON.parse(cartJSON);
	}

	static clear() {
        sessionStorage.removeItem('order');
	}
}

export { Cart };
