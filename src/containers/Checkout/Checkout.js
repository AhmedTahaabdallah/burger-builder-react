import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { isIngredientsCount } from '../../shared/utility';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import * as actions from '../../store/actions/index';

class Checkout extends Component {

    componentDidMount() {
        if(!this.props.isAuth) {
            this.props.onSetAuthRedirectPath(['/checkout', '/checkout']);
            this.props.history.push('/auth');
        }
    }
    
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {      
        const purchasedRedirect = this.props.purchased ? <Redirect to='/'/> : null;
        return (
            <div>
                {purchasedRedirect}
                <CheckoutSummary 
                ingredients={this.props.ings ? this.props.ings : {}}
                isIngredientsCount={isIngredientsCount(this.props.ings)}
                checkoutCancelled={this.checkoutCancelledHandler}
                checkoutContinued={this.checkoutContinuedHandler}/>
                <Route path={this.props.match.path + '/contact-data'}
                component={ContactData} />                
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased,
        isAuth: state.auth.user !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
