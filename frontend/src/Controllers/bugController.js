import {getPaginatedBugs, getAllBugs, addBug, deleteBug, updateBug, updateMark} from './Redux/bugSlice'
import { createActivity } from './activityController';
import { createNotification } from './notificationController';
import { getActivityTime, getActivityDate } from '../Utilities/timestamp';
import Notification from '../Models/notificationModel'
import { io } from 'socket.io-client';
import axios from 'axios'

//fetch all bugs (chart)
export const fetchBugs = (project, role, token) => async (dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      projectID: project._id,
      role: role,
    }
  };
  let bugs = [];

  try {
    const response = await axios.get('http://localhost:3500/bugs', config);
    bugs = response.data;
  } catch (error) {
    console.log(error);
  }
  dispatch(getAllBugs(bugs));
};

//fetch paginated bugs
export const paginateBugs = (project, filter, page, token) => async (dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      projectID: project._id,
      role: filter.role,
      sortBy: filter.sortBy,
      view: filter.view,
      page: page
    }
  };

  try {
    const response = await axios.get('http://localhost:3500/bugs', config);
    //console.log(response.data)
    dispatch(getPaginatedBugs(response.data))
  } catch (error) {
      return [];
  }
};

export const createBug = (e, bug, token) => async (dispatch) => {
    const header = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
  
    try {
        e.preventDefault()
        const createdBug = await axios.post('http://localhost:3500/bugs/create', bug, header);
        dispatch(addBug(createdBug.data))
        
        const activityObject = {
          name: 'Created Bug',
          details: `${bug.name}`,
          user: '',
          recipient: createdBug.data.assigned,
          project: bug.project._id,
          time: getActivityTime(),
          date: getActivityDate(new Date()),
        }

        const notification = new Notification()
        notification.type = `New Bug Assigned: ${bug.name}`
        notification.details = `Project: ${bug.project.name}`
        notification.user = createdBug.data.assigned;
        notification.date = getActivityDate(new Date())
        notification.time = getActivityTime()
        
        dispatch(createActivity(activityObject, token))
        dispatch(createNotification(e, notification, token))
        
        const socket = io('http://localhost:3502')
        socket.emit('createActivity', 'jsmith')
    } catch (error) {
        console.log(error)
    };
}


export const editBug = (e, bug, token) => async (dispatch) => {
    e.preventDefault();
    const header = {
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
    };

    try {
    const response = await axios.put('http://localhost:3500/bugs/update', bug, header);
    console.log(response.data)
    dispatch(updateBug(response.data))
    const activityObject = {
      name: 'Updated Bug',
      details: `${bug.name}`,
      user: '',
      project: bug.project,
      time: getActivityTime(),
      date: getActivityDate(new Date()),
    }
    
    dispatch(createActivity(activityObject, token))
    } catch (error) {
    console.log(error)
    }
}

export const removeBug = (e, bug, token) => async (dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      _id: bug._id
    }
  };
  try {
    const response = await axios.delete('http://localhost:3500/bugs/delete', config);
    dispatch(deleteBug(response.data));
    const activityObject = {
      name: 'Deleted Bug',
      details: `${bug.name}`,
      user: '',
      project: bug.project,
      time: getActivityTime(),
      date: getActivityDate(new Date()),
    }
    
    dispatch(createActivity(activityObject, token))
  } catch (error) {
    console.log(error);
  }
}

export const markBug = (e, bug, token) => async (dispatch) => {
    let updatedBug;

    if (bug.dateCompleted === "") {
      console.log('updated')
      updatedBug = { ...bug, dateCompleted: getActivityDate(new Date())};
    }

    else {
      updatedBug = { ...bug, dateCompleted: ''};
    }
    
    dispatch(editBug(e, updatedBug, token));
    dispatch(updateMark(updatedBug));
    const activityObject = {
      name: 'Changed Bug Status',
      details: `${bug.name}`,
      user: '',
      project: bug.project,
      time: getActivityTime(),
      date: getActivityDate(new Date()),
    }

    dispatch(createActivity(e, activityObject, token))
}

