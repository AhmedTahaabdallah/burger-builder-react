import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    status: 200,
    orders: [],
    loading: false,
    error: false,
    msg: null,
    purchased: false
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.PURCHASE_INIT: return updateObject(state, { purchased: false });
        case actionTypes.PURCHASE_BURGER_START: return updateObject(state, { loading: true, error: false, msg: null });
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            return updateObject(state, { 
                orders: state.orders.concat(action.newOrder),
                loading: false,
                purchased: true,
                error: false,
                msg: action.msg,
                status: 200,
             });
        case actionTypes.PURCHASE_BURGER_FAIL:
            return updateObject(state, { 
                status: action.status,
                error: true,
                msg: action.msg,
                loading: false
             });
        case actionTypes.FETCH_ORDERS_START: return updateObject(state, { loading: true, error: false, msg: null });
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return updateObject(state, { 
                loading: false,
                orders: action.orders,
                error: false,
                status: 200,
             });
        case actionTypes.FETCH_ORDERS_FAIL:
            return updateObject(state, { 
                loading: false,
                error: true,
                msg: action.msg,
                status: action.status,
             });
        case actionTypes.CHANGE_ORDERS_STATUS:
            return updateObject(state, { 
                status: action.status,
                error: false,
             });
        case actionTypes.RESET_ORDER_ERROR_MSG: return updateObject(state, { error: false, msg: null, });
        default: return state;
    }
};

export default reducer;