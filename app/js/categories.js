import { config } from 'config';

function getCategories() {
	var url = config["url"];

	fetch(url, {
	  method: 'GET', // or 'PUT'
	  headers:{
	    'Content-Type': 'application/json'
	  }
	}).then(res => res.json())
	.catch(error => console.error('Error:', error))
	.then(response => console.log('Success:', response));
}
