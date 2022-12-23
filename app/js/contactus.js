let formLabels = ["email", "nombre", "telefono", "direccion", "c_postal", "poblacion", "provincia", "mensaje"];

formLabels.forEach((label) => {
	let value = localStorage.getItem("lxt" + label);
	if (value !== null) {
		document.getElementById(label).value = value;
	}
});

function darProvincia(cpostal){
	let cp_provincias={
		1:"Álava",2:"Albacete",3:"Alicante",4:"Almer\u00EDa",5:"\u00C1vila",
		6:"Badajoz",7:"Baleares",08:"Barcelona",09:"Burgos",10:"C\u00E1ceres",
		11:"C\u00E1diz",12:"Castell\u00F3n",13:"CiudadReal",14:"C\u00F3rdoba",15:"Coruña",
		16:"Cuenca",17:"Gerona",18:"Granada",19:"Guadalajara",20:"Guip\u00FAzcoa",
		21:"Huelva",22:"Huesca",23:"Ja\u00E9n",24:"Le\u00F3n",25:"L\u00E9rida",
		26:"LaRioja",27:"Lugo",28:"Madrid",29:"Málaga",30:"Murcia",
		31:"Navarra",32:"Orense",33:"Asturias",34:"Palencia",35:"LasPalmas",
		36:"Pontevedra",37:"Salamanca",38:"SantaCruzdeTenerife",39:"Cantabria",40:"Segovia",
		41:"Sevilla",42:"Soria",43:"Tarragona",44:"Teruel",45:"Toledo",
		46:"Valencia",47:"Valladolid",48:"Vizcaya",49:"Zamora",50:"Zaragoza",
		51:"Ceuta",52:"Melilla"
	};
	if(cpostal.length==5 && cpostal<=52999 && cpostal>=1000) {
		return cp_provincias[parseInt(cpostal.substring(0,2))];
	}
	else {
		return"---";
	}
}

var inputCP=document.getElementById('c_postal');
inputCP.onkeyup=function(){
	document.getElementById('provincia').value=darProvincia(inputCP.value);
}

const $form_envio=document.querySelector("#form_envio")
$form_envio.addEventListener('submit',(ev) => {
	ev.preventDefault()
	formLabels.forEach((label) => {
		let value = document.getElementById(label).value;
		if (value !== null) {
			localStorage.setItem("lxt" + label, value);
		}
	})
});