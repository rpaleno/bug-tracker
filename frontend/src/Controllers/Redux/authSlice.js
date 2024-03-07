import {createSlice} from '@reduxjs/toolkit'

const slice = createSlice({
    name: "auth",
    initialState:{
        user: '',
        token: '',
        authorized: false,
        
    },
    reducers: {
        signIn: (state, action) => {
            //createSlice uses immer library to internally handle immutable logic
            state.user = action.payload.user
            state.authorized = true
            state.token = action.payload.token
        },
        logout:(state)=>{
            state.authorized = false;
            state.token = '';
            state.user = '';
        },
    }
});

export default slice.reducer;

export const {signIn, logout} = slice.actions

