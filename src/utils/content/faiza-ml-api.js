const axios = require('axios')
const FormData = require('form-data')

const ML_API_URL = 'https://faiza-ml.herokuapp.com'

const categorizePost = async (title) => {
  try {
    const data = new FormData()
    data.append('question', title)

    const config = {
      method: 'post',
      url: ML_API_URL + '/prediction',
      headers: {
        ...data.getHeaders(),
      },
      data,
    }

    const response = await axios(config)
    const prediction = response.data.Prediction

    return prediction
  } catch (err) {
    console.error(err)
    return err
  }
}

const checkToxicText = async (text) => {
  try {
    const data = new FormData()
    data.append('comment', text)

    const config = {
      method: 'post',
      url: ML_API_URL + '/toxic',
      headers: {
        ...data.getHeaders(),
      },
      data,
    }

    const response = await axios(config)
    const prediction = response.data.Prediction

    if (prediction === 'TOXIC') return true
    return false
  } catch (err) {
    console.error(err)
    return err
  }
}

module.exports = {
  categorizePost,
  checkToxicText,
}
