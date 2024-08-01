const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
  üyeId: String,
  sebep: String,
  tarih: Date
});

module.exports = mongoose.model('Ban', banSchema);