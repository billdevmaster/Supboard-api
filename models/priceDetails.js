const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const PriceDetailSchema = mongoose.Schema({
  priceId: ObjectId,
  time: String,
  day_0_price: Number,
  day_1_price: Number,
  day_2_price: Number,
  day_3_price: Number,
  day_4_price: Number,
  day_5_price: Number,
  day_6_price: Number,
},
{
  timestamps: true
});

const PriceDetail = mongoose.model('priceDetail', PriceDetailSchema)

module.exports = PriceDetail;

