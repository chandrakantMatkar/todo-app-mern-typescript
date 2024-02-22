import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTodoItem, deleteTodoById, updateTodoById } from '../features/todoSlice'
import { AppDispatch, RootState } from '../app/store'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

export interface TodoItem {
  _id?: string | undefined,
  title: string,
  description: string,
  status: 'Complete' | 'Incomplete'
}

const ManageItem: React.FC = (): JSX.Element => {
  const [input, setInput] = useState<TodoItem>({
    title: '',
    description: '',
    status: 'Incomplete'
  });
  const [searchParams, setSearchParams] = useSearchParams()
  const queryId = searchParams.get('id') as string

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const todos: TodoItem[] = useSelector((state: RootState) => state.todo.value);
  const todo = todos.find(todo => todo._id === queryId);

  useEffect(() => {
    console.log('use effect ran')
    setInput(todo as TodoItem);
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput({
      ...input, [e.target.name]: e.target.value
    })
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = queryId;
    toast.success('Todo Item Deleted');
    dispatch(deleteTodoById({ id }));
    navigate('/')
    setInput({
      title: '',
      description: '',
      status: 'Incomplete'
    })

  }
  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { title, description, status } = input;
    const id = queryId;
    if (!input.title || !input.description) return
    dispatch(updateTodoById({ id, title, description, status }));
    toast.success('Todo Saved');
    navigate('/')
    setInput({
      title: '',
      description: '',
      status: 'Incomplete'
    })
  }

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { title, description, status } = input;
    if (!input.title || !input.description) return
    dispatch(addTodoItem({ title, description, status }));
    toast.success('Todo Item Created');
    navigate('/')
    setInput({
      title: '',
      description: '',
      status: 'Incomplete'
    })
  }

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.checked ? 'Complete' : 'Incomplete' })
  }


  return (
    <div className='todo-manage-container'>
      <Toaster></Toaster>
      <div className='status-div'>
        <label htmlFor="status">
          FINISH
        </label>
        <input onChange={handleCheck} checked={input?.status === 'Complete'} type="checkbox" name="status" id="status" />
      </div>
      <div className='info-div'>
        <label htmlFor="title">TITLE</label>
        <input onChange={handleChange} placeholder='Title' name='title' value={input?.title} type="text" className='text-inputs' />
        <label htmlFor="description">DESCRIPTION</label>
        <textarea onChange={handleChange} placeholder='Description' value={input?.description} className='text-inputs' name="description" id="" cols={25} rows={10}></textarea>
        <button className='update-button' onClick={!queryId ? handleCreate : handleUpdate}>{!queryId ? `CREATE` : `UPDATE`}</button>
        <button className='delete-button' onClick={handleDelete}>DELETE</button>
      </div>
    </div>
  )
}

export default ManageItem