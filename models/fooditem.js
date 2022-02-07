const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const foodTypeSchema = new Schema({
  name: {
    type: String,
    uppercase: true
  }
});

const foodBrandSchema = new Schema({
  name: {
    type: String
  }
});

const foodItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: foodTypeSchema,
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
  brand: foodBrandSchema,
  image: {
    type: String
  },
  description: {
    type: String
  },
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }]
});

const foodType = mongoose.model("FoodType", foodTypeSchema);
const foodBrand = mongoose.model("FoodBrand", foodBrandSchema);
const foodItem = mongoose.model("FoodItem", foodItemSchema);

module.exports = {
  FoodType: foodType,
  FoodBrand: foodBrand,
  FoodItem: foodItem
}