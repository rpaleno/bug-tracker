import {getPaginatedInvites, addInvite, updateInvite, deleteInvite} from './Redux/inviteSlice'
import { createActivity } from './activityController';
import { createNotification } from './notificationController';
import { getActivityTime, getActivityDate } from '../Utilities/timestamp';
import Notification from '../Models/notificationModel'
import { io } from 'socket.io-client';
import axios from 'axios'

export const createInvite = (e, invite, token) => async (dispatch) => {
    //e.preventDefault(); //prevents page from reloading

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    
    try {
        const response = await axios.post('http://localhost:3500/invite/create', invite, config)
        const createdInvite = response.data
        const activityObject = {
          name: 'Created Invite',
          details: `${createdInvite.project.name}`,
          user: '',
          recipient: invite.recipient,
          project: invite.project,
          time: getActivityTime(),
          date: getActivityDate(new Date()),
        }
    
        const notification = new Notification()
        notification.type = `New Invite`
        notification.details = `Project: ${createdInvite.project.name}`
        notification.user = invite.recipient;
        notification.date = getActivityDate(new Date())
        notification.time = getActivityTime()
        
        dispatch(createActivity(activityObject, token))
        dispatch(createNotification(e, notification, token))
        
        const socket = io('http://localhost:3502')
        socket.emit('createActivity', createdInvite.recipient.name)
    } catch (error) {
        console.log(error);
    }
}

export const fetchInvites = (token, filter, page) => async (dispatch) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          sortBy: filter.sortBy,
          status: filter.status,
          page: page,
        }
    };
  
    axios.get('http://localhost:3500/invite', config)
    .then(response => {
      console.log(response.data)
      dispatch(getPaginatedInvites(response.data))
    })
    .catch(error => {
      console.log(error)
    });
}

export const editInvite = (e, invite, token) => async(dispatch) => {
    e.preventDefault();
    const config = {
      headers: {
          Authorization: `Bearer ${token}`,
      },
    };
  
    try {
    const response = await axios.put('http://localhost:3500/invite/update', invite, config);
    console.log(response.data)
    dispatch(updateInvite(response.data)); //dispatch the getBugs action with the updated bug list
    } catch (error) {
    console.log(error);
    }
  }


export const removeInvite = (invite, token) => async(dispatch) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          _id: invite._id
        }
      };

      try {
        const response = await axios.delete('http://localhost:3500/invite/delete', config)
        console.log(response.data)
        dispatch(deleteInvite(response.data));
      } catch (error) {
        console.log(error);
      }
}



