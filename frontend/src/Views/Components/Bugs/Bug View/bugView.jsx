import React,{useState, useEffect} from 'react'
import ViewSection from './component/bugViewSection'
import {useDispatch, useSelector} from 'react-redux'
import EditPanel from '../../Edit Delete/bugEditPanel'
import EditBug from '../Bug Form/bugForm'
import {editBug, removeBug, markBug} from '../../../../Controllers/bugController'
import './bugView.css'


export default (props) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const bug = props.bug
    const [displayEdit,setDisplayEdit] = useState(false);
    const [label, setLabel] = useState()
    function editClicked(){
        setDisplayEdit(!displayEdit);
    }

    useEffect(() => {
      if (props.view ==="In-Progress") {
        setLabel("Mark Complete")
      } else {
        setLabel("Mark Incomplete")
      }
    }, [props.view])
    
    return (
        <>
          {!displayEdit ? (
            <div className='bug-view' style={{ "--scrollPosition": props.scroll + 'px'}}>
              <EditPanel completed = {props.bug.dateCompleted} editClicked={editClicked} deleteClicked={(e)=>{props.clicked() || dispatch(removeBug(e, bug, token))}} />
              <button onClick={props.clicked} className='close-btn'>Close</button>
              <h1>{bug.name}</h1>
              <ViewSection title='Details' info={bug.details} />
              <ViewSection title='Steps' info={bug.steps} />
              <ViewSection title='Priority' info={bug.priority} />
              <ViewSection title='Creator' info={bug.creator.name} />
              <ViewSection title='App Version' info={bug.version} />
              <ViewSection title='Date Created' info={bug.dateCreated} />
              <button 
                  onClick={(e) => {props.clicked() || dispatch(markBug(e,bug,token))}}>
                  {label}
                </button>
            </div>
          ) : <div className='bug-edit'>
                <EditBug title="Edit Bug" bug={bug} project = {bug.project} func={editBug} close={editClicked} />
              </div>}
          
        </>
      );
}