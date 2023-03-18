import mongoose from "mongoose";

//модель базы данных названий заданий
const TodoSchema = new mongoose.Schema({
    //само название задания
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('todo', TodoSchema);