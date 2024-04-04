import { combineReducers } from '@reduxjs/toolkit';
import projects from './projectsSlice';
import information from './informationSlice';

const reducer = combineReducers({
  information,
  projects
});

export default reducer;
