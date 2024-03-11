import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import Login from './Views/Pages/Login/login'
import SignUp from './Views/Pages/Sign Up/signUp';
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom'
import Sidebar from './Views/Components/Sidebar/sidebar'
import Bugs from './Views/Pages/Bugs/bugs'
import Projects from './Views/Pages/Projects/projects';
import Team from './Views/Pages/Team/team';
import Dashboard from './Views/Pages/Dashboard/dashboard'
import Invites from './Views/Pages/Invites/invites';
import Activity from './Views/Pages/Activity/activity'
import Alerts from './Views/Pages/Alerts/alerts'
import ForgotPassword from './Views/Pages/Forgot Password/forgotPassword';
import ResetPassword from './Views/Pages/Reset Password/resetPassword';
import Loading from './loading'
import axios from 'axios';
import {signIn} from './Controllers/Redux/authSlice'
import { io } from 'socket.io-client';
import { markActivity } from './Controllers/Redux/notificationSlice';


function App() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const prevPathFromLocalStorage = localStorage.getItem('prevPath');
  const [prevPath] = useState(prevPathFromLocalStorage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          withCredentials: true
        };
        const response = await axios.post('http://localhost:3501/auth/token', {}, config)
        //console.log(response.data)
        //console.log(response.data.user)
        dispatch(signIn(response.data))
        setIsLoading(false)
        
        const socket = io('http://localhost:3502')
        socket.on('connect', () => {
            //emit the 'setUsername' event after the connection is established
            socket.emit('setUsername', response.data.user)
          })

  
        socket.on('notification', (notification) => {
            if (notification.type === 'activity') {
                dispatch(markActivity())
                console.log('Activity Notification:', notification.message);
            } 
            
    });
      } catch (error) {
        setIsLoading(false)
      }
    }
    fetchData();
  },[]);

  
  if (isLoading) {
    return (
      <Loading />
    );
  }


  const PublicRoute = ({ element: Element }) => {
    return !auth.authorized ? Element : <Navigate to={prevPath} />;
  };

  const PrivateRoute = ({ element: Element }) => {
    const location = useLocation();

    useEffect(() => {
      localStorage.setItem('prevPath', location.pathname);
    }, [auth, location]); 
    //return the Dashboard component if authorized, otherwise, navigate to the login page
    return auth.authorized ? Element: <Navigate to="/login"/>;
  };

  return (
    <Router>
      {auth.authorized && <Sidebar/>}
      <Routes>
        {/* public routes */}
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/signup" element={<SignUp/>} />
        <Route exact path="/forgot_password" element={<ForgotPassword/>} />
        <Route exact path="/reset-password" element={<ResetPassword/>} />
        <Route path="/login" element={<PublicRoute element={<Login/>}/>} />

        {/* protected routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard/>}/>} />
        <Route path="/projects" element={<PrivateRoute element={<Projects/>}/>} />
        <Route path="/bugs" element={<PrivateRoute element={<Bugs/>}/>} />
        <Route path="/invites" element={<PrivateRoute element={<Invites/>}/>} />
        <Route path="/activity" element={<PrivateRoute element={<Activity/>}/>} />
        <Route path="/alerts" element={<PrivateRoute element={<Alerts/>}/>} />
        <Route path="/team" element={<PrivateRoute element={<Team/>}/>} />
      </Routes>
    </Router>
  );
}

export default App;