import React from 'react'
import './inviteCard.css'
import PriorityController from '../../../../Controllers/priorityController';

export default (props)=>{
    const id = props.invite._id
    const {name, priority} = props.invite.project;
    const {color} = PriorityController(priority);

    function Clicked(){
        props.clicked(id);
    }
    
    return (
        <div className='invite-card' onClick={Clicked}>
          <h2 className='name'>{name}</h2>
          <h5 className='role'>{props.invite.role}</h5>
          <div className='priority-circle' style={{ backgroundColor: color }}></div>
        </div>
      );
}