import { Cart } from 'model.js'
import { Signal } from '../utils.js'


class CartButton extends HTMLButtonElement {
	constructor(obj) {
		self = super(obj);

        self.setAttribute("type", "button");

        self.textContent = "Ver pedido:"

		var qty = document.createElement('span');
        qty.textContent = Cart.length;
		self.appendChild(qty);
	}
}

export { CartButton };