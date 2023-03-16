const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const todoSchema = new Schema({
    title: {
        type : String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Todo = mongoose.model('Todo', todoSchema);
module.exports= Todo; 