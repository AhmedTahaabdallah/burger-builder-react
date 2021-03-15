import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import { setlocalStorageItem, getlocalStorageItem} from '../../shared/utility';


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const resetAuthErrorMsg = () => {
    return {
        type: actionTypes.RESET_AUTH_ERROR_MSG
    };
};

export const authSuccess = (authData, msg) => {    
    setlocalStorageItem('userData', authData);
    //setlocalStorageItem('username', authData.username, false);
    const userData = {
        username: authData.username,
        email: authData.email,
        id: authData.id,
        tokken: authData.tokken,
    };
    return {
        type: actionTypes.AUTH_SUCCESS,
        user: userData, 
        msg: msg
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        msg: error
    };
};

export const logout = () => {
    localStorage.removeItem('userData');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const auth = (formData, isSignup,) => {
    return dispatch => {   
        dispatch(authStart());
        let query = `
            mutation userLogin($email: String!, $password: String!){
            userLogin(email: $email, password: $password)
                {
                    status, msg, id, username, tokken   
                }
            }
        `;
        if(isSignup) {
            query = `
                mutation createNewUser($username: String!, $email: String!, $password: String!){
                createNewUser(username:$username, email: $email, password: $password)
                    {
                        status, msg, id, username, tokken   
                    }
                }
            `;
        }
        const data = {            
            query: query,
            variables: formData,  
        };
        const eamil = formData.email;
        axios.post('/graphql', data)
        .then(response => {
            if(response){
                if(response.data) {
                    if(response.data.data) {
                        if(response.data.data.userLogin){
                            if(+response.data.data.userLogin.status === 200) {
                                dispatch(authSuccess({...response.data.data.userLogin, email: eamil}, response.data.data.userLogin.msg));
                            } else {
                                dispatch(authFail(response.data.data.userLogin.msg));
                            }                            
                        } else if(response.data.data.createNewUser){
                            if(+response.data.data.createNewUser.status === 200) {
                                dispatch(authSuccess({...response.data.data.createNewUse, email: eamil}, response.data.data.createNewUser.msg));
                            } else {
                                dispatch(authFail(response.data.data.createNewUser.msg));
                            }  
                        } else {
                            dispatch(authFail('error! 1'));
                        } 
                    } else {
                        dispatch(authFail('error! 2'));
                    }                 
                } else {
                    dispatch(authFail('error! 3'));
                } 
            } else {
                dispatch(authFail('error! 4'));
            } 
        })
        .catch(err => {
            dispatch(authFail(err));
        });
    }
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {
        // const username = getlocalStorageItem('username', false);
        // if(username) {
        //     console.log('username : ', username);
        // }
        const userData = getlocalStorageItem('userData');
        if(userData) {
            dispatch(authSuccess(userData, null));
        }
    };
};