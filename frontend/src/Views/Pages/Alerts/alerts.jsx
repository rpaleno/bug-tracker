import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { fetchNotifications, clearNotifications } from '../../../Controllers/notificationController'
import { unmarkActivity } from '../../../Controllers/Redux/notificationSlice'
import _ from 'lodash';
import './alerts.css'

export default () => {
    const notifications = useSelector(state => state.notification.messages)
    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch()
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const rowLength = 19
    let lastScrollTop = 0;

    useEffect(() => {
        return () => {
            dispatch(unmarkActivity());
        };
    }, [dispatch]);
    
    useEffect(() => {
        setLoading(true)
        dispatch(fetchNotifications(page, token))
          setTimeout(() => {
                setLoading(false);
            }, 500);
    }, [page])
    
    const handleScroll = _.debounce(() => {
        const container = document.querySelector('.page-container');
        const position = container.scrollTop;
    
        const isScrollingDown = container.scrollTop > lastScrollTop;
        const scrollPercentage = (position / (container.scrollHeight - container.clientHeight)) * 100;

        const isAtBottom = scrollPercentage > 99;

        if (isScrollingDown && isAtBottom) {
            setPage((prevPage) => prevPage + 1);
        }
    
        lastScrollTop = container.scrollTop;
    }, 600); 

    

    useEffect(() => {
        const container = document.querySelector('.page-container');
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    return (
        <div className='page-container'>
            <div className='button-container'>
                <button onClick={() => dispatch(clearNotifications(token))}>Clear</button>
            </div>
            <div className = 'alerts-table'>
                <table>
                    <thead>
                        <tr>
                            <th className="table-header">Notification</th>
                            <th className="table-header">Details</th>
                            <th className="table-header">Time</th>
                            <th className="table-header">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification, index) => (
                            <tr key={index}>
                                <td>{notification.type}</td>
                                <td>{notification.details}</td>
                                <td>{notification.date}</td>
                                <td>{notification.time}</td>
                            </tr>
                            ))}
                        {notifications.length < rowLength && (
                        Array(rowLength - notifications.length).fill(null).map((_, index) => (
                            <tr key={`empty-${index}`}>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>
            {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
        </div>
    )
}
