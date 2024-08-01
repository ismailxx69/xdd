const mongoose = require('mongoose');

const kayitSchema = new mongoose.Schema({
  yetkili: String,
  kayitEdilen: String,
  tarih: Date
});

module.exports = mongoose.model('Kayit', kayitSchema);