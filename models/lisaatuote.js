const mongoose = require("mongoose");

const tuoteSchema = new mongoose.Schema({
  nimi: {
    type: String,
    required: true,
  },
  hinta: {
    type: Number,
    required: true,
  },
  paivays: {
    type: String,
    required: true,
  },
  kuvaus: {
    type: String,
    required: true,
  },
  kuva: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tuote", tuoteSchema);
