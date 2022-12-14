const express = require('express')
const router = new express.Router()

const User = require('../../models/User')
const Post = require('../../models/content/Post')
const Answer = require('../../models/content/Answer')
const Comment = require('../../models/content/Comment')

const generateCarbonImage = require('../../utils/content/generateCarbonImage')
const {
  categorizePost,
  checkToxicText,
} = require('../../utils/content/faiza-ml-api')
// const { mintNft } = require('../../utils/web3/faiza-web3-api')

// * get post previews for the feed
router.get('/previews', async (req, res) => {
  try {
    const posts = await Post.find({}).limit(10)

    // send only the previews and the post ids
    const previews = posts.map((post) => ({
      _id: post._id,
      preview: post.preview,
    }))

    res.status(200).json(previews)
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
    return res.status(200).json(post)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: err.message })
  }
})

// * create new post
router.post('/:user', async (req, res) => {
  try {
    // create new post
    const post = await new Post({
      ...req.body,
      metadata: { author: req.params.user, owner: req.params.user },
    })

    // check that user has enough balance to post
    const user = await User.findById(post.metadata.author)
    if (user.balance < 1) {
      return res.status(400).json({ errorMsg: 'Not enough balance.' })
    }

    // categorize post
    categorizePost(post.title).then((category) => {
      post.category = category
    })

    // // check if content is toxic
    // const toxic = await checkToxicText(post.body)
    // if (toxic) return res.status(400).json({ errorMsg: 'Toxic content.' })

    // create carbon image for post title
    const base64String = await generateCarbonImage(
      post.title,
      post.preview.theme
    )
    post.preview.base64String = base64String

    // // mint nft
    // mintNft(post.title, post._id, post.metadata.author).then((nftCid) => {
    //   post.metadata.nftCid = nftCid
    // })

    await post.save()

    // update user balance
    user.balance -= 1
    await user.save()

    return res.status(201).json(post)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMsg: 'Server Error' })
  }
})

// * put post
router.put('/:post', async (req, res) => {
  try {
    // check if content is toxic
    if (req.body.body) {
      const toxic = await checkToxicText(req.body.body)
      if (toxic) {
        return res.status(400).json({ errorMsg: 'Toxic content.' })
      }
    }

    let post = await Post.findByIdAndUpdate(req.params.post, req.body, {
      new: true,
      runValidators: true,
    })
    if (!post) return res.status(404).json({ errorMsg: 'Post not found.' })

    // categorize post
    if (req.body.title)
      categorizePost(post.title).then((category) => {
        post.category = category
      })

    // if theme or title changed, update carbon image
    if (req.body['preview.theme'] || req.body.title) {
      const base64String = await generateCarbonImage(
        post.title,
        post.preview.theme
      )
      post.preview.base64String = base64String
      await post.save()
    }

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
