import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { login } from '../../../Controllers/authController';
import { markInvite, markActivity } from '../../../Controllers/Redux/notificationSlice';
import { io } from 'socket.io-client';
import './login.css'

export default ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formInput, setFormInput] = useState({
        name:"",
        password:""
    })

    function inputChanged(e){
        setFormInput({
            ...formInput,
            [e.target.name]:e.target.value
        })
    }

    async function submit(e){
        e.preventDefault(); //prevents page from reloading
        
        try {
            dispatch(login(formInput))
            
            const socket = io('http://localhost:3502')
            socket.on('connect', () => {
                //emit the 'setUsername' event after the connection is established
                socket.emit('setUsername', formInput.name)
              })
            socket.on('notification', (notification) => {
                if (notification.type === 'activity') {
                    dispatch(markActivity())
                    console.log('Activity Notification:', notification.message);
                } 
        });
        
        navigate('/dashboard')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="loginBG">
            <form className = 'login-panel'>
                <h1>Bug Tracker</h1>
                <input name='name' placeholder='Name' onChange={inputChanged} value={formInput.name}></input>
                <input name='password' type='password' placeholder='Password' onChange={inputChanged} value={formInput.password}></input>
                <button type='submit'onClick={submit}>Login</button>
                <div className="links">
                    <a href="/forgot_password">Forgot Password?</a>
                </div>
                <div className="links">
                <a href="/signup">Sign Up</a>
                </div>
            </form>
        </div>
    )
}