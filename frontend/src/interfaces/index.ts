export interface TodoItemRoot{
    _id?:string|undefined
    title: string,
    description: string,
    status: 'Complete' | 'Incomplete'
}

export interface TodoStateRoot{
    value: TodoItemRoot[],
    isPending:boolean,
}

export interface INavigateState{
    id?:string|undefined,
    newItem:Boolean
}

export interface TodoUpdateOrDelete{
    id?:string,
    title?: string,
    description?: string,
    status?: 'Complete' | 'Incomplete'
}