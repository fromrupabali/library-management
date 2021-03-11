import * as actionTypes from '../actions/actionTypes';

const initialState = {
   data:{},
   homeSetup: false
}

const dataReducer = (state= initialState, action) => {
    switch(action.type){
        case actionTypes.HOME_SETUP:
            return{
                ...state,
               data: action.data,
               homeSetup: true
            }
         default:
             return state
    }
};

export default dataReducer;