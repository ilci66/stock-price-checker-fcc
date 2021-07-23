const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
  stock: String,
  likes: {type: [String], default:[]}
});

const Stock = mongoose.model('Stock', stockSchema)
module.exports = Stock