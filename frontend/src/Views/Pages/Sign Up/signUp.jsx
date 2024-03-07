import React, { useState } from  'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../../../Controllers/Redux/authSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './signUp.css'

export default () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formInput, setFormInput] = useState({
        email: "",
        name:"",
        password:"",
        verifiedPassword:""
    });
    const [error, setError] = useState();

    function inputChanged(e){
        setFormInput({
            ...formInput,
            [e.target.name]:e.target.value
        })
    }

    async function submit(e){

        if (!formInput.email || !formInput.name || !formInput.password || !formInput.verifiedPassword) {
            return 
        }
        
        e.preventDefault(); //prevents page from reloading

        if (formInput.password !== formInput.verifiedPassword) {
            setError("passwords do not match")
            return
        }


       

        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
        };
        try {
            const response = await axios.post('http://localhost:3501/auth/create_user', formInput, header);
            console.log(response);
            
            
            const login = await axios.post('http://localhost:3501/auth/login', formInput, header)
            const config = {
                token: login.data.accessToken,
                user: formInput.name,
            }
            dispatch(signIn(config));
            navigate('/dashboard'); //redirect to dashboard
            

        } catch (error) {
            console.log(error.response.data);
            setError(error.response.data)

        }
        
    
    }

    function errorHandler(error) {
        let response;

        if (error === "passwords do not match")
            response = "Passwords do not match. Try again"

        else if (error === "Email already exists") {
            response = "Email is already associated with a user"
        }

        else if (error === "Username already exists")
            response = "Username already taken"

        return response
            
    }

    return (
        <div className="sign-upBG">
            <form className='sign-up-panel'>
                <h1>Sign Up</h1>
                <input required name='email' placeholder='email' onChange={inputChanged} value={formInput.email}></input>
                <input required name='name' placeholder='username' onChange={inputChanged} value={formInput.name}></input>
                <input required name='password' type='password' placeholder='Password'  onChange={inputChanged} value={formInput.password}></input>
                {formInput.password && (
                    <input required name='verifiedPassword' type='password' placeholder='Confirm Password' onChange={inputChanged} value={formInput.verifiedPassword}/>
                )}
                {error && (
                    <h5>{errorHandler(error)}</h5>
                )}
                <button type='submit'onClick={submit}>Sign Up</button>
            </form>
        </div>
    )
}
