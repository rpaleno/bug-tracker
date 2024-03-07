import React,{useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { fetchActivity } from '../../../../Controllers/activityController'
import { calculateTime, handlePrevPage, handleNextPage, getItemsPerPage } from './methods/methods'
import './activity.css'

export default (props)=> {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token)
    const activity = useSelector(state => state.activity)
    const [totalPages, setTotalPages] = useState();
    const [startIdx, setStartIdx] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage())
    const [visibleItems, setVisibleItems] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const handleResize = () => {
        setItemsPerPage(getItemsPerPage());
    };

    useEffect(() => {
        setCurrentPage(1);
        if (props.project) {
            setLoading(true)
            dispatch(fetchActivity(token, props.project._id))
            
        }
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [props.project])


    useEffect(() => {
        handleResize();
        setTotalPages(Math.ceil(activity.length / itemsPerPage))
        setStartIdx((currentPage - 1) * itemsPerPage)
    }, [activity, itemsPerPage, currentPage])

    useEffect(() => {
        setVisibleItems(activity.slice(startIdx, startIdx + itemsPerPage))
    }, [activity, itemsPerPage, startIdx])

    useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
    }, []);

    return (
        <div className='recent-activity'>
            <div className='activity-view'>
                <h1>Recent Activity</h1>
                <div className="timeline">
                    <div className="left-arrow-container">
                        <button
                        className={`arrow left-arrow ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(handlePrevPage(currentPage, totalPages))}
                        disabled={currentPage === 1}
                        >
                        &larr;
                        </button>
                    </div>
        
                    {loading ? (
                    <div className="loading-container">
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                    </div>
                    ) : (
                    <div className="timeline-items">
                        {visibleItems.length > 0 ? (
                        visibleItems.map((item, index) => (
                            <div key={index} className="timeline-item">
                            <div className="timeline-item-content">
                                <h3>{item.user}</h3>
                                <p>{item.name}</p>
                                <p>{calculateTime(item.createdAt)}</p>
                            </div>
                            </div>
                        ))
                        ) : (
                        <div className="no-activity">No recent activity</div>
                        )}
                    </div>
                )}

                    <div className="right-arrow-container">
                        <button
                        className={`arrow right-arrow ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(handleNextPage(currentPage, totalPages))}
                        disabled={currentPage === totalPages}
                        >
                        &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}