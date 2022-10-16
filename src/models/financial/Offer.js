const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OfferSchema = new Schema({
  metadata: {
    createdAt: { type: Date, default: Date.now },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  amount: { type: Number, required: true },
  result: { type: Boolean, default: null },
})

module.exports = mongoose.model('Offer', OfferSchema)
