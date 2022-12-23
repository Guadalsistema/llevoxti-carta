class Address {
	static mandatoryLabels = ["email", "nombre", "telefono", "direccion", "c_postal", "poblacion", "provincia"];
	static labels = ["email", "nombre", "telefono", "direccion", "c_postal", "poblacion", "provincia", "mensaje"];

	static valid() {
		let array = Address.mandatoryLabels.map((label) => {
			let value = localStorage.getItem("lxt" + label);
			if (value === null) {
				return "";
			}
			return value;
		} );
		return array.every((v) => v !== "");
	}

	static toObject() {
		let object = {}
		let array = Address.mandatoryLabels.forEach((label) => {
			let value = localStorage.getItem("lxt" + label);
			if (value !== null) {
				object[label] = value;
			}
		} );
		return object;
	}
}

export { Address };
