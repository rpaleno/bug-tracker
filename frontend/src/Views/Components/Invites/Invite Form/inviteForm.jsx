import React,{useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import '../../Bugs/Bug Form/bugForm.css'

export default (props)=>{
    const dispatch = useDispatch();
    const token = useSelector(state=>state.auth.token)
    const [inviteObject,setInviteObject] = useState(props.invite);

    function inputChanged(e){
        setInviteObject({
            ...inviteObject,
            [e.target.name]:e.target.value
        })
    }

    return(
        <div className='page-container'>
            <div className = 'view-form'>
                <div className='bug-form'>
                    {props.title === "Edit Invite" && <button className='close-btn' onClick={props.close}>Close</button>}
                    <h1>{props.title}</h1>
                    <form>
                        <label>Role:</label>
                        <select name='role' required onChange={inputChanged} value={inviteObject.role}>
                            <option value=''>- select -</option>
                            <option value='Admin'>Admin</option>
                            <option value='Developer'>Developer</option>
                            <option value='Tester'>Tester</option>
                        </select>
                        <button type='submit' onClick={(e) => {dispatch(props.func(e, inviteObject, token))} }>{props.title}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}