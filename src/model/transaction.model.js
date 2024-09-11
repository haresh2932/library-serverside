const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Book',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date
    },
    rentPaid: {
      type: Number
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports=Transaction