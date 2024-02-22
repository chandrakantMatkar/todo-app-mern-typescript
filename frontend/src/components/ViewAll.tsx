import React, { useEffect } from 'react'
import { TodoItem } from './ManageItem';
import { AppDispatch, RootState } from '../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos } from '../features/todoSlice';
import ViewAllItems from './ViewAllItems';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const ViewAll = () => {
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = useSelector((state: RootState) => state.todo.isPending)
    const isAuthenticated = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            return navigate('/login')
        }
        // if (fetchStatus) {
        dispatch(fetchTodos())
        // }
    }, [fetchStatus, isAuthenticated, dispatch, location.pathname, navigate])

    const todos: TodoItem[] = useSelector((state: RootState) => state.todo.value);

    return (
        <div className='view-all-supreme'>
            <div className='view-all-container'>
                {todos.map(todo => {
                    return <ViewAllItems key={todo._id} _id={todo._id} title={todo.title} status={todo.status} description={todo.description} />
                })}
            </div>
        </div >
    )
}

export default ViewAll