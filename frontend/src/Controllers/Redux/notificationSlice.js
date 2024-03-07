import {createSlice} from '@reduxjs/toolkit'

const slice = createSlice({
    name: "notification",
    initialState:{
        messages: [],
        activity: false,
    },
    reducers: {
        getMessages: (state, action) => {
            return {
                ...state,
                messages: [...state.messages, ...action.payload]
            }
        },
        clearMessages:(state)=>{
            state.messages = []
        },
        markActivity: (state) => {
            state.activity = true
        },
        unmarkActivity:(state)=>{
            state.activity = false
        },
        markInvite: (state) => {
            state.invites = true
        },
        unmarkInvite: (state) => {
            state.invites = false
        }
    }
});

export default slice.reducer;

export const {getMessages, clearMessages, markActivity, unmarkActivity, markInvite, unmarkInvite} = slice.actions

