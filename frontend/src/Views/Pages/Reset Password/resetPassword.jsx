import React, {useEffect, useState} from  'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './resetPassword.css'

export default () => {
    const navigate = useNavigate();
    const[completed, setCompleted] = useState(false)
    const [error, setError] = useState();
    const [countdown, setCountdown] = useState(5);
    const [token, setToken] = useState();
    const location = useLocation();
    const [formInput, setFormInput] = useState({
        password: "",
        verifiedPassword: ""
    });

    function inputChanged(e){
        setFormInput({
            ...formInput,
            [e.target.name]:e.target.value
        })
    }

    useEffect(() => {
        if (completed) {
            const countdownTimer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            setTimeout(() => {
                clearInterval(countdownTimer);
                navigate('/login'); //redirect to the login page
            }, 5000);
        }
    }, [completed, navigate]);

    useEffect(() => {
        //parse the URL search parameters to get the token
        const searchParams = new URLSearchParams(location.search);
        setToken(searchParams.get('token'))
        console.log('yes')

    }, [location.search, location]);


    async function submit(e) {
        if (!formInput.password || !formInput.verifiedPassword) {
            return 
        }

        e.preventDefault(); //prevents page from reloading

        if (token) {
            const header = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            };

            console.log(token)

            try {
                const response = await axios.put('http://localhost:3501/auth/user', formInput, header);
                console.log(response.data);
                setCompleted(true)
    
            } catch (error) {
                console.log(error.response.data);
                setError(error.response.data)
    
            }

        }
        
        else {
            console.log('didnt submit')
            console.log(token)
        }
    }

    function errorHandler(error) {
        let response;

        if (error === "")
            response = error;


        return response
    }

    return (
            <div className="formBG">
                {completed ? (
                    <div className ="confirmation-page">
                        <h1>Success!</h1>
                        <h4>redirecting to login in {countdown}</h4>
                        <div className="links">
                            <a href="/login">Login</a>
                        </div>
                    </div>  
                ) : (
                    <form className='form-panel'>
                        <h1>Reset Password</h1>
                        <input required name='password' type='password' placeholder='New Password'  onChange={inputChanged} value={formInput.password}></input>
                        <input required name='verifiedPassword' type='password' placeholder='Confirm Password'  onChange={inputChanged} value={formInput.verifiedPassword}></input>
                
                        {error && (
                            <h5>{errorHandler(error)}</h5>
                        )}
                        <button type='submit'onClick={submit}>Submit</button>
                    </form>
                )}
            </div>

     
    )
}
