const express = require('express')
const router = new express.Router()

const User = require('../models/User')

// * get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ errorMsg: err.message })
  }
})

// * get user by id
router.get('/:user', async (req, res) => {
  try {
    const user = await User.findById(req.params.user)
    if (!user) return res.status(404).json({ errorMsg: 'User not found.' })
    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * get user by username
router.get('/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(404).json({ errorMsg: 'User not found.' })
    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * register new user
router.post('/', async (req, res) => {
  const { username, password } = req.body
  try {
    // check whether a user with the provided email already exists
    if (await User.findOne({ metadata: { username } })) {
      console.error(err)
      return res.status(400).json({ errorMsg: 'User already exists.' })
    }
    // create new user
    const user = await new User({
      metadata: {
        username,
        password,
      },
    })
    await user.save()
    return res.status(201).json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * put user
router.put('/:user', async (req, res) => {
  try {
    const user = await User.findById(req.params.user)
    if (!user) return res.status(404).json({ errorMsg: 'User not found.' })

    // update user
    user = req.body
    await user.save()
    return res.status(200).json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
