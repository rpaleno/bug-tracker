import React,{useState, useEffect, useRef} from 'react'
import ViewSection from './View Section/viewSection'
import {useDispatch, useSelector} from 'react-redux'
import EditPanel from '../../Edit Delete/projectEditPanel'
import EditProject from '../Project Form/projectForm'
import {editProject, removeProject, markProject} from '../../../../Controllers/projectController'
import './projectView.css'

export default(props) => {
    const dispatch = useDispatch();
    const [displayEdit,setDisplayEdit] = useState(false);
    const name = useSelector(state => state.auth.user)
    const token = useSelector(state => state.auth.token)
    const project = props.project
    const pageContainerRef = useRef(null);

    function editClicked(){
        setDisplayEdit(!displayEdit);
    }

    useEffect(() => {
      if (name !== project.creator.name) {
        pageContainerRef.current.style.visibility = 'hidden';
      }
    }, [name, project.creator]);

    return (
        <>
          {!displayEdit ? (
            <div className='project-view' style={{ "--scrollPosition": props.scroll + 'px'}}>
              <button onClick={props.clicked} className='close-btn'>Close</button>
              <h1>{project.name}</h1>
              <ViewSection title='Details' info={project.details} />
              <ViewSection title='Priority' info={project.priority} />
              <ViewSection title='Creator' info={project.creator.name} />
              <ViewSection title='Created' info={project.dateCreated} />
              <div className='creator-panel' ref={pageContainerRef} >
                <button className={props.view !== 'In-Progress' ? 'hidden' : ''} 
                  onClick={(e) => {props.clicked() || dispatch(markProject(e, project, token))}}>
                  Mark Complete
                </button>
                <EditPanel completed = {props.project.dateCompleted} editClicked={editClicked} deleteClicked={() => {props.clicked() || dispatch(removeProject(project, token))}} /> 
              </div>
            </div>
          ) : <div className='project-edit'>
                <EditProject title="Edit Project" project={project} func={editProject} close={editClicked} />
              </div>}
          
        </>
      );
}