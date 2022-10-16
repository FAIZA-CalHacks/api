const mongoose = require('mongoose')
const readTextFile = require('read-text-file')

const UserSchema = new mongoose.Schema({
  metadata: {
    createdAt: { type: Date, default: Date.now },
    username: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
  },
  balance: { type: Number, default: 0 },
  bio: { type: String, trim: true, default: '' },
  profilePicture: {
    type: String,
    default: readTextFile.readSync(
      './assets/images/defaultProfileImageBase64.txt'
    ),
  },
})

module.exports = mongoose.model('User', UserSchema)
