import React from 'react'
import { TodoItem } from './ManageItem'
import { useNavigate } from 'react-router-dom'
import { INavigateState } from '../interfaces';
import useTruncateText from '../Hooks/useTruncateText';


const ListItem: React.FC<TodoItem> = ({ _id, title, description, status }) => {
    const navigate = useNavigate();
    
    const truncatedDescription =  useTruncateText(description,100);
    const truncatedTitle =  useTruncateText(title as string,40);
    const handleClick = (id: string | undefined) => {
        const navigateStateData: INavigateState = {id:_id, newItem: false }
        navigate(`/manage-todo/?id=${id}`, { state: navigateStateData,  })
    }
    return (
        <div className='todo-item-small'>
            <input type="checkbox" name="status" id="status" defaultChecked={status==='Complete'} />
            <div>
                <h4>{truncatedTitle}</h4>
                <p>{truncatedDescription}</p>
            </div>
            {/* <Link to='/manage-todo' >
        </Link>  */}
            <button onClick={() => handleClick(_id)}>VIEW</button>
        </div>
    )
}

export default ListItem