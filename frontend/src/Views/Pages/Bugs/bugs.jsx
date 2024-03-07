import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {paginateBugs} from '../../../Controllers/bugController'
import { clearBugs } from '../../../Controllers/Redux/bugSlice'
import { fetchProjects } from '../../../Controllers/projectController'
import BugCard from '../../Components/Bugs/Bug Card/bugCard'
import BugView from '../../Components/Bugs/Bug View/bugView'
import CreateBug from '../../Components/Bugs/Create Bug/createBug'
import { clearProjects } from '../../../Controllers/Redux/projectSlice'
import _ from 'lodash'

export default(props) => {
    const user = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)
    const projects = useSelector((state) => state.projects.all)
    const bugs = useSelector((state) => state.bugs.paginated)
    const [filteredBugs, setFilteredBugs] = useState([])
    const [projectIndex, setProjectIndex] = useState(localStorage.getItem('dashboardIndex'))
    const [page, setPage] = useState(1);
    const [view, setView] = useState("In-Progress")
    const [cleared, setCleared] = useState(false);
    const [sortBy, setSortBy] = useState("Priority")
    const dispatch = useDispatch();

    useEffect(() => {
        if (projects.length === 0) {
            dispatch(fetchProjects(token));
        }
      }, []);

    useEffect(() => {
        return () => {
            dispatch(clearBugs());
            dispatch(clearProjects());
        };
    }, [dispatch]);

    //on page visit
    useEffect(() => {
        if (projectIndex === undefined || (projects.length && (projectIndex > projects.length - 1))) {
            localStorage.setItem('dashboardIndex', projects.length - 1)
            setProjectIndex(0)
        } else {
            localStorage.setItem('dashboardIndex', projectIndex);
        }
    }, [projectIndex])

    
    useEffect(() => {
        setPage(1)
        dispatch(clearBugs()) 
        if (projects[projectIndex] !== undefined && page === 1) {
            const selectedProject = projects[projectIndex]
            const member = selectedProject.members.find(member => member.user.name === user)
            let role;
            if (member) {
                role = member.role
            }
            else if (user === selectedProject.creator.name) {
                role = 'admin'
            }
            setLoading(true)
            const filter = {role, sortBy, view}
            dispatch(paginateBugs(selectedProject, filter, page, token))
            setTimeout(() => {
                setLoading(false);
            }, 500);
            setCleared(true)
        }
    }, [projects, projectIndex, view])

    //updating bug info
    useEffect(() => { 
        if (projects[projectIndex] !== undefined && cleared) {
            const selectedProject = projects[projectIndex]
            const member = selectedProject.members.find(member => member.user.name === user)
            let role;
            if (member) {
                role = member.role
            }
            else if (user === selectedProject.creator.name) {
                role = 'admin'
            }
            setLoading(true)
            const filter = {role, sortBy, view}
            dispatch(paginateBugs(selectedProject, filter, page, token))
            setTimeout(() => {
                setLoading(false);
            }, 250);
        }
    }, [page, sortBy])

    useEffect(() => {
        if (bugs && sortBy === 'Priority') {
            setFilteredBugs([...bugs].sort((bug1, bug2) => {
                return bug1.priority.localeCompare(bug2.priority);
            }));
        } else {
            setFilteredBugs([...bugs].sort((bug1, bug2) => {
                return bug2.dateCreated.localeCompare(bug1.dateCreated);
            }));
        }
    }, [bugs])
    
    const [DISPLAY_BUG,SET_DISPLAY_BUG] = useState({
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

    const [scrollPosition, setScrollPosition] = useState(0);

    let lastScrollTop = 0;
    const [loading, setLoading] = useState(false);

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

    const pageContainerRef = useRef(null);

    function BugClicked(id) {
        SET_DISPLAY_BUG({
            isDisplayed:!DISPLAY_BUG.isDisplayed,
            id: id,
        })

        if (!DISPLAY_BUG.isDisplayed) {
            pageContainerRef.current.style.filter = 'blur(5px)';
          } else {
            pageContainerRef.current.style.filter = 'none';
          }
    }

    const handleClick = () => {
        dispatch(clearBugs())
        setPage(1)
        if (sortBy === "Priority") 
            setSortBy("Latest");
        else
            setSortBy("Priority");
    };

    const handleView = () => {
        if(view === "In-Progress") {
            setView("Completed")
        }
        else {
            setView("In-Progress")
        }
    }

    const handleProjectChange = (event) => {
        setProjectIndex(event.target.value);
      }

    return(
        <div className='page-container'>
            <div className='filter-container'>
                <select value={projectIndex} onChange={handleProjectChange}>
                    {projects.map((project, index) => (
                    <option key={project._id} value={index}>
                        {project.name}
                    </option>
                    ))}
                </select>
                <button onClick={handleView}>View: {view}</button>
                <button onClick={handleClick}> Sort By: {sortBy}</button>
                <button onClick={createClicked}>+</button>
            </div>
            <div className = 'view-form' ref={pageContainerRef}>
                {DISPLAY_CREATE.isDisplayed && <CreateBug project = {projects[projectIndex]} />}
            </div>
            <div className='view-form'>
                {DISPLAY_BUG.isDisplayed && <BugView view = {view} clicked={BugClicked} bug={bugs.filter((bug) => bug._id === DISPLAY_BUG.id)[0]} scroll={scrollPosition}/>}
            </div>
            <div className='display-cards' ref={pageContainerRef}>
                {filteredBugs.map((bug, key) => (
                    <BugCard key={key} bug={bug} clicked={BugClicked} />
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
