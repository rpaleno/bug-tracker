import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
    name: 'activity',
    initialState: [],
    reducers: {
        getActivity:(state, action)=>{
            return action.payload
        },
        clearActivity:()=>{
            return []
        },
        addActivity:(state, action)=>{
            return [...state, action.payload]
        },
        deleteActivity:(state, action)=>{
            const deletedId = action.payload._id
            return state.filter(activity => activity._id !== deletedId)
        },
        logout:()=>{
            return []
        }
    }
})

export default slice.reducer;

export const {getActivity, clearActivity, addActivity, deleteActivity, logout} = slice.actions