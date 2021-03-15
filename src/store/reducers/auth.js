import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    user: null,
    loading: false,
    error: false,
    msg: null,
    authRedirectPath: ['/', '/'],
};

const authStart = (state) => {
    return updateObject(state, { loading: true, error: false, user: null, });
};

const authSuccess = (state, action) => {
    return updateObject(state, { 
        user: action.user,
        loading: false, 
        error: false,
        msg: action.msg 
    });
};

const authFail = (state, action) => {
    return updateObject(state, { loading: false, error: true, msg: action.msg });
};

const authLogout = (state) => {
    return updateObject(state, { user: null });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path });
};

const resetAuthErrorMsg = (state) => {
    return updateObject(state, { error: false, msg: null, });
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_START: return authStart(state);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);        
        case actionTypes.AUTH_LOGOUT: return authLogout(state);        
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);        
        case actionTypes.RESET_AUTH_ERROR_MSG: return resetAuthErrorMsg(state);        
        default: return state;
    }
};

export default reducer;