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

app.post('/api/persons', (req, res) => {
    const person = new Person(req.body);
    person.save().then(savedPerson => {
        res.status(201).json(savedPerson);
    });
});

// Para cualquier otra ruta, servir index.html del frontend
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});