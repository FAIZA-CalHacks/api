const express = require('express')
const router = new express.Router()

const Comment = require('../../models/content/Comment')

// * get all comments with answer id
router.get('/:answer', async (req, res) => {
  try {
    const comments = await Comment.find({
      metadata: { answer: req.params.answer },
    })
    res.status(200).json(comments)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * create new comment
router.post('/', async (req, res) => {
  try {
    // create new comment
    const comment = await new Comment(req.body)
    await comment.save()
    return res.status(201).json(comment)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * put comment
router.put('/:comment', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.comment)
    if (!comment)
      return res.status(404).json({ errorMsg: 'Comment not found.' })

    // update comment
    comment = req.body
    await comment.save()
    return res.status(200).json(comment)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * delete comment
router.delete('/:comment', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.comment)
    if (!comment)
      return res.status(404).json({ errorMsg: 'Comment not found.' })

    await comment.delete()
    return res.status(200).json(comment)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
