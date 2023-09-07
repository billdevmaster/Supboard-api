const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const LockerSchema = mongoose.Schema({
  stationId: {
    type: ObjectId,
    required: true
  },
  description: {
    type: String,
  },
  doorNumber: {
    type: Number,
    required: true
  },
  keyholeNumber: {
    type: Number,
    required: true
  },
  lockerBoard: {
    type: Number,
    required: true
  },
  boardRFID: {
    type: String,
    required: true
  },
  lifejacketRFID: {
    type: String,
    required: true
  },
  paddleRFID: {
    type: String,
    required: true
  },
  ownerLocker: {
    type: Boolean,
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

const Locker = mongoose.model('locker', LockerSchema)

module.exports = Locker;

