const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const StationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true
  },
  lockersCapacity: {
    type: Number,
    required: true
  },
  locationId: {
    type: ObjectId,
    required: true
  },
  description: {
    type: String,
  },
  terrainId: {
    type: ObjectId,
  },
  scanBoard: {
    type: Boolean,
  },
  scanLifejacket: {
    type: Boolean,
  },
  scanPaddle: {
    type: Boolean,
  },
  status: {
    type: String,
    required: true
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  createdBy: ObjectId
},
{
  timestamps: true
});

const Station = mongoose.model('station', StationSchema)

module.exports = Station;

