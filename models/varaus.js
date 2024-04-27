const mongoose = require("mongoose");

const varausSchema = new mongoose.Schema({
  nimi: {
    type: String,
    required: true
  },
  alkuPaivays: {
    type: String,
    required: true
  },
  loppuPaivays: {
    type: String,
    required: true
  }
  ,
  poytaID: {
    type: Number,
    required: true
  }
});

const Varaus = mongoose.model("Varaus", varausSchema);

module.exports = Varaus;