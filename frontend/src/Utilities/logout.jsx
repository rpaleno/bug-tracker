import {logout as clearAuthState} from '../Controllers/Redux/authSlice'
import {clearProjects as clearProjectState} from '../Controllers/Redux/projectSlice'
import {clearBugs as clearBugState} from '../Controllers/Redux/bugSlice'
import {clearInvites as clearInviteState} from '../Controllers/Redux/inviteSlice'
import {logout as clearActivityState} from '../Controllers/Redux/activitySlice'
import axios from 'axios';

const signOut = () => async (dispatch) => {
    const config = {
        withCredentials: true
    }
    try {
        await axios.post('http://localhost:3501/auth/logout', {}, config);
        dispatch(clearAuthState());
        dispatch(clearProjectState());
        dispatch(clearBugState());
        dispatch(clearInviteState());
        dispatch(clearActivityState());
    } catch (error) {
        console.log(error);
    } 
  };

  export default signOut;