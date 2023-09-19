require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/Person')

const unknownEndpoint = (req, res) => {
  res.status(404).send({error:'unknown endpoint'})
}

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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


app.get('/api/persons/:id', (request, response) => {

	const id = Number(request.params.id)
	const person = phonebook.find(person => person.id === id)
	
	if(person){
		return response.json(person)
	}
	response.statusMessage = 'Person not found'
	return response.status(404).end()
})

app.get('/info', (req, res) => {
	const date = new Date()
	
	res.send(`<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {

	const id = Number(req.params.id)
	phonebook = phonebook.filter(person => person.id !== id)

	return res.status(204).json(phonebook)
})

app.post('/api/persons', (req, res) => {

	

  if(req.body.name){
    const existsInPhonebook = phonebook.some(person => person.name.toLowerCase() === req.body.name.toLowerCase())
    if(existsInPhonebook){
      return res.status(400).send({error: 'Name must be unique'})
    }
  } else {
    return res.status(400).send({error: 'Name not exists'})
  }

  if(req.body.number){
    const existsInPhonebook = phonebook.some(person => person.number === req.body.number)
    if(existsInPhonebook){
      return res.status(400).send({error: 'Number must be unique'})
    }
  } else {

    return res.status(400).send({error: 'Number not exists'})
  }


    const newPerson = {
      id: gerarId(),
      name: req.body.name,
      number: req.body.number
    }
    

    phonebook.push(newPerson)
    console.log(newPerson)
    return res.status(200).json(newPerson)
  


})

	

app.use(unknownEndpoint)
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
