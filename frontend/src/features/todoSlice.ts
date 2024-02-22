import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { TodoItemRoot, TodoStateRoot, TodoUpdateOrDelete } from "../interfaces";
import { RootState } from "../app/store";

const initialState: TodoStateRoot = {
    value: [],
    isPending: true,
}

export const addTodoItem = createAsyncThunk('addTodoItem', async ({ title, description, status }: TodoItemRoot, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).user.token;
    const response = await fetch('https://todo-app-server-bwif.onrender.com/api/todo/create-todo', {
        headers: {
            "content-type": "Application/Json",
            "x-auth-token": token as string
        },
        body: JSON.stringify({ title, description, status }),
        method: "POST"
    })
    return response.json()

})

export const fetchTodos = createAsyncThunk('fetchTodos', async (_, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).user.token;
    const response = await fetch('https://todo-app-server-bwif.onrender.com/api/todo/', {
        headers: {
            "content-type": "Application/Json",
            "x-auth-token": token as string
        },
        method: "GET"
    })
    return await response.json()
})

export const fetchTodoById = createAsyncThunk('fetchTodoById', async (id: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).user.token;
    const response = await fetch(`https://todo-app-server-bwif.onrender.com/api/todo/${id}`, {
        headers: {
            "content-type": "Application/Json",
            "x-auth-token": token as string
        },
        method: "GET"
    })
    return await response.json()
})

export const updateTodoById = createAsyncThunk('updateTodoById', async ({ id, title, status, description }: TodoUpdateOrDelete, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).user.token;
    const response = await fetch(`https://todo-app-server-bwif.onrender.com/api/todo/${id}`, {
        headers: {
            "content-type": "Application/Json",
            "x-auth-token": token as string
        },
        method: "PUT",
        body: JSON.stringify({ title, description, status }),
    })
    return await response.json()
})

export const deleteTodoById = createAsyncThunk('deleteTodoById', async ({ id }: TodoUpdateOrDelete, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).user.token;
    const response = await fetch(`https://todo-app-server-bwif.onrender.com/api/todo/${id}`, {
        headers: {
            "content-type": "Application/Json",
            "x-auth-token": token as string
        },
        method: "DELETE"
    })
    return await response.json()
})

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<TodoItemRoot>) => {
            state.value.push(action.payload);
        },
        clearItems: (state)=>{
            state.value = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoItem.fulfilled, (state, action: PayloadAction<TodoItemRoot>) => {
            state.value.push(action.payload)
        });

        builder.addCase(fetchTodos.pending, (state) => {
            state.isPending = true;
        });

        builder.addCase(fetchTodos.fulfilled, (state, action: PayloadAction<TodoItemRoot>) => {
            state.value = [];
            state.value = state.value.concat(action.payload);
            state.isPending = false;
        });

        builder.addCase(fetchTodoById.pending, (state) => {
            state.isPending = true;
        });

        builder.addCase(fetchTodoById.fulfilled, (state, action: PayloadAction<TodoItemRoot>) => {
            state.value = [];
            state.value = state.value.concat(action.payload);
            state.isPending = false;
        });
        builder.addCase(updateTodoById.pending, (state) => {
            state.isPending = true;
        });

        builder.addCase(updateTodoById.fulfilled, (state, action: PayloadAction<TodoItemRoot>) => {
            let newTodos = JSON.parse(JSON.stringify(state.value))
            for (let index = 0; index < newTodos.length; index++) {
                const element = newTodos[index];
                if (element._id === action.payload._id) {
                    newTodos[index].title = action.payload.title;
                    newTodos[index].description = action.payload.description;
                    newTodos[index].status = action.payload.status;
                    break;
                }
            }
            state.isPending = false;
        });
        builder.addCase(deleteTodoById.pending, (state) => {
            state.isPending = true;
        });

        builder.addCase(deleteTodoById.fulfilled, (state, action: PayloadAction<TodoItemRoot>) => {
            state.value = state.value.filter((todo) => { return todo._id !== action.payload._id })
            state.isPending = false;
        });
    }
})

export const { addItem, clearItems } = todoSlice.actions;

export default todoSlice.reducer;
