import { FieldModel, Model } from '../model.js';

class Product extends Model {
	get fields() {
		return [
			new FieldModel("id", "int"),
			new FieldModel("name", "string"),
			new FieldModel("pos_categ_id", "int"), 
			new FieldModel("product_uom_qty", "int"),
			new FieldModel("lst_price", "float"),
		];
	}

    constructor(...args) {
		super(...args);
    }
}

export { Product };
