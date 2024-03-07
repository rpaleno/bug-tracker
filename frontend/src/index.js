import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Provider} from 'react-redux'
import {configureStore, combineReducers} from '@reduxjs/toolkit'
import App from './App';

//reducers
import authReducer from './Controllers/Redux/authSlice'
import bugReducer from './Controllers/Redux/bugSlice'
import userReducer from './Controllers/Redux/userSlice'
import projectReducer from './Controllers/Redux/projectSlice'
import inviteReducer from './Controllers/Redux/inviteSlice'
import activityReducer from './Controllers/Redux/activitySlice'
import notificationReducer from './Controllers/Redux/notificationSlice';

//redux configure
const reducer = combineReducers({
    auth: authReducer,
    bugs: bugReducer,
    user: userReducer,
    projects: projectReducer,
    invites: inviteReducer,
    activity: activityReducer,
    notification: notificationReducer,
})

const store = configureStore({reducer})
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store = {store}>
        <App />
    </Provider>
);

