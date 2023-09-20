const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log()

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate : {
      validator: (v) => {
        return /\d{2,3}-\d{6,}/.test(v)
      },
      message: props => `${props.value} is not a valid number, must be XX-XXXXXX or XXX-XXXXXX`
    },

    required: true

  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})



module.exports = mongoose.model('Person', personSchema)
