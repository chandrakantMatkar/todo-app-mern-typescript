import mongoose, {Document} from "mongoose";

interface TodoUser{
    id: mongoose.Types.ObjectId
}

interface TodoItem extends Document{
    title: string,
    description: string,
    status: 'Complete' | 'Incomplete';
    user: TodoUser
}

const todoSchema =  new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Complete', 'Incomplete'],
        default: 'Incomplete',
        required: true,
    },
    user: {
        id: {
            type: mongoose.Types.ObjectId,
            required: true
        }
    }
})

export const Todo = mongoose.model<TodoItem>('todo',todoSchema)