const express = require('express')
const router = new express.Router()

const Investment = require('../../models/financial/Investment')
const User = require('../../models/User')
const Post = require('../../models/content/Post')

const calculateInvestmentOutcome = require('../../utils/calculateInvestmentOutcome')

// * get all investments with post id
router.get('/:post', async (req, res) => {
  try {
    const investments = await Investment.find({
      metadata: { post: req.params.post },
    })
    res.status(200).json(investments)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * create new investment
router.post('/', async (req, res) => {
  try {
    // create new investment
    const investment = await new Investment(req.body)
    await investment.save()

    // update post value
    const post = await Post.findById(investment.metadata.post)
    post.value += investment.amount
    await post.save()

    // update user balance
    const user = await User.findById(investment.metadata.investor)
    user.balance -= investment.amount
    await user.save()

    return res.status(201).json(investment)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * delete investment
router.delete('/:investment', async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investment)
    if (!investment)
      return res.status(404).json({ errorMsg: 'Investment not found.' })

    // * update user's investment outcome based on calculation considering previousPostValue, amount, and the current value of the post
    const user = await User.findById(investment.metadata.investor)
    if (!user) return res.status(404).json({ errorMsg: 'User not found.' })

    const post = await Post.findById(investment.metadata.post)
    if (!post) return res.status(404).json({ errorMsg: 'Post not found.' })

    const currentPostValue = post.metadata.value
    const previousPostValue = investment.metadata.postValue
    const amount = investment.amount

    const investmentOutcome = calculateInvestmentOutcome(
      previousPostValue,
      currentPostValue,
      amount
    )

    // update user balance
    user.balance += investmentOutcome
    await user.save()

    // update post value
    post.value -= investment.amount
    await post.save()

    // delete investment
    await investment.remove()
    return res.status(200).json(investment)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})
