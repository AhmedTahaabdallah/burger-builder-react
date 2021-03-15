import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

const orders = React.memo(props => {
    const { isAuth, onSetAuthRedirectPath, history, user, onFetchOrders } = props;

    useEffect(() => {
        if(!isAuth) {
            onSetAuthRedirectPath(['/orders', '/orders']);
            history.push('/auth');
        } else if(user && user.tokken) {
            onFetchOrders(user.tokken);
        }  
    }, [ isAuth, onSetAuthRedirectPath, history, user, onFetchOrders ]);
    
    let orders = null;
    if(props.user && props.user.tokken) {
        if(props.loading) {
            orders = <div style={{ marginTop: '300px'}}><Spinner /></div>; 
        } else if(props.error) {
        orders = <p style={{ textAlign: 'center', marginTop: '300px'}}>{props.msg}</p> ;
        } else {
            if(props.allOrders.length > 0) {
                orders = props.allOrders.map(order => {
                    return <Order
                        key={order.id}
                        price={order.price}
                        ingredients={order.ingredients}
                    />;
                });
            } else {
                orders = <p style={{ textAlign: 'center', marginTop: '300px'}}>There is no Orders...</p> ;
            }            
        }
    } else {
        orders = <p style={{ textAlign: 'center', marginTop: '300px'}}>not auth!</p> ;
    }
    return (<div>
        {orders}
    </div>);
},
(prevProps, nextProps) => {        
    if(nextProps.status === 401){
        prevProps.onSetAuthRedirectPath(['/orders', '/orders']);
        prevProps.onChangeOrderStatus(200);
        prevProps.onAuthLogout();
        prevProps.history.push('/auth');
        return true;
    }
    return prevProps === nextProps;
    //return false;
});

const mapStateToProps = state => {
    return {
        allOrders: state.order.orders,
        loading: state.order.loading,
        error: state.order.error,
        msg: state.order.msg,
        status: state.order.status,
        user: state.auth.user,
        isAuth: state.auth.user !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token) => dispatch(actions.fetchOrders(token)),
        onAuthLogout: () => dispatch(actions.logout()),
        onChangeOrderStatus: (status) => dispatch(actions.changeOrderStatus(status)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(orders, axios));
