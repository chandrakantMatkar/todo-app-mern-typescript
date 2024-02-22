import React from 'react'
import { TodoItem } from './ManageItem'

const List: React.FC<TodoItem> = ({ title, description, status }) => {
    const renderFunction = (): JSX.Element => {
        // return people.map(person: => {
        return (<li className='List'>
            <div>{title}</div>
            <p>{description}</p>
            <p>{status}</p>

        </li>)
        // })
    }
    return (
        <ul>
            {renderFunction()}
        </ul>
    )
}

export default List