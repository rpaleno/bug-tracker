import { signIn } from './Redux/authSlice'
import axios from 'axios'

export const login = (formInput) => async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      withCredentials: true
    }

    try {
      const response = await axios.post('http://localhost:3501/auth/login', formInput, config)
      const credentials = {
        token: response.data.accessToken,
        user: formInput.name,
      }
      dispatch(signIn(credentials))
    } catch (error) {
      console.log(error);
    }
}


export const verifyUser = async (username) => {
  const config = {
    headers: {
        'Content-Type': 'application/json'
    },
  }
  try {
    const response = await axios.post('http://localhost:3500/auth/check_user', {name: username}, config)
    return response.data
  } catch (error) {
      console.log(error)
  }
};