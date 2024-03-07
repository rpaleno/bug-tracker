import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { fetchProjects } from '../../../Controllers/projectController'
import { fetchActivity } from '../../../Controllers/activityController'
import { unmarkActivity } from '../../../Controllers/Redux/notificationSlice'
import {clearActivity} from '../../../Controllers/Redux/activitySlice'
import './activity.css'

export default (props) => {
    const [projectIndex, setProjectIndex] = useState()
    const [selectedProject, setSelectedProject] = useState()
    const projects = useSelector((state) => state.projects.all)
    const token = useSelector((state) => state.auth.token)
    const activity = useSelector(state => state.activity)
    const dispatch = useDispatch()
    const rowLength = 19

    useEffect(() => {
        dispatch(fetchProjects(token))
        dispatch(unmarkActivity())
      }, [])

      useEffect(() => {
        return () => {
            dispatch(clearActivity());
        };
    }, [dispatch]);

    //on page visit
    useEffect(() => {
        let projectId
        if (projects[projectIndex]) {
            projectId = projects[projectIndex]._id
            console.log(projectId)
        }

        dispatch(fetchActivity(token, projectId))
    }, [projects, projectIndex])

    //switching project
    useEffect(()=>{
    if (projects && projectIndex) {
        setSelectedProject(projects[projectIndex])
        localStorage.setItem('dashboardIndex', projectIndex);
    }
    }, [projectIndex])

    //updating project info
    useEffect(() => {
        let projectId;
        if (selectedProject) {
            projectId = selectedProject._id
        }
        dispatch(fetchActivity(token, projectId))
    }, [selectedProject])

    const handleProjectChange = (event) => {
        setProjectIndex(event.target.value);
      }

    return (
        <div className='page-container'>
            <div className='filter-container'>
                <select value={projectIndex} onChange={handleProjectChange}>
                    {projects.map((project, index) => (
                    <option key={project._id} value={index}>
                        {project.name}
                    </option>
                    ))}
                </select>

                <table className='activity-table'>
                    <thead>
                        <tr>
                        <th style={{ background: 'black', color: 'white',  border: '1px solid white'}}>Project</th>
                        <th style={{ background: 'black', color: 'white', height: '55px',  border: '1px solid white' }}>User</th>
                        <th style={{ background: 'black', color: 'white',  border: '1px solid white'}}>Activity</th>
                        <th style={{ background: 'black', color: 'white',  border: '1px solid white'}}>Details</th>
                        <th style={{ background: 'black', color: 'white',  border: '1px solid white' }}>Time</th>
                        <th style={{ background: 'black', color: 'white',  border: '1px solid white' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activity.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.project.name}</td>
                            <td>{activity.user}</td>
                            <td>{activity.name}</td>
                            <td>{activity.details}</td>
                            <td>{activity.time}</td>
                            <td>{activity.date}</td>
                        </tr>
                        ))}
                        {activity.length < rowLength && (
                        Array(rowLength - activity.length).fill(null).map((_, index) => (
                            <tr key={`empty-${index}`}>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


