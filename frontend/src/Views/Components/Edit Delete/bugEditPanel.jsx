import React from 'react'
import './editPanel.css'

export default (props)=>{
    
    return(
        <div className='edit-panel'>
            {props.completed === "" && (
                <button className='edit-button' onClick={props.editClicked}>Edit</button>
            )}

            {props.name === props.sender && (
                <button onClick={props.deleteClicked}>Delete</button>
            )}
        </div>
    )
}