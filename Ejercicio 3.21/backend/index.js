import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Person from './models/person.js';
import './mongo.js';

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    next(error);
}

// Servir archivos estáticos del frontend (dist)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});

app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.post('/api/persons', (req, res, next) => {
    const person = new Person(req.body);
    person.save().then(savedPerson => {
        res.status(201).json(savedPerson);
    })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    const { id } = req.params;
    Person.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const { id } = req.params;
    const { name, number } = req.body;

    Person.findByIdAndUpdate(id, { name, number }, { new: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

// Para cualquier otra ruta, servir index.html del frontend
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler);