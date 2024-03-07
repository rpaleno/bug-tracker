import React from 'react'
import ProjectForm from '../Project Form/projectForm'
import {createProject} from '../../../../Controllers/projectController'
import project from '../../../../Models/projectModel'

export default(props) => {
    const projectObject = new project()

    return (
        <div className = 'view-form'>
            <ProjectForm title="Create Project" project={projectObject} func={createProject} close = {props.close} />
        </div>
    )
    
}