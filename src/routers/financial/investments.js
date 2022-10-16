const express = require('express')
const router = new express.Router()

const Investment = require('../../models/financial/Investment')
const User = require('../../models/User')
const Post = require('../../models/content/Post')

const {
  calculateInvestmentOutcomeToTwoDecimals,
  calculatePercentageReturnToTwoDecimals,
} = require('../../utils/financial/investmentValue')

// * get all investments with post id
router.get('/post/:post', async (req, res) => {
  try {
    const investments = await Investment.find({
      'metadata.post': req.params.post,
    })
    res.status(200).json(investments)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * get investment by id
router.get('/:investment', async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investment)
    if (!investment)
      return res.status(404).json({ errorMsg: 'Investment not found.' })
    res.status(200).json(investment)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * create new investment
router.post('/:post', async (req, res) => {
  try {
    // create new investment
    const investment = new Investment({
      ...req.body,
      metadata: { post: req.params.post },
    })

    // check if user has enough balance to invest
    const user = await User.findById(investment.metadata.user)
    if (user.balance < req.body.amount) {
      return res.status(400).json({ errorMsg: 'Not enough balance.' })
    }

    // update post value
    const post = await Post.findById(investment.metadata.post)
    post.value += investment.amount
    await post.save()

    // record value of post at time of investment
    investment.metadata.postValueAtTimeOfInvestment = post.value
    await investment.save()

    // update user balance
    user.balance -= investment.amount
    await user.save()

    return res.status(201).json(investment)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * retrieve investment
router.delete('/:investment', async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investment)
    if (!investment)
      return res.status(404).json({ errorMsg: 'Investment not found.' })

    // * update user's investment outcome based on calculation considering previousPostValue, amount, and the current value of the post
    const user = await User.findById(investment.metadata.user)
    if (!user) return res.status(404).json({ errorMsg: 'User not found.' })

    const post = await Post.findById(investment.metadata.post)
    if (!post) return res.status(404).json({ errorMsg: 'Post not found.' })

    const currentPostValue = post.value
    const postValueAtTimeOfInvestment =
      investment.metadata.postValueAtTimeOfInvestment
    const amount = investment.amount

    const investmentOutcome = calculateInvestmentOutcomeToTwoDecimals(
      amount,
      currentPostValue,
      postValueAtTimeOfInvestment
    )

    const percentageReturn = calculatePercentageReturnToTwoDecimals(
      amount,
      investmentOutcome
    )

    // update user balance
    user.balance += investmentOutcome
    await user.save()

    // update post value
    post.value -= investment.amount
    await post.save()

    // delete investment
    await investment.remove()
    return res.status(200).json({
      msg: 'Successfully retrieved investment.',
      investmentOutcome,
      percentageReturn,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
