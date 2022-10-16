const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  metadata: {
    createdAt: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nftCid: { type: String },
  },
  title: { type: String, trim: true, required: true },
  body: { type: String, trim: true, required: true },
  category: { type: String, default: 'General' },
  value: { type: Number, default: 1 },
  preview: {
    theme: {
      type: String,
      default: 'dracula',
      enum: [
        '3024-night',
        'a11y-dark',
        'blackboard',
        'base16-dark',
        'base16-light',
        'cobalt',
        'dracula',
        'duotone-dark',
        'hopscotch',
        'lucario',
        'material',
        'monokai',
        'night-owl',
        'nord',
        'oceanic-next',
        'one-light',
        'one-dark',
        'panda-syntax',
        'paraiso-dark',
        'seti',
        'shades-of-purple',
        'solarized',
        'solarized%20light',
        'synthwave-84',
        'twilight',
        'verminal',
        'vscode',
        'yeti',
        'zenburn',
      ],
    },
    base64String: { type: String, default: '' },
  },
})

module.exports = mongoose.model('Post', PostSchema)
