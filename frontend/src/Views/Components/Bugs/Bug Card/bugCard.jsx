import React from 'react'
import PriorityController from '../../../../Controllers/priorityController'
import './bugCard.css'

export default (props)=>{
    const {_id, name, priority, version} = props.bug;
  
    const {color} = PriorityController(priority);

    function Clicked(){
        props.clicked(_id); 
    }
    
    return (
        <div className='bug-card' onClick={Clicked}>
          <h2 className='name'>{name}</h2>
          <h5 className='version'>{version}</h5>
          <div className='priority-circle' style={{ backgroundColor: color }}></div>
        </div>
    );
}