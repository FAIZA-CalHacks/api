const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  metadata: {
    createdAt: { type: Date, default: Date.now },
    answer: { type: Schema.Types.ObjectId, ref: 'Answer', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    dislikes: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
  },
  body: { type: String, trim: true, required: true },
})

module.exports = mongoose.model('Comment', CommentSchema)
