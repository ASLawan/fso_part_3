const express = require("express");
const morgan = require("morgan");
const PORT = 5000;

const app = express();
app.use(express.json());

// morgan token
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

//morgan custom format
const outputFormat = `:method :url :status :res[Content-Length] :response-time ms :body`;
app.use(morgan(outputFormat));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//default route
app.get("/", (req, res) => {
  res.json({
    Hello: "World!",
  });
});

// GET all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// phonebook info
app.get("/info", (req, res) => {
  const numPersons = persons.length;
  const date = new Date();

  if (numPersons === 0) {
    res.status(404).send("No info in phonebook");
  }
  res.send(`<div>
        <p>Phonebook has info for ${numPersons} people<p>
        <p>${date}</p>
        </div>`);
});

// DELETE contact info
app.delete("/api/persons/:id", (req, res) => {
  // convert id to NUmber to match the ids in the person object
  const id = Number(req.params.id);
  console.log(id);
  persons = persons.filter((person) => person.id !== id);
  console.log(persons);
  res.status(204).end();
});

// generateId
const generateId = () => {
  const id = Math.random() * 100000;

  return Number(id).toFixed(0);
};
// POST create person contact
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "Incomplete person information" });
  }

  // check if name exists already
  const nameExists = persons.find((person) => person.name === body.name);

  if (nameExists) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(newPerson);

  res.status(201).json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
