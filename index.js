const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')


const app = express()

const cards = [
  {
    name: 'newegg',
    address: 'https://www.newegg.com/p/pl?d=3090',
    base: ''
  },
  {
    name: 'amazon',
    address: 'https://www.amazon.com/s?k=3090&i=electronics&ref=nb_sb_noss_2',
    base: 'https://www.amazon.com'
  },
  {
    name: 'bestbuy',
    address: 'https://www.bestbuy.com/site/searchpage.jsp?st=3090&_dyncharset=UTF-8&_dynSessConf=&id=pcat17071&type=page&sc=Global&cp=1&nrp=&sp=&qp=&list=n&af=true&iht=y&usc=All+Categories&ks=960&keys=keys',
    base: 'https://www.bestbuy.com'
  }
]

const articles = []


cards.forEach(card => {
  axios.get(card.address)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      $('a:contains("3090")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        
        articles.push({
          title,
          url: card.base + url,
          source: card.name
        })
      })
  })
})

app.get('/', (req, res) => {
  res.json('Welcome to my GFX Card API')
})


app.get('/3090', (req, res) => {
  res.json(articles)
})

app.get('/cards/:cardId', (req, res) => {
  const cardId = req.params.cardId

  const cardAddress = cards.filter(card => card.name == cardId)[0].address
  const cardBase = cards.filter(card => card.name == cardId)[0].base

  axios.get(cardAddress)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      const specificCards = []

      $('a:contains("3090")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        specificCards.push({
          title,
          url: cardBase + url,
          source: cardId
        })
      })
      res.json(specificCards)
  }).catch((err) => console.log(err))
})



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

