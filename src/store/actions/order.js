import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        newOrder: {id: id, ...orderData}
    };
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
}

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    };
};

export const purchaseBurger = (orderData) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        const data = {            
            query: `
                mutation createNewOrder($price: Float!,$deliveryMethod: String!, $email: String!, $name: String!, $country: String!, $street: String!, $zipCode: String!, $ingredients: JSON!){
                    createNewOrder(price:$price, deliveryMethod:$deliveryMethod, email: $email, name: $name, country: $country, street: $street, zipCode: $zipCode, ingredients: $ingredients)
                    {
                        status, msg, orderId                 
                    }
                }
            `,
            variables: orderData,  
        };
        axios.post('/graphql', data)
        .then(response => {
            dispatch(purchaseBurgerSuccess(response.data.data.createNewOrder.orderId, orderData));
        })
        .catch(err => {
            console.log(err);
            dispatch(purchaseBurgerFail(err));
        });
    };
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchOrdersFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = () => {    
    return dispatch => {
        dispatch(fetchOrdersStart());
        const data = {            
            query: `
                {
                    getAllOrders {
                        id
                        price
                        deliveryMethod
                        ingredients
                        customer {
                            name
                            email
                            address {
                                street
                                country
                                zipCode
                            }
                        }
                    }
                }
            `, 
        };
        axios.post('/graphql', data)
        .then(response => {
            if(response){
                if(response.data) {
                    if(response.data.data) {
                        if(response.data.data.getAllOrders){
                            console.log(response.data.data.getAllOrders);
                            dispatch(fetchOrdersSuccess([...response.data.data.getAllOrders]));
                        } else {
                            dispatch(fetchOrdersFail());
                        } 
                    } else {
                        dispatch(fetchOrdersFail());
                    }                 
                } else {
                    dispatch(fetchOrdersFail());
                } 
            } else {
                dispatch(fetchOrdersFail());
            } 
        })
        .catch(err => {
            console.log(err);
            dispatch(fetchOrdersFail());
        });
    };
};