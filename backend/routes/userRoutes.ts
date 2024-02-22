import express, { Router } from 'express'
import { getAllUsers, getUserById, postSignUp, updateUser, deleteUser, postForgotPassword, postResetPassword, postLogin } from '../controllers/users';

const router: Router = express.Router();

router.post('/reset-password', postResetPassword);
router.post('/forgot-password', postForgotPassword);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);
router.post('/login', postLogin);
router.post('/signup', postSignUp);
router.get('/:id', getUserById);
router.get('/', getAllUsers);

export default router;