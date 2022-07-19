
import { config } from './config.js';
import { CategoryCard } from './categories/ui.js'

function displayCategories(categories) {
	let placeholder = document.getElementById("category-list");
	let catTemplate = document.getElementById('category-row-list');
	for (const category of categories) {
		let card = catTemplate.content.querySelector('category-card');
		card.setAttribute("category-id", category.id);
		card.setAttribute("name", category.name);
		var clone = document.importNode(catTemplate.content, true);
		placeholder.appendChild(clone);
	}
}

function workCategories() {
	var url = config["url"] + "/menu/category";
	fetch(url, {
	  method: 'GET',
	}).then(res => res.json())
	.then(categories => displayCategories(categories))
	.catch(error => console.error('Error:', error));
}

customElements.define('category-card', CategoryCard);

workCategories();
