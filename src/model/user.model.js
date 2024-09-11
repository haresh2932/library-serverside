const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      // required: true
    },

    refreshToken:{
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Users = mongoose.model('User', UserSchema);
module.exports = Users