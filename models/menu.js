const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const MenuSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Menu','Custom', 'Side', 'Drink'],
        required: true
    },
    subTotal: {
        type: Currency,
        min: 0,
        required: true
    },
    items: [ingredientSchema, null]
});