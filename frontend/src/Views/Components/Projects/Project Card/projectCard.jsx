import React from 'react'
import './projectCard.css'
import PriorityController from '../../../../Controllers/priorityController';

export default (props)=>{
    const {_id, name, priority, version} = props.project;
  
    const {color} = PriorityController(priority);

    function Clicked(){
        props.clicked(_id); 
    }
    
    return (
        <div className='project-card' onClick={Clicked}>
          <h2 className='name'>{name}</h2>
          <h5 className='version'>{version}</h5>
          <div className='priority-circle' style={{ backgroundColor: color }}></div>
        </div>
      );
}