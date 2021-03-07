import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    status: 200,
    orders: [],
    loading: false,
    error: null,
    purchased: false
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.PURCHASE_INIT: return updateObject(state, { purchased: false });
        case actionTypes.PURCHASE_BURGER_START: return updateObject(state, { loading: true, error: null });
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            return updateObject(state, { 
                orders: state.orders.concat(action.newOrder),
                loading: false,
                purchased: true,
                error: null,
                status: 200,
             });
        case actionTypes.PURCHASE_BURGER_FAIL:
            return updateObject(state, { 
                status: action.status,
                error: action.error,
                loading: false
             });
        case actionTypes.FETCH_ORDERS_START: return updateObject(state, { loading: true, error: null });
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return updateObject(state, { 
                loading: false,
                orders: action.orders,
                error: null,
                status: 200,
             });
        case actionTypes.FETCH_ORDERS_FAIL:
            return updateObject(state, { 
                loading: false,
                error: action.error,
                status: action.status,
             });
        case actionTypes.CHANGE_ORDERS_STATUS:
            return updateObject(state, { 
                status: action.status,
                error: null,
             });
        default: return state;
    }
};

export default reducer;