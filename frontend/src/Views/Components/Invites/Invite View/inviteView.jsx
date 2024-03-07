import React,{useState, useEffect, useRef} from 'react'
import ViewSection from '../../Projects/Project View/View Section/viewSection'
import {useDispatch, useSelector} from 'react-redux'
import EditPanel from '../../Edit Delete/editPanel'
import EditInvite from '../Invite Form/inviteForm'
import {editProject} from '../../../../Controllers/projectController'
import { editInvite, removeInvite } from '../../../../Controllers/inviteController'
import { deleteInvite } from '../../../../Controllers/Redux/inviteSlice'
import '../../Projects/Project View/projectView.css'
import './inviteView.css'

export default(props) => {
    const dispatch = useDispatch();
    const [displayEdit,setDisplayEdit] = useState(false)
    const name = useSelector(state => state.auth.user)
    const token = useSelector(state => state.auth.token)
    const invite = props.invite
    const pageContainerRef = useRef(null)

    function editClicked(){
        setDisplayEdit(!displayEdit);
    }

    function acceptInvite(e) {
      const project = invite.project
      const member = {user: invite.recipient._id, role: invite.role}
      const updatedProject = {
          ...project,
          creator: project.creator._id,
          members: [...project.members, member],
        };
      const updatedInvite = {
          ...invite,
          sender: invite.sender._id,
          recipient: invite.recipient._id,
          project: invite.project._id,
          status: 'accepted'
      }
      console.log(updatedProject)
      dispatch(editInvite(e, updatedInvite, token));
      dispatch(editProject(e, updatedProject, token));
      dispatch(deleteInvite(invite))
      props.clicked()
    }

    function declineInvite(e) {
      const updatedInvite = {
          ...invite,
          status: 'declined'
      }
      dispatch(editInvite(e, updatedInvite, token));
      dispatch(deleteInvite(invite))
      props.clicked()
    }

    useEffect(() => {
      if (invite && name !== invite.recipient.name) {
        pageContainerRef.current.style.visibility = 'hidden';
      }
    }, [name]);

    return (
        <>
          {!displayEdit ? (
            <div className='project-view' style={{ "--scrollPosition": props.scroll + 'px'}}>
             
              <button onClick={props.clicked} className='close-btn'>Close</button>
              <h1>{invite.project.name}</h1>
              <ViewSection title='Details' info={invite.project.details} />
              <ViewSection title='Priority' info={invite.project.priority} />
              <ViewSection title='Status' info={invite.status} />
              <ViewSection title='Role' info={invite.role} />
              <ViewSection title='Recipient' info={invite.recipient.name} />
              <ViewSection title='Created' info={invite.dateCreated} />
              <div className='creator-panel'>
                <EditPanel name = {name} sender = {invite.sender.name} status = {invite.status} editClicked={editClicked} deleteClicked={()=>{props.clicked() || dispatch(removeInvite(invite, token))}} /> 
              </div>
              <div className='options-panel' ref={pageContainerRef}>
                <button className='accept-button' onClick={(e) => acceptInvite(e)}>Accept</button>
                <button className='delete-button' onClick={(e) => declineInvite(e)}>Decline</button>
              </div>
              
              
            </div>
          ) : null}
          <div className='project-edit' style={{ "--scrollPosition": props.scroll + 'px'}}>
             {displayEdit && <EditInvite title="Edit Invite" invite={invite} func={editInvite} close={editClicked} />}
          </div>
        </>
      );
}