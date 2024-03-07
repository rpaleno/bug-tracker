import {createSlice} from '@reduxjs/toolkit'

const slice = createSlice({
    name: "bugs",
    initialState: {
        paginated: [],
        all: []
    },
    reducers:{
        getPaginatedBugs:(state, action)=>{
            return {
                ...state,
                paginated: [...state.paginated, ...action.payload]
            }
        },
        getAllBugs:(state, action) => {
            return {
                ...state,
                all: action.payload
            }
        },
        clearBugs:(state)=>{
            state.paginated = [];
            state.all = [];
        },
        addBug:(state, action)=>{
            return {
                ...state,
                paginated: [...state.paginated, action.payload]
            }
        },
        updateBug:(state, action)=>{
            const updatedBug = action.payload;
            const index = state.paginated.findIndex(bug => bug._id === updatedBug._id);
            if (index !== -1) {
                state.paginated[index] = updatedBug;
            }
        },
        deleteBug:(state, action)=>{
            const deletedId = action.payload._id;
            state.paginated = state.paginated.filter(bug => bug._id !== deletedId);
        },
        updateMark:(state,action)=>{
            const markedBug = action.payload;
            return state.paginated.filter(bug => bug._id !== markedBug._id)
        },
    },
});

export default slice.reducer;

export const {getPaginatedBugs, getAllBugs, clearBugs, addBug, updateBug, deleteBug, updateMark} = slice.actions