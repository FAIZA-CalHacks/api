const express = require('express')
const router = new express.Router()

const Offer = require('../../models/financial/Offer')
const User = require('../../models/User')

// get all offers with post id
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

// create new offer
router.post('/', async (req, res) => {
  try {
    // create new offer
    const offer = await new Offer(req.body)
    await offer.save()

    // check that user has enough balance
    const user = await User.findById(offer.metadata.buyer)
    if (user.balance < offer.amount)
      return res.status(400).json({ errorMsg: 'Insufficient balance.' })

    // update user balance
    user.balance -= offer.amount
    await user.save()

    return res.status(201).json(offer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// offer was accepted
router.patch('/:offer', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offer)
    if (!offer) return res.status(404).json({ errorMsg: 'Offer not found.' })

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

    return res.status(200).json(offer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// offer was rejected
router.delete('/:offer', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offer)
    if (!offer) return res.status(404).json({ errorMsg: 'Offer not found.' })

    // update offer result
    offer.result = false
    await offer.save()

    return res.status(200).json(offer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
