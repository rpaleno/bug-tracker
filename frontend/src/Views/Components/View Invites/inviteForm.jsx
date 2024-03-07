import React,{useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { fetchProjects } from '../../../Controllers/projectController'
import { verifyUser } from '../../../Controllers/authController';
import { createInvite } from '../../../Controllers/inviteController';
import './styles.css';

const BugTrackerForm = (props) => {
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [projectMembers, setProjectMembers] = useState([])
  const [membersAdded, setMembersAdded] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [displayMessage, setDisplayMessage] = useState('')
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.all)
  const invites = useSelector((state) => state.invites.invites)
  const pageContainerRef = useRef(null);
  const inviteTemplate = {
    recipient: '',
    sender: '',
    project: '',
    status: '' ,
    dateCreated: '',
    role: '',
  }

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  }

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value); // Update the selected role
  };

  const handleAddMember = async () => {
    const result = await verifyUser(newMemberUsername);
    const memberAdded = membersAdded.find((member) => member.username === newMemberUsername);
    const projectMember = projectMembers.find((member => member.user.name === newMemberUsername))
    let matchingInvites = []
  
    if (invites.length !== 0) {
      const projectObj = JSON.parse(selectedProject)
      matchingInvites = invites.filter(
        (invite) =>
            invite.recipient.name === newMemberUsername && invite.project.name === projectObj.name
      );
    }

    if (!selectedProject) {
      setDisplayMessage('⚠ Select a project'); 
    }
    else if (!result) {
      setDisplayMessage('⚠ Username does not exist'); 
      //setNewMemberUsername(''); // Clear the input field
    }
    else if (memberAdded) {
      setDisplayMessage('⚠ User already added');
      //setNewMemberUsername(''); // Clear the input field
    }
    else if (user === newMemberUsername || projectMember) {
      setDisplayMessage('⚠ User already a member');
      //setNewMemberUsername(''); // Clear the input field
    }
    else if (matchingInvites.length !== 0) {
      setDisplayMessage('⚠ User already invited');
      console.log(matchingInvites)
      setNewMemberUsername(''); // Clear the input field
    }
    else if (newMemberUsername.trim() !== '') {
      setMembersAdded([...membersAdded, {username: newMemberUsername, id: result}]);
      setDisplayMessage('');
      setNewMemberUsername(''); // Clear the input field
    }

    pageContainerRef.current.scrollTop = pageContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    dispatch(fetchProjects(token))
  }, [])

  useEffect(() => {
    if (selectedProject) {
      const jsonObject = JSON.parse(selectedProject);
      setProjectMembers(jsonObject.members)
    }
  }, [selectedProject])

  useEffect(() => {
    if (pageContainerRef.current) {
        pageContainerRef.current.scrollTop = pageContainerRef.current.scrollHeight;
    }
  }, [membersAdded, displayMessage]);

  const handleRemoveMember = (index) => {
    const updatedMembers = [...membersAdded];
    updatedMembers.splice(index, 1);
    setMembersAdded(updatedMembers);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      //event.preventDefault(); // Prevent form submission
      handleAddMember();
    }
  };

  function handleSubmit (e) {
    if (!selectedProject || !selectedRole) {
      return;
    }
    for (const member of membersAdded) {
        const invite = inviteTemplate
        invite.recipient = member.id
        invite.role = selectedRole
        const projectObject = JSON.parse(selectedProject)
        invite.project = projectObject._id
        dispatch(createInvite(e, invite, token))
    }
    //props.clicked()
    window.location.reload();
  }

  return (
    <div className='box-container'>
        <h1>Invite User</h1>
        <select required value={selectedProject} onChange={handleProjectChange}>
            <option value="">Select a project</option>
            {projects.map((project) => (
            <option key={project._id} value={JSON.stringify(project)}>
                {project.name}
            </option>
            ))}
        </select>


        <div className="scrollable-box" ref={pageContainerRef}>
            {membersAdded.map((member, index) => (
            <div className = 'invite-row' key={index}>
                {member.username}
                <button type="button" onClick={() => handleRemoveMember(index)}>
                x
                </button>
            </div>
            ))}

            <div className="input-container"> 
            <input required
                type="text"
                placeholder='Enter a username'
                value={newMemberUsername}
                onChange={(e) => setNewMemberUsername(e.target.value)}
                onKeyDown={handleKeyPress}
            />
            </div>

            {displayMessage && <p className="error-message">{displayMessage}</p>}
        </div>

        <select required value={selectedRole} onChange={handleRoleChange}>
            <option value="">Select a role</option>
            <option value="Admin">Admin</option>
            <option value="Developer">Developer</option>
            <option value="Tester">Tester</option>
        </select>

        <div className='invite-button'>
            <button onClick={(e) => handleSubmit(e)}>Invite</button>
        </div>
    </div>
  );
};

export default BugTrackerForm;