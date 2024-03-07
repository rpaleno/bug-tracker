import {getAllProjects, getPaginatedProjects, addProject, updateProject, deleteProject} from './Redux/projectSlice'
import { createActivity } from './activityController';
import { getActivityTime, getActivityDate } from '../Utilities/timestamp';
import axios from 'axios'

export const createProject = (e, project, token) => async (dispatch) => {
    e.preventDefault(); 
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    
    try {
        const response = await axios.post('http://localhost:3500/projects/create', project, config);
        const activityObject = {
          name: 'Created Project',
          details: `${project.name}`,
          user: '',
          project: response.data._id,
          time: getActivityTime(),
          date: getActivityDate(new Date()),
        }

        dispatch(addProject(response.data))
        dispatch(createActivity(activityObject, token))
    } catch (error) {
        console.log(error);
    }
}


//fetch all projects (dropdown menu)
export const fetchProjects = (token) => async(dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      view: "In-Progress"
    }
  };
  const response = await axios.get('http://localhost:3500/projects', config)
  //console.log(response.data)
  dispatch(getAllProjects(response.data))
}

//fetch paginated projects
export const paginateProjects = (filter, page, token) => async(dispatch) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
          sortBy: filter.sortBy,
          view: filter.view
        }
    };

      axios.get('http://localhost:3500/projects', config)
      .then(response => {
        //console.log(response.data)
        dispatch(getPaginatedProjects(response.data))
      })
      .catch(error => {
        console.log(error)
      });
}

export const editProject = (e, project, token) => async(dispatch) => {
  e.preventDefault();
  const config = {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
  };

  try {
  const response = await axios.put('http://localhost:3500/projects/update', project, config);
  console.log(response.data)
  dispatch(updateProject(response.data)); //dispatch the getBugs action with the updated bug list
  const activityObject = {
    name: 'Updated Project',
    details: `${project.name}`,
    user: '',
    project: response.data._id,
    time: getActivityTime(),
    date: getActivityDate(new Date()),
  }
  dispatch(createActivity(activityObject, token))
  } catch (error) {
  console.log(error);
  }
  
}


export const removeProject = (project, token) => async(dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      _id: project._id
    }
  };
  
  try {
    const response = await axios.delete('http://localhost:3500/projects/delete', config)
    dispatch(deleteProject(response.data));
  } catch (error) {
    console.log(error);
  }
}

export const markProject = (e, project, token) => async (dispatch) => {
  const completedDate = new Date()
  const formattedDate = completedDate.toISOString().split('T')[0]
  const updatedProject = { ...project, dateCompleted: formattedDate}
  dispatch(editProject(e, updatedProject, token))
  dispatch(deleteProject(project))
}


