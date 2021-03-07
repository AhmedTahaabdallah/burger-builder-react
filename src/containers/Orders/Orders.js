import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Orders extends Component {

    componentDidMount() {
        if(!this.props.isAuth) {
            this.props.onSetAuthRedirectPath(['/orders', '/orders']);
            this.props.history.push('/auth');
        } else if(this.props.user && this.props.user.tokken) {
            this.props.onFetchOrders(this.props.user.tokken);
        }        
    }

    shouldComponentUpdate(nextProps, nextState) {        
        if(nextProps.status === 401){
            this.props.onSetAuthRedirectPath(['/orders', '/orders']);
            this.props.onChangeOrderStatus(200);
            this.props.onAuthLogout();
            this.props.history.push('/auth');
            return false;
        }
        return this.props !== nextProps;
        //return true;
    }

    render() {
        let orders = null;
        if(this.props.user && this.props.user.tokken) {
            if(this.props.loading) {
                orders = <div style={{ marginTop: '300px'}}><Spinner /></div>; 
            } else if(this.props.error) {
            orders = <p style={{ textAlign: 'center', marginTop: '300px'}}>{this.props.error}</p> ;
            } else {
                if(this.props.allOrders.length > 0) {
                    orders = this.props.allOrders.map(order => {
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
    }
}

const mapStateToProps = state => {
    return {
        allOrders: state.order.orders,
        loading: state.order.loading,
        error: state.order.error,
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
