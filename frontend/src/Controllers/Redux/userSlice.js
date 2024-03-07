import {createSlice} from "@reduxjs/toolkit"

const slice = createSlice({
    name: "user",
    initialState: [],
    reducers: {
        getUsers:(state, action)=>{
            return action.payload;
        }
    }
})

export default slice.reducer

export const {getUsers} = slice.actions