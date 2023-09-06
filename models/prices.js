const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const PriceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  description: String,
  taxName: String,
  taxInclude: String,
  taxPercent: Number,
  createdBy: ObjectId,
  isDelete: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

const Price = mongoose.model('price', PriceSchema)

module.exports = Price;

