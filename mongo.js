const mongoose = require('mongoose')

if (process.argv.length === 3 && process.argv[2] === 'fullstack') {
  const passwd = process.argv[2]
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

  const url = `mongodb+srv://fullstack:${passwd}@cluster0.ik96d.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

  mongoose.set('strictQuery', false)
  mongoose.connect(url)

  Person.find({}).then((result) => {
    console.log('Phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  return
}

if (process.argv.length < 5) {
  console.log('Provide all arguments')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.ik96d.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//Create person
const person = new Person({
  name: `${name}`,
  number: `${number}`,
})

//Save created person info
person.save().then((result) => {
  console.log(`Added ${result.name} number ${result.number} to Phonebook`)
  mongoose.connection.close()
})
