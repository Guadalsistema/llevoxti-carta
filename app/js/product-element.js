class ProductCard extends HTMLElement {
	constructor(){
		super();
		var shadow = this.attachShadow({mode: 'open'});

		var icon = document.createElement('span');
		var name = document.createElement('span');
		var text = this.getAttribute('name');
		name.textContent = text;

		var style = document.createElement('style');
		style.textContent = ``; // TODO if not long text put style here

		// TODO find a image/icon in the list this name

		shadow.appendChild(style);
		shadow.appendChild(icon);
		shadow.appendChild(name);
	}
}

export { ProductCard };
