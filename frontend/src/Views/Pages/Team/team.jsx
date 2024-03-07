import React,{useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { fetchProjects, editProject } from '../../../Controllers/projectController'
import './team.css'

export default () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const memberEditRef = useRef(null);
    const roleEditRef = useRef(null);
    const unsortedProjects = useSelector((state) => state.projects.all)
    const [projects, setProjects] = useState([])
    const [index, setIndex] = useState();
    const [memberIndex, setMemberIndex] = useState();  
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectMembers, setProjectMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState();
    const [isHoverEnabled, setIsHoverEnabled] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [rolesDisplayed, setRolesDisplayed] = useState(false);
    const roles = ['Admin', 'Tester', 'Developer'];
    const [selectedRole, setSelectedRole] = useState()

    useEffect(() => {
        dispatch(fetchProjects(token))
    },[])

    useEffect(() => {
        setProjects(unsortedProjects.filter(project => project.dateCompleted === ''))
    },[unsortedProjects])

    const handleProjectClick = (targetProject) => {
        setSelectedProject(targetProject);
        setIndex(projects.findIndex(project => project._id === targetProject._id));
        setSelectedMember();
    };

    useEffect(() => {
        if (selectedProject) {
            setProjectMembers(selectedProject.members);
            memberEditRef.current.style.visibility = 'visible';
        }
        else {
            memberEditRef.current.style.visibility = 'hidden';
        }
    }, [selectedProject])


    useEffect(() => {
        if (selectedMember) {
            roleEditRef.current.style.visibility = 'visible';
        }
        else {
            roleEditRef.current.style.visibility = 'hidden';
            setRolesDisplayed(false)
        }
    }, [selectedMember])

    const handleMemberClick = (targetMember) => {
        if (!isEditing) {
            setSelectedMember(targetMember);
            setSelectedRole(targetMember.role)
            setMemberIndex(projects[index].members.findIndex(member => member._id === targetMember._id))
            setIsHoverEnabled(!isHoverEnabled); 
        }
    };

    const handleRoleClick = (role) => {
        setSelectedRole(role)
    }

    const editMembers = () => {
        setIsEditing(!isEditing);
        setSelectedMember()
    };
   
    const removeMember = (e, name) => {
        const updatedMembers = projectMembers.filter(member => member.user.name !== name)
        const updatedProject = {
            ...selectedProject,
            members: updatedMembers
        }

        const updatedProjects = projects.map(project => 
            project._id === selectedProject._id
                ? {...project,
                members: updatedMembers
                }
                : project
            );
        dispatch(editProject(e, updatedProject, token))
        setProjects(updatedProjects)
        setProjectMembers(updatedMembers)
    };

    const editRole = (e) => {
        let updatedMember = {...selectedMember}
        updatedMember.role = selectedRole
        console.log(updatedMember)
        const updatedMembers = selectedProject.members.map(member =>
            member.user._id === selectedMember.user._id
                ? {...member,
                role: selectedRole 
                }
                : member
        );
        console.log(updatedMembers)
        const restructuredMembers = updatedMembers.map(member => ({
            ...member,
            user: member.user._id
        }));
        
        const updatedProject = {
            ...selectedProject,
            creator: selectedProject.creator._id,
            members: restructuredMembers
        }

        dispatch(editProject(e, updatedProject, token))

        const updatedProjects = projects.map(project => 
            project._id === selectedProject._id
                ? {...project,
                members: updatedMembers
                }
                : project
            );
        

        setProjects(updatedProjects)
        setSelectedMember(updatedMember)
        setRolesDisplayed(!rolesDisplayed)
    }

    const displayRoles = () => {
        setRolesDisplayed(!rolesDisplayed)
    }

    return (
        <div className='page-container'>
            <div className='parent-container'>
                <div className='selector-container'>
                    <h1>Projects</h1>
                    <hr/>
                    <div className='member-list'>
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                onClick={() => handleProjectClick(project)}
                                className={selectedProject && selectedProject._id === project._id ? 'project-item selected' : 'project-item'}
                                style={{ '--hover-background-color': selectedProject && selectedProject._id === project._id ? 'teal' : 'lightblue' }}
                                >
                                <h5>{project.name}</h5>
                            </div>
                            ))}
                    </div>
                </div>

                <div className='selector-container'>
                    <div className='top-view'>
                        <div className='header-test'>
                            <h1>Team</h1>
                        </div>

                        <div className = 'button-test'>
                            <button ref={memberEditRef} onClick={editMembers}> Edit </button>
                        </div>
                    </div>
                    <hr/>
                    <div className='member-list'>
                        {index !== undefined && projects[index].members.map((member, index) => (
                        <div
                            key={index}
                            onClick={() => handleMemberClick(member)}
                            className={selectedMember && selectedMember.user.name === member.user.name ? 'project-item selected' : 'project-item'}
                            style={{
                                '--hover-background-color':
                                    selectedMember && selectedMember._id === member._id
                                        ? 'teal'
                                        : 'lightblue',
                                        cursor: isEditing ? 'default' : 'pointer' 
                            }}
                        >
                           <div className='editing-panel'>
                                {isEditing && (
                                    <button onClick={(e) => removeMember(e, member.user.name)}>-</button>
                                )}
                                <h5> {member.user.name} </h5>
                            </div>
                            
                        </div>
                        ))}
                    </div>
                </div>

                <div className='selector-container'>
                    <div className='top-view'>
                        <div className='header-test'>
                            <h1>Role</h1>
                        </div>
                        
                        <div className = 'button-test'>
                            {rolesDisplayed && <button onClick={(e) => editRole(e)}>Submit</button>}
                            <button  ref={roleEditRef} onClick={displayRoles}> Edit </button>
                        </div>
                    </div>
                    <hr/>

                    <div className='role-list'>
                    {!rolesDisplayed && selectedMember && index != null && memberIndex !== null && <h5>{projects[index].members[memberIndex].role}</h5>}
                        {rolesDisplayed && roles.map((role, index) => (
                            <div
                                key={index}
                                onClick={() => handleRoleClick(role)}
                                className={selectedRole === role ? 'project-item selected' : 'project-item'}
                                style={{
                                    '--hover-background-color':
                                        selectedRole === role
                                            ? 'teal'
                                            : 'lightblue',
                                }}
                            >
                                <h5> {role} </h5>
                            </div>
                        ))}
                    </div>  
                </div>
            </div>
        </div>
    )
}




