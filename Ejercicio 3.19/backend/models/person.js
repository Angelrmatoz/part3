import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    number: String
});

export default mongoose.model('Person', personSchema);