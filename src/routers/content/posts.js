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

// * search for keyword in post
router.get('/search/:keyword', async (req, res) => {
  try {
    const posts = await Post.find({
      $text: { $search: req.params.keyword },
    })
    res.status(200).json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ errorMsg: err.message })
  }
})

// * search for tags in post
router.get('/search/tags/:tags', async (req, res) => {
  try {
    // might work if I put this in an array
    const posts = await Post.find({
      tags: { $in: req.params.tags.split(',') },
    })
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
    post = req.body
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

    // delete linked answers and comments
    await Answer.deleteMany({ metadata: { post: req.params.post } })
    await Comment.deleteMany({ metadata: { post: req.params.post } })

    await post.delete()
    return res.status(200).json(post)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

module.exports = router
