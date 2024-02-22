import { Request, Response, NextFunction } from "express";
import { Todo } from "../models/Todo";
import { validationResult } from 'express-validator';

export const getAllTodos = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    try {
        const todos = await Todo.find({
           'user.id': userId
        });
        if (!todos) {
            return res.status(404).send('No todo exist. Please add todos to view')
        }
        res.status(200).json(todos);
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send('No todo exist.')
        }
        if (todo.user.id.toString() !== req.user?.id) {
            return res.status(401).send('Access Denied.')
        }
        res.status(200).json(todo)
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const editTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send('No todo exist. Please add todos to view')
        }
        if (todo.user.id.toString() !== req.user?.id) {
            return res.status(401).send('Access Denied.')
        }
        //to check for the modified fields
        const modifiedFields: { [key: string]: string } = {}
        for (const key in req.body) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                if (todo.get(key) !== req.body[key]) {
                    modifiedFields[key] = req.body[key];
                }
            }
        }
        if (Object.keys(modifiedFields).length <= 0) {
            return res.status(400).send('no changes detected to update');
        }
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, modifiedFields, { new: true })
        res.status(200).json(updatedTodo);
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}
export const deleteTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send('No todo exist. Please add todos to view')
        }
        if (todo.user.id.toString() !== req.user?.id) {
            return res.status(401).send('Access Denied.')
        }
        todo = await Todo.findByIdAndDelete(req.params.id, { new: true });
        res.status(200).json(todo);
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}
export const createNewTodo = async(req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    const { title, description } = req.body;
    try {
        const todo = await Todo.create({
            title, description, user: {id: req.user?.id}
        })
        res.send(todo);
    } catch (err) {
        res.status(500).send({ error: 'Internal server error.' })
    }
}
