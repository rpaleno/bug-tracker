import {createSlice} from '@reduxjs/toolkit'

const slice = createSlice({
    name: "invites",
    initialState: {
        invites: []
    },
    reducers:{
        getPaginatedInvites:(state, action)=>{
            return {
                ...state,
                invites: [...state.invites, ...action.payload]
            }
        },
        getCompleted:(state, action)=>{
            state.projects = action.payload
        },
        addInvite:(state, action)=>{
            return {
                ...state,
                invites: [...state.invites, action.payload],
              };
        },
        updateInvite:(state, action)=>{
            const updatedInvite = action.payload;
            const index = state.invites.findIndex(invite => invite._id === updatedInvite._id)
            if (index !== -1) {
                state.invites[index] = updatedInvite
            }
        },
        deleteInvite:(state, action)=>{
            const deletedId = action.payload._id;
            state.invites = state.invites.filter(invite => invite._id !== deletedId)
        },
        updateMark:(state,action)=>{
            const project = action.payload;
            if (project.completed === true) {
                return {
                    ...state,
                    projects: state.projects.filter(project => project._id !== action.payload._id),
                    completed: [...state.completed, project]
                };
            }
            
            else {
                return {
                    ...state,
                    completed: state.completed.filter(project => project._id !== action.payload._id),
                    projects: [...state.bugs, project]
                };
            }
                    
        },
        clearInvites:(state)=>{
            state.invites = []
        }
    },

});

export default slice.reducer;

export const {getPaginatedInvites, getCompleted, addInvite, updateInvite, deleteInvite, updateMark, clearInvites} = slice.actions