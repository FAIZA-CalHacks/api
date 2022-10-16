const express = require('express')
const router = new express.Router()

const Answer = require('../../models/content/Answer')

// * get all answers with post id
router.get('/:post', async (req, res) => {
  try {
    const answers = await Answer.find({ metadata: { post: req.params.post } })
    res.status(200).json(answers)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * create new answer
router.post('/', async (req, res) => {
  try {
    // create new answer
    const answer = await new Answer(req.body)
    await answer.save()
    return res.status(201).json(answer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * put answer
router.put('/:answer', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answer)
    if (!answer) return res.status(404).json({ errorMsg: 'Answer not found.' })

    // update answer
    answer = req.body
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

    await answer.delete()
    return res.status(200).json(answer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
