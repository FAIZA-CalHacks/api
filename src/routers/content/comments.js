const express = require('express')
const router = new express.Router()

const Comment = require('../../models/content/Comment')

const { checkToxicText } = require('../../utils/content/faiza-ml-api')

// * get all comments with answer id
router.get('/:answer', async (req, res) => {
  try {
    const comments = await Comment.find({
      'metadata.answer': req.params.answer,
    })
    res.status(200).json(comments)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * create new comment
router.post('/:answer', async (req, res) => {
  try {
    // check if comment is toxic
    const toxic = await checkToxicText(req.body.body)
    if (toxic) {
      return res.status(400).json({ errorMsg: 'Toxic content.' })
    }

    const comment = new Comment({
      ...req.body,
      metadata: {
        answer: req.params.answer,
      },
    })

    await comment.save()
    res.status(201).json(comment)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * update comment body text
router.patch('/:comment', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.comment)
    if (!comment)
      return res.status(404).json({ errorMsg: 'Comment not found.' })

    // update comment
    if (req.body.body) {
      // check if comment is toxic
      const toxic = await checkToxicText(req.body.body)
      if (toxic) {
        return res.status(400).json({ errorMsg: 'Toxic content.' })
      }
      comment.body = req.body.body
    }
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
    return res.status(200).json({ msg: 'Successfully deleted comment.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
