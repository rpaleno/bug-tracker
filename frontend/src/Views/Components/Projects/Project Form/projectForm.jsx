import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

export default (props)=>{
    const dispatch = useDispatch();
    const token = useSelector(state=>state.auth.token)
    const [projectObject,setProjectObject] = useState(props.project);


    function inputChanged(e){
        setProjectObject({
            ...projectObject,
            [e.target.name]:e.target.value
        })
    }

    return(
        <div className='page-container'>
            <div className = 'view-form'>
                <div className='create-form'>
                    {props.title === "Edit Project" && <button className='close-btn' onClick={props.close}>Close</button>}
                    <h1>{props.title}</h1>
                    <form>
                        <label>Name:</label>
                        <input name='name' placeholder='Project Name' required onChange={inputChanged} value={projectObject.name}/>
                        <label>Details:</label>
                        <textarea name='details' placeholder='Detailed description of the project' required onChange={inputChanged} value={projectObject.details}></textarea>
                        <label>Priority:</label>
                        <select name='priority' required onChange={inputChanged} value={projectObject.priority}>
                            <option value=''>- select -</option>
                            <option value='1'>High</option>
                            <option value='2'>Mid</option>
                            <option value='3'>Low</option>
                        </select>
                        <button type='submit' onClick={(e) => {props.close() || dispatch(props.func(e, projectObject, token))} }>{props.title}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}