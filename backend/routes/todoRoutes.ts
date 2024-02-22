import express, { Router } from 'express'
import { editTodoById, getAllTodos, getTodoById, createNewTodo, deleteTodoById } from '../controllers/todo';
import fetchUser from '../Middleware/fetchuser';

const router: Router = express.Router();

router.post('/create-todo',fetchUser, createNewTodo)
router.delete('/:id',fetchUser, deleteTodoById)
router.put('/:id',fetchUser, editTodoById)
router.get('/:id',fetchUser, getTodoById)
router.get('/',fetchUser, getAllTodos)

export default router;