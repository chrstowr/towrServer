const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Schema = mongoose.Schema;

const stopLocationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  hours: {
    type: String,
    required: true
  },
  lat: {
    type: Schema.Types.Decimal128,
    default: 0.0
  },
  lng: {
    type: Schema.Types.Decimal128,
    default: 0.0
  }
});

module.exports = mongoose.model("StopLocation", stopLocationSchema);
