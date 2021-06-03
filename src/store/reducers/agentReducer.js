import * as actionTypes from "../sagas/actionTypes";

let initState = {


};
let agentReducer = function(state=initState, action) {
   
    switch(action.type){
        case actionTypes.login.login:
        return state;
        default:
        return state;
    }
 

}

export default agentReducer;
