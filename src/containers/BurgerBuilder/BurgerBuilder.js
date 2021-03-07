import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isIngredientsCount } from '../../shared/utility';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component{
    state = {
        purchasing: false,
    };

    componentDidMount() {
        this.props.onInitIngredients();
        this.props.onInitPurchase(); 
    }

    purchasaShowHandler = () => {
        if(this.props.isAuth) {
            this.setState({ purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath(['/', '/checkout']);
            this.props.history.push('/auth');
        }
    }

    purchasaCancelHandler = () => {
        this.setState({ purchasing: false});
    }

    purchasaContinueHandler = () => {       
        this.props.onInitPurchase(); 
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = {...this.props.ings};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] === 0;
        }

        let orderSummary = null;        
        let burger = this.props.error ? 
        <p style={{ textAlign: 'center', marginTop: '300px'}}>Ingredients can't be loaded!</p> 
        : <div style={{ marginTop: '300px'}}><Spinner /></div>;
        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    ordered={this.purchasaShowHandler}
                    disabled={disabledInfo}
                    purchasable={isIngredientsCount(this.props.ings)}
                    price={this.props.totalPrice}
                    isAuth={this.props.isAuth}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
            ingredients={this.props.ings} 
            price={this.props.totalPrice}
            purchaseCancelled={this.purchasaCancelHandler}
            purchaseContinued={this.purchasaContinueHandler}
            />;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchasaCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuth: state.auth.user !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));