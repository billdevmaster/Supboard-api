const mongoose = require('mongoose');

const TerrainSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  isDelete: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

const Terrain = mongoose.model('terrain', TerrainSchema)

module.exports = Terrain;

