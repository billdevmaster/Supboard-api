const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const LocationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  openTime: {
    type: String,
    required: true
  },
  closeTime: {
    type: String,
    required: true
  },
  priceId: {
    type: ObjectId
  },
  description: {
    type: String,
    required: true
  },
  stationType: String,
  operationalMonths: [String],
  images: [String],
  isDelete: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

const Location = mongoose.model('location', LocationSchema)

module.exports = Location;