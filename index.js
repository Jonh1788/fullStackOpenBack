const express = require('express')

const app = express()

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

app.use(express.json())

app.get('/api/persons', (request, response) => {
	response.json(phonebook)
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
	
	res.send(`Phonebook has info for ${phonebook.length} people\n${date}`)
})

app.delete('/api/persons/:id', (req, res) => {

	const id = Number(req.params.id)
	phonebook = phonebook.filter(person => person.id !== id)

	return res.json(phonebook)
})

app.post('/api/persons', (req, res) => {

	console.log(req.body)
	return res.json(req.body)

})
const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
