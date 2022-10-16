const axios = require('axios')

const generateCarbonImage = async (code, theme) => {
  const url =
    'https://carbonnowsh.herokuapp.com/?' +
    `code=${encodeURIComponent(code)}&theme=${theme}&language=text`

  const res = await axios.get(url, {
    responseType: 'arraybuffer',
  })

  const arrayBuffer = res.data
  const buffer = Buffer.from(arrayBuffer)
  const base64String = 'data:image/png;base64,' + buffer.toString('base64')
  return base64String
}

module.exports = generateCarbonImage
