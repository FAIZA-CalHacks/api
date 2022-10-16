const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  metadata: {
    createdAt: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    investments: {
      type: [Schema.Types.ObjectId],
      ref: 'Investment',
      default: [],
    },
  },
  title: { type: String, trim: true, required: true },
  body: { type: String, trim: true, required: true },
  tags: { type: [String], default: [] },
})

module.exports = mongoose.model('Post', PostSchema)
