class Address {
	static mandatory = ["email", "name", "phone", "street", "zip", "city", "state_id"];
	static labels = ["email", "name", "phone", "street", "zip", "city", "state_id", "comment"];

	static valid() {
		let array = Address.mandatory.map((label) => {
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
		let array = Address.mandatory.forEach((label) => {
			let value = localStorage.getItem("lxt" + label);
			if (value !== null) {
				object[label] = value;
			}
		} );
		return object;
	}
}

export { Address };
