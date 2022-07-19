import { InvalidArgumentException } from './utils.js';

class FieldModel {
	#validType = ["int", "string", "float"]
	constructor(name, type) {
		if(typeof name !== 'string' || !type in this.#validType) {
			throw InvalidArgumentException;
		}
		Object.defineProperty(this, 'type', {
			value: type,
			writable: false,
			enumerable: true,
			configurable: false,
		});
		Object.defineProperty(this, 'name', {
			value: name,
			writable: false,
			enumerable: true,
			configurable: false,
		});
	}

	static validate(field, val) {
		if(field.type === "string") {
			return true;
		}
		if(field.type === "int") {
			return !isNaN(parseInt(val));
		}
		if(field.type === "float") {
			return !isNaN(parseFloat(val));
		}
		throw InvalidArgumentException;
	}

	static value(field, val) {
		if(field.type === "string") {
			return String(val);
		}
		if(field.type === "int") {
			return parseInt(val);
		}
		if(field.type === "float") {
			return parseFloat(val);
		}
		throw InvalidArgumentException;
	}
}

class Model {
	get fields() {
		return [];
	}

	constructor() {
		if(arguments.length > 0) {
			if(typeof arguments[0] === "object") {
				let obj = arguments[0];
				for (const field of this.fields) {
					if(!obj[field.name] || !FieldModel.validate(field, obj[field.name])) {
						throw InvalidArgumentException;
					}
					Object.defineProperty(this, field.name, {
						value: FieldModel.value(field, obj[field.name]),
						writable: true,
						enumerable: true,
						configurable: false,
					});
				}
				return;
			}

			throw InvalidArgumentException;
		}
	}
}

class ModelHTMLElement extends HTMLElement {
	get fields() {
		return {};
    }

	get optionalFields() {
		return {};
	}

	fromObject(obj) {
		for(const key in this.fields) {
			if(!obj[key]) {
				throw InvalidArgumentException;
			}
			this.setAttribute(this.fields[key], obj[key]);
		}
		for(const key in this.optionalFields) {
			if(obj[key]) {
				this.setAttribute(this.optionalFields[key], obj[key]);
			}
		}
	}

	toObject() {
		let obj = {}
		for(const key in this.fields) {
			obj[key] = this.getAttribute(this.fields[key]);
		}
		for(const key in this.optionalFields) {
			if (this.hasAttribute(key)) {
				obj[key] = this.getAttribute(this.optionalFields[key]);
			}
		}
		return obj;
	}

    toJSON() {
        return JSON.dumps(this.toObject());
    }

    fromJSON(val) {
        this.fromObject(JSON.dumps(val));
    }

    constructor(...args) {
        super(...args);
    }
}

export { ModelHTMLElement, FieldModel, Model };
