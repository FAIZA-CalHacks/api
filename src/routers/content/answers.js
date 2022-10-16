const express = require('express')
const router = new express.Router()

const Answer = require('../../models/content/Answer')
const Comment = require('../../models/content/Comment')

const { checkToxicText } = require('../../utils/content/faiza-ml-api')

// * get all answers with post id
router.get('/:post', async (req, res) => {
  try {
    const answers = await Answer.find({
      'metadata.post': req.params.post,
    })
    res.status(200).json(answers)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * create new answer on post
router.post('/:post', async (req, res) => {
  try {
    // check if answer is toxic
    const toxic = await checkToxicText(req.body.body)
    if (toxic) {
      return res.status(400).json({ errorMsg: 'Toxic content.' })
    }

    const answer = new Answer({
      ...req.body,
      metadata: {
        post: req.params.post,
      },
    })
    await answer.save()
    res.status(201).json(answer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * update answer body text
router.patch('/:answer', async (req, res) => {
  try {
    // check if answer is toxic
    const toxic = await checkToxicText(req.body.body)
    if (toxic) {
      return res.status(400).json({ errorMsg: 'Toxic content.' })
    }

    const answer = await Answer.findById(req.params.answer)
    if (!answer) return res.status(404).json({ errorMsg: 'Answer not found.' })

    // update answer
    answer.body = req.body.body
    await answer.save()
    return res.status(200).json(answer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * delete answer
router.delete('/:answer', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answer)
    if (!answer) return res.status(404).json({ errorMsg: 'Answer not found.' })

    // delete all comments with answer id
    await Comment.deleteMany({ metadata: { answer: req.params.answer } })

    await answer.delete()
    return res
      .status(200)
      .json({ msg: 'Successfully deleted answer and its comments.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
