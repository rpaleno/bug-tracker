import React,{useEffect, useState} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {fetchBugs} from '../../../Controllers/bugController'
import {fetchProjects} from '../../../Controllers/projectController'
import { fetchActivity } from '../../../Controllers/activityController'
import { clearActivity } from '../../../Controllers/Redux/activitySlice'
import RecentActivity from '../../Components/Dashboard/activity/activity'
import Chart from '../../Components/Dashboard/chart/chart'
import Members from '../../Components/Dashboard/members/members'
import './dashboard.css'

export default ()=>{
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)
  const projects = useSelector((state) => state.projects.all)
  const bugs = useSelector((state) => state.bugs.all)
  const timelineData = useSelector(state => state.activity)
  const [projectIndex, setProjectIndex] = useState()
  const [selectedProject, setSelectedProject] = useState()
  const [members, setMembers] = useState([])
  
  useEffect(()=>{
    dispatch(fetchProjects(token))
  }, [])
  
  useEffect(() => {
    return () => {
        dispatch(clearActivity());
    };
}, [dispatch]);

  //on page visit
  useEffect(() => {
      const idx = localStorage.getItem('dashboardIndex')
      if (idx === null || (projects.length && idx > projects.length - 1)) {
        localStorage.setItem('dashboardIndex', 0)
        setProjectIndex(0)
      }
      else {
        setProjectIndex(idx)
      }
      setSelectedProject(projects[projectIndex])
  }, [projects])

  //switching project
  useEffect(()=>{
    if (projects && projectIndex) {
      setSelectedProject(projects[projectIndex])
      localStorage.setItem('dashboardIndex', projectIndex);
    }
  }, [projects, projectIndex])


  //updating project info
  useEffect(() => {
    if(selectedProject) {
      const member = selectedProject.members.find(member => member.user.name === user)
      let role;
      if (member) {
        role = member.role
      }
      else if (user === selectedProject.creator.name) {
        role = 'admin'
      }

      dispatch(fetchActivity(token, selectedProject._id))
      dispatch(fetchBugs(selectedProject, role, token))
      setMembers(selectedProject.members)
    }
  }, [selectedProject])

  const handleProjectChange = (event) => {
    setProjectIndex(event.target.value);
  }

  return(
    <div className='page-container'>
      <div className='dashboard-filter'>
        <select value={projectIndex} onChange={handleProjectChange}>
          {projects.map((project, index) => (
          <option key={project._id} value={index}>
              {project.name}
          </option>
          ))}
        </select>
      </div>

      <RecentActivity activity = {timelineData} project = {selectedProject}/>

      <div className = 'analytics'>
        <Members members = {members}/>
        <Chart bugs = {bugs}/>
      </div>
       
    </div>

  )
}