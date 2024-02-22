import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
// import './styles/login.css';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginToken, signUp } from '../features/userSlice';
import { AppDispatch } from '../app/store';

interface ISignup {
    name?: string | undefined,
    username: string | undefined,
    password: string | undefined,
    cpassword?: string | undefined
}

const Login: React.FC = (): JSX.Element => {
    const [isSignup, setIsSignup] = useState(false)
    const [input, setInput] = useState<ISignup>({
        name: '',
        username: '',
        password: '',
        cpassword: ''
    })
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({
            ...input, [e.target.name]: e.target.value
        })
    }

    const handleLogin = async () => {
        try {
            if (isSignup) {
                if (input.password !== input.cpassword) {
                    return toast.error('!Passwords mismatch', { duration: 1500 })
                }
                const { name, username, password }: ISignup = input
                dispatch(signUp({ name, username, password }));
                return navigate('/');
            } else {
                toast.loading('Loading', { duration: 500 });
                const response = await fetch('https://todo-app-server-bwif.onrender.com/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: input.username, password: input.password }),
                });
                const data = await response.json();
                toast.dismiss();
                if (response.ok) {
                    toast.success('Login successful')
                    if (data.authToken) {
                        localStorage.setItem("token", data.authToken);
                        dispatch(getLoginToken())
                        navigate('/');
                    }
                } else {
                    toast.error('Login Failed.')
                    const data = await response.json();
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('An unexpected error occurred')
        }
    };

    const handleForgotPassword = async () => {
        const toastId = toast.loading('Loading');
        try {
            const response = await fetch('https://todo-app-server-bwif.onrender.com/api/user/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: input.username }),
            });
            if (response.ok) {
                toast.success(`Password reset link has been sent to your email address: ${input.username}`, { id: toastId });
            } else {
                const data = await response.json();
                toast.error(`Could not send reset link to your email. ${data.error}`, { id: toastId })
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('An unexpected error occurred', { id: toastId })
        }
    }

    const handleSignUp = () => {
        setIsSignup(!isSignup);
    }

    return (
        <div className='login-container'>
            <Toaster reverseOrder={false} />
            <h2>Login</h2>
            <form action="#" method="post">
                {isSignup && <div className='signup-fields-container'>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required onChange={handleChange} />
                </div>}

                <div className='signup-fields-container'>

                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required onChange={handleChange} />
                </div>
                <div className='signup-fields-container'>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required onChange={handleChange} />
                </div>

                {isSignup && <div className='signup-fields-container'>
                    <label htmlFor="password">Confirm Password</label>
                    <input type="password" id="cpassword" name="cpassword" required onChange={handleChange} />
                </div>}

                {!isSignup ? <div className="form-options">
                    <Link to="#" className="forgot-password" onClick={handleForgotPassword}>
                        Forgot Password?
                    </Link>
                    <Link to="#" className='sign-up' onClick={handleSignUp}>Sign Up</Link>
                </div> : <div> <Link to="#" className='sign-up' onClick={handleSignUp}>Log In</Link></div>}
                <button type="button" onClick={handleLogin}>
                    {!isSignup ? 'Login' : 'SignUp'}
                </button>
            </form>
        </div>
    )
}

export default Login