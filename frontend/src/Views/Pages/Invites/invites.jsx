import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import InviteForm from '../../Components/View Invites/inviteForm'
import InviteCard from '../../Components/Invites/Invite Card/inviteCard'
import InviteView from '../../Components/Invites/Invite View/inviteView'
import { fetchInvites } from '../../../Controllers/inviteController'
import { clearInvites } from '../../../Controllers/Redux/inviteSlice'
import _ from 'lodash'

export default (props) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const invites = useSelector((state) => state.invites.invites);
    const pageContainerRef = useRef(null);
    const [sortBy, setSortBy] = useState("Latest");
    const [view, setView] = useState("Inbox");
    const [scrollPosition, setScrollPosition] = useState(0);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false);
    let lastScrollTop = 0;

    const [DISPLAY_INVITE,SET_DISPLAY_INVITE] = useState({
        id: '',
        isDisplayed:false,
    })

    const [DISPLAY_CREATE,SET_DISPLAY_CREATE] = useState({
        isDisplayed:false,
    })

    function createClicked() {
        SET_DISPLAY_CREATE({
            isDisplayed:!DISPLAY_CREATE.isDisplayed,
        })
     
        if (!DISPLAY_CREATE.isDisplayed) {
            pageContainerRef.current.style.filter = 'blur(5px)';
          } else {
            pageContainerRef.current.style.filter = 'none';
          }
    }

    function inviteClicked(id) {
        SET_DISPLAY_INVITE({
            isDisplayed:!DISPLAY_INVITE.isDisplayed,
            id: id,
        })
       
        if (!DISPLAY_INVITE.isDisplayed) {
            pageContainerRef.current.style.filter = 'blur(5px)';
          } else {
            pageContainerRef.current.style.filter = 'none';
          }
    }

    useEffect(() => {
        const filter = {sortBy: sortBy, status: view}
        setLoading(true)
        dispatch(fetchInvites(token, filter, page))
        setTimeout(() => {
            setLoading(false);
        }, 250);
    }, [view, sortBy, page]);

    useEffect(() => {
        setPage(1)
        dispatch(clearInvites())
    }, [view, sortBy])

    const handleScroll = _.debounce(() => {
        const container = document.querySelector('.page-container');
        const position = container.scrollTop;
        setScrollPosition(position);

        const isScrollingDown = container.scrollTop > lastScrollTop;
        const scrollPercentage = (position / (container.scrollHeight - container.clientHeight)) * 100;

        const isAtBottom = scrollPercentage > 99;

        if (isScrollingDown && isAtBottom) {
            setPage((prevPage) => prevPage + 1);
        }
    
        //update the last scroll top position
        lastScrollTop = container.scrollTop
    }, 600); //debounce for 600 milliseconds

    useEffect(() => {
        const container = document.querySelector('.page-container');
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);
    
    const handleClick = () => {
        if (sortBy === "Latest") 
            setSortBy("Role");
        else
            setSortBy("Latest");
    };

    const handleView = () => {
        if(view === "Inbox")
            setView("Sent")
        else
            setView("Inbox")
    }

    return (
        <div className='page-container'>
            <div className='filter-container'>
                <button onClick={handleView}>View: {view}</button>
                <button onClick={handleClick}> Sort By: {sortBy}</button>
                <button onClick={createClicked}>+</button>
            </div>
            
            <div className = 'view-form' ref={pageContainerRef}>
                {DISPLAY_CREATE.isDisplayed && <InviteForm clicked={createClicked} />}
            </div>

            <div className='view-form'>
                {DISPLAY_INVITE.isDisplayed && <InviteView title = {props.title} clicked={inviteClicked} invite={invites.filter((invite) => invite._id === DISPLAY_INVITE.id)[0]} scroll={scrollPosition}/>}
            </div>

            <div className='display-cards'  ref={pageContainerRef}>
                {invites.map((invite, key) => (
                    <InviteCard key={key} invite={invite} clicked={inviteClicked} />
                ))}    
            </div>

            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    )
}