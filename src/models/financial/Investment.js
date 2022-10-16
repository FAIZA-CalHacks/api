const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InvestmentSchema = new Schema({
  metadata: {
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    postValueAtTimeOfInvestment: { type: Number, required: true },
  },
  amount: { type: Number, required: true },
})

module.exports = mongoose.model('Investment', InvestmentSchema)
