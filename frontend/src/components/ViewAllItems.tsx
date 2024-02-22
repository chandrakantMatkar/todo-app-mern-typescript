import React from 'react'
import './styles/card.css'
import { TodoItem } from './ManageItem'
import { useNavigate } from 'react-router-dom';
import { INavigateState } from '../interfaces';
import useTruncateText from '../Hooks/useTruncateText';

const ViewAllItems:React.FC<TodoItem> = ({_id, title, description, status}) => {

    const truncatedDescription = useTruncateText(description,200);
    const truncatedTitle =  useTruncateText(title as string,20);
    const navigate = useNavigate();

    const handleClick = (id: string | undefined) => {
        const navigateStateData: INavigateState = {id:_id, newItem: false }
        navigate(`/manage-todo/?id=${id}`, { state: navigateStateData })
    }  
      
  return (
    <div className='card'>
        <input type="checkbox" checked={status==='Complete'}/>
        <div className='card-title'>{truncatedTitle}</div>
        <h2 className="card-description">{truncatedDescription}</h2>
        <div className="card-actions">
        <button onClick={() => handleClick(_id)}>VIEW</button>
        </div>
    </div>
  )
}

export default ViewAllItems