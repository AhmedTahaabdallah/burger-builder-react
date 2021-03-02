import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    orders: [],
    loading: false,
    error: null,
    purchased: false
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.PURCHASE_INIT: return updateObject(state, { purchased: false });
        case actionTypes.PURCHASE_BURGER_START: return updateObject(state, { loading: true });
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            return updateObject(state, { 
                orders: state.orders.concat(action.newOrder),
                loading: false,
                purchased: true
             });
        case actionTypes.PURCHASE_BURGER_FAIL:
            return updateObject(state, { 
                error: action.error,
                loading: false
             });
        case actionTypes.FETCH_ORDERS_START: return updateObject(state, { loading: true });
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return updateObject(state, { 
                loading: false,
                orders: action.orders
             });
        case actionTypes.FETCH_ORDERS_FAIL:
            return updateObject(state, { 
                loading: false,
                error: action.error
             });
        default: return state;
    }
};

export default reducer;