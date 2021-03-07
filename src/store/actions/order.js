import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        newOrder: {id: id, ...orderData}
    };
}

export const purchaseBurgerFail = (status, error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error,
        status: +status
    };
}

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    };
};

export const purchaseBurger = (orderData, token) => {
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
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        axios.post('/graphql', data, {
            headers: headers
        })
        .then(response => {         
            if(+response.data.data.createNewOrder.status === 401) {
                dispatch(purchaseBurgerFail(response.data.data.createNewOrder.status, response.data.data.createNewOrder.msg));
            } else if(+response.data.data.createNewOrder.status === 200) {
                dispatch(purchaseBurgerSuccess(response.data.data.createNewOrder.orderId, orderData));
            } else {
                dispatch(purchaseBurgerFail(response.data.data.createNewOrder.status, response.data.data.createNewOrder.msg));
            }
            
        })
        .catch(err => {
            dispatch(purchaseBurgerFail(201, err));
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

export const fetchOrdersFail = (status, error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error,
        status: +status
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = (token) => {    
    return dispatch => {
        dispatch(fetchOrdersStart());
        const data = {            
            query: `
                {
                    getAllOrders {
                        status
                        msg
                        allOrders {
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
                }
            `, 
        };
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        axios.post('/graphql', data, {
            'headers': headers
        })
        .then(response => {
            if(response){
                if(response.data) {
                    if(response.data.data) {
                        if(response.data.data.getAllOrders){
                            if(+response.data.data.getAllOrders.status === 401) {
                                dispatch(fetchOrdersFail(response.data.data.getAllOrders.status, response.data.data.getAllOrders.msg));
                                return 401;
                            } else if(+response.data.data.getAllOrders.status === 200) {
                                dispatch(fetchOrdersSuccess([...response.data.data.getAllOrders.allOrders]));
                            } else {
                                dispatch(fetchOrdersFail(response.data.data.getAllOrders.status, response.data.data.getAllOrders.msg));
                            }                            
                        } else {
                            dispatch(fetchOrdersFail(201, 'error1'));
                        } 
                    } else {
                        dispatch(fetchOrdersFail(201, 'error2'));
                    }                 
                } else {
                    dispatch(fetchOrdersFail(201, 'error3'));
                } 
            } else {
                dispatch(fetchOrdersFail(201, 'error4'));
            } 
        })
        .catch(err => {
            dispatch(fetchOrdersFail(201, err));
        });
    };
};

export const changeOrderStatus = (status) => {
    return {
        type: actionTypes.CHANGE_ORDERS_STATUS,
        status: status
    };
};