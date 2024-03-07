import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CreateProject from '../../Components/Projects/Create Project/createProject'
import ProjectCard from '../../Components/Projects/Project Card/projectCard'
import ProjectView from '../../Components/Projects/Project View/projectView'
import {paginateProjects} from '../../../Controllers/projectController';
import { clearProjects } from '../../../Controllers/Redux/projectSlice'
import _ from 'lodash';

export default () => {
    const dispatch = useDispatch();
    const [sortBy, setSortBy] = useState("Priority");
    const [view, setView] = useState("In-Progress");
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState();
    const projects = useSelector((state) => state.projects.paginated);
    const [filteredProjects, setFilteredProjects] = useState([])
    const token = useSelector((state) => state.auth.token)
    const pageContainerRef = useRef(null)
    const [scrollPosition, setScrollPosition] = useState(0);
    let lastScrollTop = 0;

    const [DISPLAY_PROJECT,SET_DISPLAY_PROJECT] = useState({
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

    function projectClicked(id) {
        SET_DISPLAY_PROJECT({
            isDisplayed:!DISPLAY_PROJECT.isDisplayed,
            id: id,
        })
       
        if (!DISPLAY_PROJECT.isDisplayed) {
            pageContainerRef.current.style.filter = 'blur(5px)';
          } else {
            pageContainerRef.current.style.filter = 'none';
          }
    }


    useEffect(() => {
        setLoading(true)
        const filter = {
            sortBy: sortBy,
            view: view
        }
        dispatch(paginateProjects(filter, page, token));
        setTimeout(() => {
            setLoading(false);
        }, 500);
        
    }, [page, view, sortBy]);

    useEffect(() => {
        dispatch(clearProjects());
        setPage(1)
    }, [view, sortBy])

    useEffect(() => {
        return () => {
            dispatch(clearProjects());
        };
    }, [dispatch]);

    const handleClick = () => {
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

    useEffect(() => {
        if (projects) {
            if (view === "In-Progress") 
                setFilteredProjects(projects.filter((project) => !project.dateCompleted));
            else
                setFilteredProjects(projects.filter((project) => project.dateCompleted));
        }
    },[projects, view])

    useEffect(() => {
        if (projects) {
            let sortedProjects;
            if (sortBy === "Priority") {
                sortedProjects = projects.slice().sort((a, b) => a.priority - b.priority);
            }
            else {
                sortedProjects = projects.slice().sort((a, b) => {
                    return b.dateCreated.localeCompare(a.dateCreated);
                });
            }
            setFilteredProjects(sortedProjects);    
            }
    },[projects, sortBy])

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
        lastScrollTop = container.scrollTop;
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

    return(
        <div className='page-container'>
            <div className='filter-container'>
                <button onClick={handleView}>View: {view}</button>
                <button onClick={handleClick}> Sort By: {sortBy}</button>
                <button onClick={createClicked}>+</button>
            </div>
            
            <div className = 'view-form' ref={pageContainerRef}>
                {DISPLAY_CREATE.isDisplayed && <CreateProject close={createClicked}/>}
            </div>

            <div className='view-form' ref = {pageContainerRef}>
                {DISPLAY_PROJECT.isDisplayed && <ProjectView view = {view} clicked={projectClicked} project={projects.filter((project) => project._id === DISPLAY_PROJECT.id)[0]} scroll={scrollPosition}/>}
            </div>

            <div className='display-cards'  ref={pageContainerRef}>
                {filteredProjects.map((project, key) => (
                    <ProjectCard key={key} project={project} clicked={projectClicked} />
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