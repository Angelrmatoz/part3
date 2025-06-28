const express = require('express');
const app = express();
app.use(express.json());

let persons = [
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

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/info', (req, res) => {
    const date = new Date();
    const html = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `;
    res.send(html);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = persons.find(person => person.id === id);

    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

app.post('/api/persons', (req, res) => {
    const nuevaPersona = req.body;

    nuevaPersona.id = Math.floor(Math.random() * 1000000);
    persons.push(nuevaPersona);
    res.json(nuevaPersona);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== Number(id));
    res.status(204).end(); 
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});