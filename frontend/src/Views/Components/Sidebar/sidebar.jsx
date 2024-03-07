import React from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import signOut from '../../../Utilities/logout'
import NotificationListener from './notificationListener.jsx';
import './sidebar.css'

export default () => {
    const activityFlag = useSelector((state) => state.notification.activity)
    const dispatch = useDispatch()
    const handleSignOut = async () => {
        dispatch(signOut())
    }

    return(
        <div className="sidebar">
            <Link className='nav-link' to="/"><h1 className='brand'>BugTracker</h1></Link>
            <div className="sidebar-links">
                <ul>
                    <li><Link to='/dashboard' className='nav-link'> Dashboard </Link></li>
                    <li><Link to='/projects' className='nav-link'> Projects </Link></li>
                    <li><Link to='/bugs' className='nav-link'> Bugs </Link></li>
                    <li><Link to='/invites' className='nav-link'> Invites </Link></li>
                    <li><Link to='/alerts' className='alert-link'> Alerts {activityFlag && <NotificationListener/>} </Link></li>
                    <li><Link to='/team' className='nav-link'> Team </Link></li>
                </ul>
            </div>
            <button className='nav-link logout' onClick={handleSignOut}>Logout</button>
        </div>
    )
}