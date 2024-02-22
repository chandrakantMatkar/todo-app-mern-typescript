import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { RootState } from "../app/store";

interface IUser {
    loggedIn: Boolean,
    name?: string | undefined,
    username?: string | undefined,
    token?:string|undefined
}

export interface ISignUp {
    password: string | undefined,
    name?: string | undefined,
    username?: string | undefined,
}

const initialState: IUser = {
    loggedIn: false,
    name: '',
    username: '',
    token:''
}

export const fetchUser = createAsyncThunk('fetchUser', async (_,thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) return
    (thunkAPI.getState() as RootState).user.token = token;
    (thunkAPI.getState() as RootState).user.loggedIn = true;
})

export const signUp = createAsyncThunk('signUp', async ({name, username, password }:ISignUp, initialValues) => {
    try {
        const msg = toast.loading('creating user...')
        const response = await fetch('https://todo-app-server-bwif.onrender.com/api/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email:username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            if (data.authToken) {
                console.log('signup successful', data.authToken);
                localStorage.setItem("token", data.authToken);
                toast.success('User created sucessfully.',{id: msg})
                // navigate('/');
            }
        } else {
            const data = await response.json();
        }
    } catch (error) {

    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getLoginToken: (state) => {
            const token = localStorage.getItem('token');
            if (!token) return
            state.loggedIn = true;
            state.token = token
        },
        logout:(state) => {
            state.loggedIn = false;
            state.token = '';
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state) => {
            state.name = 'name';
        });
        builder.addCase(signUp.fulfilled,(state, action:PayloadAction)=>{
            state.loggedIn = true;
            getLoginToken();
        })
    }
})


export const { getLoginToken, logout } = userSlice.actions;

export default userSlice.reducer