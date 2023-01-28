class PosCategoryLi extends HTMLLIElement {
	get fields() {
		return {
			'id': 'pos-category-id',
			'name': 'name',
			'display_name': 'display-name',
			'menu_product_id': 'menu-product-id',
			'sequence': 'sequence',
			'parent_id': 'parent-id',
			'menu': 'menu'
		};
	}

	constructor(obj) {
		self = super(obj);

		var icon = document.createElement('span');
		var link = document.createElement('a');
		self.appendChild(icon);
		self.appendChild(link);

		if(obj) {
			for(const key in this.fields) {
				if(obj[key]) {
					this.setAttribute(this.fields[key], obj[key]);
				}
			}
		}
	}

	static get observedAttributes() {
		return ["name"];
	}

	attributeChangedCallback(attrName, _, newVal) {
		if(attrName == "name") {
			let name = this.querySelector('a');
			name.textContent = newVal;
			return;
		}
		throw InvalidArgumentException(attrName);
	}

	fromObject(obj) {
		for(const key in this.fields) {
			if(!key in obj) {
				throw InvalidArgumentException;
			}
			this.setAttribute(this.fields[key], obj[key]);
		}
	}
}

class PosCategoryUl extends HTMLUListElement {
	constructor() {
		self = super();
		// write element functionality in here
	}

	/**
	 * @param {array} categories
	 */
	loadObjects(categories) {
		for (const category of categories) {
			let pCard = new PosCategoryLi(category)
			this.appendChild(pCard);
		}

	}
}

export { PosCategoryLi, PosCategoryUl };