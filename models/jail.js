const mongoose = require('mongoose');

const jailSchema = new mongoose.Schema({
  üyeId: String,
  eskiRoller: [{ type: String }],
  süre: Number,
  tarih: Date
});

module.exports = mongoose.model('Jail', jailSchema);