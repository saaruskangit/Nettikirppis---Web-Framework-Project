const mongoose = require("mongoose");

const varausSchema = new mongoose.Schema({
  nimi: {
    type: String,
    required: true
  },
  alkuPaivays: {
    type: Date,
    required: true
  },
  loppuPaivays: {
    type: Date,
    required: true
  }
});

const Varaus = mongoose.model("Varaus", varausSchema);

module.exports = Varaus;