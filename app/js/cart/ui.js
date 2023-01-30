import { Cart } from './model.js'
import { Signal } from '../utils.js'


class CartButton extends HTMLButtonElement {
	qty_placeholder = null;

	constructor(obj) {
		self = super(obj);

        self.setAttribute("type", "button");
        self.textContent = "Ver pedido:";

		self.qty_placeholder = document.createElement('span');
        self.qty_placeholder.textContent = Cart.length;
		self.appendChild(self.qty_placeholder);

		Cart.change_qty.connect(this, this.set_qty);
	}

	set_qty(qty) {
		this.qty_placeholder = qty;
	}
}

export { CartButton };