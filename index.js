require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/Person')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error:'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {

  if(err.name === 'CastError'){
    return res.status(400).send({ error: 'malformatted id' })
  }

  if(err.name === 'ValidationError'){
    return res.status(400).send({ error: err.message })
  }
  next(err)
}


const gerarId = () => {
  return Math.floor(Math.random() * 1000)
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('persons', (req, res) => {
  if(Object.keys(req.body).length > 0){
    return JSON.stringify(req.body)
  }

})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :persons'))


app.get('/api/persons', (req, res) => {

  Person.find({}).then(result => {
    res.json(result)
  })

})


app.get('/api/persons/:id', (request, response, next) => {


  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))

})

app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.find({})
    .then(result => {
      res.send(`<p>Phonebook has info for ${result.length} people</p><p>${date}</p>`)
    })
    .catch(err => next(err))

})

app.delete('/api/persons/:id', (req, res, next) => {

  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {

  const newPerson = new Person({
	  name: req.body.name,
	  number: req.body.number
  })

  newPerson.save().then(result => {
    return res.json(result)
  })
    .catch(err => next(err))

})

app.put('/api/persons/:id', (req, res, next) => {

  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context:'query' })
    .then(personUpdated => {
      res.json(personUpdated)
    })
    .catch(err => next(err))
})


app.use(errorHandler)
app.use(unknownEndpoint)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
