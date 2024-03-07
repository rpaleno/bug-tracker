import React from 'react'
import BugForm from '../Bug Form/bugForm'
import Bug from '../../../../Models/bugModel'
import {createBug} from '../../../../Controllers/bugController'

export default (props) => {
    const bugObject = new Bug()
    bugObject.project = props.project;

    return(
        <div className='page-container'>
            <div className = 'view-form'>
                <BugForm title="Create Bug" bug={bugObject} func={createBug} project = {props.project}/>
            </div>
        </div>
    )
}