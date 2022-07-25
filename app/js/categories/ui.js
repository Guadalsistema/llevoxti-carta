class CategoryCard extends HTMLElement {
	constructor(){
		super();
		var shadow = this.attachShadow({mode: 'open'});

		var icon = document.createElement('span');
		var link = document.createElement('a');
		var text = this.getAttribute('name');
		link.textContent = text;
		var cat_id = this.getAttribute("category-id");
		link.setAttribute("href", "products.html?category-id=" + cat_id);

		var style = document.createElement('style');
		style.textContent = ``;

		shadow.appendChild(style);
		shadow.appendChild(icon);
		shadow.appendChild(link);
	}
}

export { CategoryCard };
