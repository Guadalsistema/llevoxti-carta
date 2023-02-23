import { InvalidArgumentException } from './exception.js';

class ModelHTMLElement extends HTMLElement {
	get fields() {
		return {};
    }

	get optionalFields() {
		return {};
	}

	fromObject(obj) {
		for(const key in this.fields) {
			if(!key in obj) {
				throw InvalidArgumentException;
			}
			this.setAttribute(this.fields[key], obj[key]);
		}
		for(const key in this.optionalFields) {
			if(!obj[key]) {
				this.setAttribute(this.optionalFields[key], obj[key]);
			}
		}
	}

	// TODO: This should return the inverse operation
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

export { ModelHTMLElement };
