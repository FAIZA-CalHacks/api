const express = require('express')
const router = new express.Router()

const Offer = require('../../models/financial/Offer')
const User = require('../../models/User')
const Post = require('../../models/content/Post')

// * get all offers with post id
router.get('/:post', async (req, res) => {
  try {
    const offers = await Offer.find({
      metadata: { post: req.params.post },
    })
    res.status(200).json(offers)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * create new offer
router.post('/:post', async (req, res) => {
  try {
    const offer = new Offer({
      ...req.body,
      metadata: { post: req.params.post },
    })

    // check that user has enough balance to offer
    const user = await User.findById(offer.metadata.buyer)
    if (user.balance < offer.amount)
      return res.status(400).json({ errorMsg: 'Insufficient balance.' })

    // get owner of post
    const post = await Post.findById(req.params.post)
    offer.metadata.owner = post.metadata.owner

    // check that owner is not the same as buyer
    if (offer.metadata.owner.toString() == offer.metadata.buyer.toString())
      return res.status(400).json({ errorMsg: 'Cannot offer on own post.' })

    // save offer
    await offer.save()

    // update user balance
    user.balance -= offer.amount
    await user.save()

    return res.status(201).json(offer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * accept offer
router.patch('/accept/:offer', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offer)
    if (!offer) return res.status(404).json({ errorMsg: 'Offer not found.' })

    // check that offer is not already accepted or rejected
    if (offer.result != null)
      return res
        .status(400)
        .json({ errorMsg: 'Offer already accepted/rejected.' })

    // update offer result
    offer.result = true
    await offer.save()

    // update user balance
    const buyer = await User.findById(offer.metadata.buyer)
    buyer.balance -= offer.amount
    await buyer.save()

    // check buyer's other offers and automatically cancel them if the amount is greater than buyer's current balance
    const offers = await Offer.find({
      metadata: { buyer: offer.metadata.buyer },
    })
    offers.forEach(async (offer) => {
      if (offer.result === false) {
        if (buyer.balance < offer.amount) {
          // remove offer
          await offer.remove()
        }
      }
    })

    // update user balance
    const owner = await User.findById(offer.metadata.owner)
    owner.balance += offer.amount
    await owner.save()

    // transfer ownership of post
    const post = await Post.findById(offer.metadata.post)
    post.metadata.owner = offer.metadata.buyer
    await post.save()

    return res.status(200).json({
      msg: 'Successfully accepted offer, completed transaction, and automatically canceled other offers made by user if balance is insufficient.',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * decline offer
router.delete('/decline/:offer', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offer)
    if (!offer) return res.status(404).json({ errorMsg: 'Offer not found.' })

    // check that offer is not already accepted or rejected
    if (offer.result != null)
      return res
        .status(400)
        .json({ errorMsg: 'Offer already accepted/rejected.' })

    // update offer result
    offer.result = false
    await offer.save()

    return res.status(200).json({ msg: 'Successfully rejected offer.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
