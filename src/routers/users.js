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

// * register new user
router.post('/', async (req, res) => {
  const { username, password } = req.body
  try {
    // check whether a user with the provided username already exists
    if (await User.findOne({ username }))
      return res.status(400).json({ errorMsg: `Username already exists.` })

    // create new user
    const user = await new User({
      username,
      password,
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
    const { bio, profilePicture } = req.body
    if (bio) user.profile.bio = bio
    if (profilePicture) user.profile.profilePicture = profilePicture

    await user.save()
    return res.status(200).json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
