import React, { Component } from 'react';
import { connect } from 'react-redux';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Orders extends Component {

    componentDidMount() {
        this.props.onFetchOrders();
    }

    render() {
        let orders = null;
        if(this.props.loading) {
            orders = <div style={{ marginTop: '300px'}}><Spinner /></div>; 
        } else if(this.props.error) {
            orders = <p style={{ textAlign: 'center', marginTop: '300px'}}>Orders can't be loaded!</p> ;
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: () => dispatch(actions.fetchOrders()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
