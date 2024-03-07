import axios from 'axios'
import {getMessages, clearMessages} from './Redux/notificationSlice'

export const fetchNotifications = (page, token) => async (dispatch) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            page: page
        }
    };

    axios.get('http://localhost:3500/notifications', config)
    .then(response => {
        dispatch(getMessages(response.data))
    })
    .catch(error => {
      console.log(error)
    });
}


export const createNotification = (e, notification, token) => async (dispatch) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    axios.post('http://localhost:3500/notifications/create', notification, config)
    .then(response => {
        console.log(response.data)
    })
    .catch(error => {
        console.log(error)
    })
}

export const clearNotifications = (token) => async (dispatch) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    axios.delete('http://localhost:3500/notifications/delete', config)
    .then(response => {
        console.log(response.data)
        dispatch(clearMessages())

    })
    .catch(error => {
        console.log(error)
    })
}

