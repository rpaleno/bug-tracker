import React from 'react'
import './editPanel.css'

export default (props)=>{
    
    return(
        <div className='edit-panel'>
            {props.status === 'pending' && props.name === props.sender && (
                <button className='edit-button' onClick={props.editClicked}>Edit</button>
            )}

            {props.name === props.sender && (
                <button onClick={props.deleteClicked} className='delete-button'>Delete</button>
            )}
            
        </div>
   
    )
}