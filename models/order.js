const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const OrderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      required: true
    },
    location: {
      type: Schema.Types.ObjectId,
      required: true
    },
    subTotal: {
      type: Currency,
      required: true,
      min: 0
    },
    taxes: {
      type: Currency,
      required: true
    },
    status: {
      type: String,
      enum: ["NEW", "PREPARING", "FINALIZED", "CANCELLED"],
      required: true
    },
    transaction: {
      type: String,
      default: "PLACEHOLDER"
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", OrderSchema);
