import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{2,3}-\d{5,}/.test(v) && v.length >= 8;
            },
            message: props => `${props.value} is not a valid phone number!` 
        }
    }
});

export default mongoose.model('Person', personSchema);