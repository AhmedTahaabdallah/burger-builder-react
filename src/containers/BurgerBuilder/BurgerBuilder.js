import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isIngredientsCount } from '../../shared/utility';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

export const burgerBuilder = props => {

    const [ purchasing, setPurchasing ] = useState(false);

    const dispatch = useDispatch();
    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuth = useSelector(state => state.auth.user !== null);

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = useCallback(() => dispatch(actions.purchaseInit()), [dispatch]);
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients();
        onInitPurchase(); 
    }, [ onInitIngredients, onInitPurchase ]);

    const purchasaShowHandler = () => {
        if(isAuth) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath(['/', '/checkout']);
            props.history.push('/auth');
        }
    }

    const purchasaCancelHandler = () => {
        setPurchasing(false);
    }

    const purchasaContinueHandler = () => {       
        onInitPurchase(); 
        props.history.push('/checkout');
    }

    const disabledInfo = {...ings};
    for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] === 0;
    }

    let orderSummary = null;        
    let burger = error ? 
    <p style={{ textAlign: 'center', marginTop: '300px'}}>Ingredients can't be loaded!</p> 
    : <div style={{ marginTop: '300px'}}><Spinner /></div>;
    if(ings){
        burger = (
            <React.Fragment>
                <Burger ingredients={ings}/>
                <BuildControls 
                ingredientAdded={onIngredientAdded}
                ingredientRemoved={onIngredientRemoved}
                ordered={purchasaShowHandler}
                disabled={disabledInfo}
                purchasable={isIngredientsCount(ings)}
                price={totalPrice}
                isAuth={isAuth}
                />
            </React.Fragment>
        );
        orderSummary = <OrderSummary 
        ingredients={ings} 
        price={totalPrice}
        purchaseCancelled={purchasaCancelHandler}
        purchaseContinued={purchasaContinueHandler}
        />;
    }
    return (
        <React.Fragment>
            <Modal show={purchasing} modalClosed={purchasaCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </React.Fragment>
    );
}

export default withErrorHandler(burgerBuilder, axios);