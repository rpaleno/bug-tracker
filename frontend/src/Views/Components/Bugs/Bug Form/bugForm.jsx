import React,{useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'


export default (props)=>{
    const dispatch = useDispatch();
    const token = useSelector(state=>state.auth.token);
    const [bugObject,setBugObject] = useState(props.bug);
    const [members] = useState(props.project.members);

    function inputChanged(e){
        setBugObject({
            ...bugObject,
            [e.target.name]:e.target.value
        })
    }

    function handleSubmit(e) {
        console.log(bugObject)
        dispatch(props.func(e, bugObject, token))
        console.log(members)
    }

    return(
        <div className='bug-form'>
            {props.title === "Edit Bug" && <button className='close-btn' onClick={props.close}>Close</button>}
            <h1>{props.title}</h1>
            <form>
                <label>Name:</label>
                <input name='name' placeholder='Bug Name' required onChange={inputChanged} value={bugObject.name}/>
                <label>Details:</label>
                <textarea name='details' placeholder='Detailed description of the bug' required onChange={inputChanged} value={bugObject.details}></textarea>
                <label>Steps:</label>
                <textarea name='steps' placeholder='Steps to recreate the bug' required onChange={inputChanged} value={bugObject.steps}></textarea>
                <label>Priority:</label>
                <select name='priority' required onChange={inputChanged} value={bugObject.priority}>
                    <option value=''>- select -</option>
                    <option value='1'>High</option>
                    <option value='2'>Mid</option>
                    <option value='3'>Low</option>
                </select>
                <label>Assigned</label>
                <select name='assigned' required onChange={inputChanged} value={bugObject.assigned} >
                    <option value=''>- select -</option>
                    {members.map((user) => (
                        <option key={user.user.name} value={user.user._id}>
                            {user.user.name}
                        </option>
                    ))}
                </select>
                <label>Application Version:</label>
                <input name='version' placeholder='Application Version' required onChange={inputChanged} value={bugObject.version} />
                <button type='submit' onClick={(e) => handleSubmit(e)}>{props.title}</button>
            </form>
        </div>
    )
}