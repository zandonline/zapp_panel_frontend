import {combineReducers} from "redux";
import agentReducer from "./agentReducer";

export default combineReducers({
    agent:agentReducer
})