const mongoose = require('mongoose');

const password = process.argv[2];

const url = `mongodb+srv://Angelrmatoz:${password}@cluster0.roqvqa2.mongodb.net/phonebook?retryWrites=true&w=majority`;

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument');
    process.exit(1);
}

mongoose.set('strictQuery', false);
mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    // Mostrar todos los contactos
    Person.find({}).then(persons => {
        console.log('phonebook:');
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
    // Agregar un nuevo contacto
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    console.log('usage: node mongo.js <password> [name number]');
    mongoose.connection.close();
}