const mongoose = require('mongoose');

const kullanıcıSchema = new mongoose.Schema({
  userId: String,
  sesSüresi: Number,
  mesajSayısı: Number,
  sesKanalları: [{ type: String, ref: 'SesKanalı' }],
  metinKanalları: [{ type: String, ref: 'MetinKanalı' }]
});

module.exports = mongoose.model('Kullanıcı', kullanıcıSchema);