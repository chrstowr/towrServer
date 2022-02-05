const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const foodItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["MENU", "CUSTOM", "SIDE", "DRINK"],
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  price: {
    type: Currency,
    min: 0,
    required: true
  },
  cost: {
    type: Currency,
    min: 0,
    required: true
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  items: [ingredientSchema]
});
