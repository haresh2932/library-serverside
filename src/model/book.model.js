const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    rentPerDay: {
      type: Number,
      required: true
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true
    },
    publicationYear: {
      type: Number,
      required: true
    },
    isbn: {
      type: String,
      required: true,
      unique: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Books = mongoose.model('Book', BookSchema);
module.exports = Books