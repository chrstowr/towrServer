const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const ingredientCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    uppercase: true
  },
  text: {
    type: String,
    required: true
  }, 
  index: {
      type: Number,
      required: true
  },
  image: {
    type: String
  }
});

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: ingredientCategorySchema,
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
    description: {
      type: String
    },
    available: {
        type: Boolean,
        default: true
      },
  }
);

module.exports = mongoose.model("Ingredient", ingredientSchema);
module.exports = mongoose.model("IngredientCategory", ingredientCategorySchema);
