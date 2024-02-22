import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../app/store';
import { fetchTodos } from '../features/todoSlice';
import { TodoItem } from './ManageItem';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './styles/home.css';
import { INavigateState } from '../interfaces';
import useAuth from '../Hooks/useAuth';
import ListItem from './ListItem1';


const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchStatus = useSelector((state: RootState) => state.todo.isPending);
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate('/login')
    }
      dispatch(fetchTodos())
  }, [fetchStatus, dispatch, isAuthenticated, navigate, location.pathname ])

  const todos: TodoItem[] = useSelector((state: RootState) => state.todo.value);


  const handleClick = () => {
    const navigateStateData: INavigateState = { id: '', newItem: true }
    console.log(navigateStateData, { id: '', newItem: true });
    navigate('/manage-todo', { state: navigateStateData })
  }

  return (
    <div className='todo-list-container'>
      <div>
        {todos.slice(0, 4).map(todo => {
          return <ListItem key={todo._id} _id={todo._id} title={todo.title} status={todo.status} description={todo.description} />
        })}
      </div>
      <Link className='home-link-text' to='/view-all'>View All</Link>
      <div className='home-link-button'><button onClick={handleClick}>Create Todo</button></div>
    </div>

  )
}

export default Home