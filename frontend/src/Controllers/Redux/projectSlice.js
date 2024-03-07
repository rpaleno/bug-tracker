import {createSlice} from '@reduxjs/toolkit'

const slice = createSlice({
    name: "projects",
    initialState: {
        paginated: [],
        all: []
    },
    reducers:{
        getPaginatedProjects:(state, action) => {
            return {
                ...state,
                paginated: [...state.paginated, ...action.payload],
              };
        },
        getAllProjects:(state, action)=> {
            return {
                ...state,
                all: action.payload,
              };
        },
        addProject:(state, action)=>{
            console.log(action.payload)
            return {
                ...state,
                paginated: [...state.paginated, action.payload]
            }
        },
        updateProject:(state, action)=> {
            const updatedProject = action.payload;
            const index = state.paginated.findIndex(project => project._id === updatedProject._id)
            if (index !== -1) {
                state.paginated[index] = updatedProject;
            }
        },
        deleteProject:(state, action)=> {
            const deletedId = action.payload._id;
            state.paginated = state.paginated.filter(project => project._id !== deletedId);
        },
        updateMark:(state,action)=> {
            const project = action.payload;
            if (project.dateCompleted) {
                return state.paginated.filter(project => project._id !== action.payload._id)
            }
            
            else {
                return state.paginated.filter(project => project._id !== action.payload._id)
            }
                    
        },
        clearProjects:(state)=> {
            state.paginated = []
            state.all = []
        }
    },

});

export default slice.reducer;

export const {getPaginatedProjects, getAllProjects, addProject, updateProject, deleteProject, updateMark, clearProjects} = slice.actions