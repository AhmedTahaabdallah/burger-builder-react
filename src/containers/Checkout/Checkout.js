import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { isIngredientsCount } from '../../shared/utility';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import * as actions from '../../store/actions/index';

const checkout = props => {
    const { isAuth, onSetAuthRedirectPath, history } = props;

    useEffect(() => {
        if(!isAuth) {
            onSetAuthRedirectPath(['/checkout', '/checkout']);
            history.push('/auth');
        }
    }, [ isAuth, onSetAuthRedirectPath, history ]);
    
    const checkoutCancelledHandler = () => {
        props.history.goBack();
    }

    const checkoutContinuedHandler = () => {
        props.history.replace('/checkout/contact-data');
    }
     
    const purchasedRedirect = props.purchased ? <Redirect to='/'/> : null;
    return (
        <div>
            {purchasedRedirect}
            <CheckoutSummary 
            ingredients={props.ings ? props.ings : {}}
            isIngredientsCount={isIngredientsCount(props.ings)}
            checkoutCancelled={checkoutCancelledHandler}
            checkoutContinued={checkoutContinuedHandler}/>
            <Route path={props.match.path + '/contact-data'}
            component={ContactData} />                
        </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(checkout);
