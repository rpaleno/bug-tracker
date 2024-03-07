import axios from 'axios'
import {addActivity, getActivity, deleteActivity} from './Redux/activitySlice'

export const fetchActivity = (token, projectId) => async (dispatch) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            id: projectId,
        }
    };

    axios.get('http://localhost:3500/activity', config)
    .then(response => {
        dispatch(getActivity(response.data))
    })
    .catch(error => {
      console.log(error)
    });
  }


export const createActivity = (activity, token) => async (dispatch) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    axios.post('http://localhost:3500/activity/create', activity, config)
    .then(response => {
        console.log(response.data)
        dispatch(addActivity(response.data))
    })
    .catch(error => {
        console.log(error)
    })
}

export const removeActivity = (e, activity, token) => async (dispatch) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            _id: activity._id
        }
            
    };

    axios.delete('http://localhost:3500/activity/delete', activity, config)
    .then(response => {
        console.log(response.data)
        dispatch(deleteActivity(response.data))

    })
    .catch(error => {
        console.log(error)
    })
}

