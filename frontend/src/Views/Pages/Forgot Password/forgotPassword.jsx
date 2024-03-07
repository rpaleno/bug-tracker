import React, { useState } from  'react'
import axios from 'axios';
import './forgotPassword.css'

export default () => {
    const [completed, setCompleted] = useState(false)
    const [error, setError] = useState()

    const [formInput, setFormInput] = useState({
        email: "",
    })

    function inputChanged(e){
        setFormInput({
            ...formInput,
            [e.target.name]:e.target.value
        })
    }

    async function submit(e){
        if (!formInput.email) {
            return 
        }
        e.preventDefault() //prevent page reload
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }
        try {
            const response = await axios.post('http://localhost:3501/auth/reset_password', formInput, header)
            console.log(response.data)
            setCompleted(true)
        } catch (error) {
            console.log(error.response.data)
            setError(error.response.data)
        }
    }

    function errorHandler(error) {
        let response;

        if (error === "Email not found") {
            response = error;
        }

        return response
    }

    return (
        <div className="formBG">
            {completed ? (
                    <div className ="confirmation-page">
                        <h1>Success!</h1>
                        <p>Your password reset request has been received. Check your email for the reset link.</p>
                        <div className="links">
                            <a href="/login">Login</a>
                        </div>
                    </div>  
                ) : (
            <form className='form-panel'>
                <h1>Recover Password</h1>
                <input required name='email' placeholder='email' onChange={inputChanged} value={formInput.email}></input>
        
                {error && (
                    <h5>{errorHandler(error)}</h5>
                )}
                <button type='submit'onClick={submit}>Submit</button>
            </form>
          )}
        </div>
    )
}
