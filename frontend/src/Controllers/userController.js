import {getUsers} from './Redux/userSlice'
import axios from 'axios'

export const fetchUsers = () => async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:3500/auth/')
      dispatch(getUsers(response.data))
    } catch (error) {
      console.log(error);
    }
  }