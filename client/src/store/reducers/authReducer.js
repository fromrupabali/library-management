import * as actionTypes from '../actions/actionTypes';

const initialState = {
    auth: false,
    userId: null,
    paidMemberShip: false,
    userSetup: false,
    admin: false,
    adminSetUp: false,
    redirect_url:null
}

const authReducer = (state= initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_USER:
            return{
                ...state,
                auth: true,
                userId: action.userId,
                paidMemberShip: action.paidMemberShip,
                userSetUp: true
            }
        case actionTypes.USER_SETUP:
            return{
                ...state,
                userSetUp: true
            }
        case actionTypes.LOG_OUT:
            localStorage.removeItem('TOKEN');
            return{
                ...state,
                auth: false,
                userId: null,
                paidMemberShip: false
            }
        case actionTypes.ADMIN_SETUP:
            return{
                ...state,
                adminAuth: true
            }
        case actionTypes.ADMIN_LOGOUT:
            localStorage.removeItem('adminToken');
            return{
                ...state,
                adminAuth: false
         }
        case actionTypes.PAID_MEMEBERSHIP:
            return{
                ...state,
               paidMemberShip: true
            }
         default:
             return state
    }
};

export default authReducer;