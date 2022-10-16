const express = require('express')
const router = new express.Router()

const Post = require('../../models/content/Post')
const Answer = require('../../models/content/Answer')
const Comment = require('../../models/content/Comment')

// * get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({})
    res.status(200).json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ errorMsg: err.message })
  }
})

// * get post by id
router.get('/:post', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post)
    if (!post) return res.status(404).json({ errorMsg: 'Post not found.' })
    res.status(200).json(post)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * create new post
router.post('/', async (req, res) => {
  try {
    // create new post
    const post = await new Post(req.body)
    await post.save()
    return res.status(201).json(post)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * put post
router.put('/:post', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post)
    if (!post) return res.status(404).json({ errorMsg: 'Post not found.' })

    // update post
    post.title = req.body.title
    post.body = req.body.body
    post.tags = req.body.tags
    await post.save()
    return res.status(200).json(post)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * delete post
router.delete('/:post', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post)
    if (!post) return res.status(404).json({ errorMsg: 'Post not found.' })

    // iterating through each answer with post id field, delete all comments with answer id, then delete answer
    const answers = await Answer.find({ metadata: { post: req.params.post } })
    for (let i = 0; i < answers.length; i++) {
      await Comment.deleteMany({ metadata: { answer: answers[i]._id } })
      await answers[i].delete()
    }

    await post.delete()
    return res.status(200).json({
      msg: 'Successfully deleted post (and related answers and comments).',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
