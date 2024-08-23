const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

//==================================
// LOGGER - MORGAN
//=================================

// morgan token
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

//morgan custom format
const outputFormat = `:method :url :status :res[Content-Length] :response-time ms :body`;
app.use(morgan(outputFormat));

//=====================================
// ROUTES = ENDPOINTS
//=====================================

// // phonebook info
app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    if (count === 0) {
      res.status(404).send("No info in phonebook");
    }
    const date = new Date();
    res.send(`<div>
        <p>Phonebook has info for ${count} people<p>
        <p>${date}</p>
        </div>`);
  });
});

// GET all persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

// GET one person
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// DELETE person
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// UPDATE person
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  console.log("Request body: ", body);
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// POST create person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "missing name" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

// =====================================
// MIDDLEWARE
//======================================
// error handler
const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({
      error: "malformatted id",
    });
  }

  next(error);
};

app.use(errorHandler);

// Unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "Unknown endpoint",
  });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
