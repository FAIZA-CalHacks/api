const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InvestmentSchema = new Schema({
  metadata: {
    createdAt: { type: Date, default: Date.now },
    investor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    postValue: { type: Number, required: true },
  },
  amount: { type: Number, required: true },
})

module.exports = mongoose.model('Investment', InvestmentSchema)
