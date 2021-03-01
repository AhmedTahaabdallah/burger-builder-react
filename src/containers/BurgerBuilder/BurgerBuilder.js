import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/action';

class BurgerBuilder extends Component{
    state = {
        purchasing: false,
        isLoadingAddOrder: false, 
        error: false
    };

    componentDidMount() {
        // const data = {            
        //     query: `
        //         {
        //             getAllIngredients {
        //                 totalPrice
        //                 ingredients
        //             }
        //         }
        //     `,
        // };
        // axios.post('/graphql', data)
        // .then(response => {
        //     //console.log(response.data.data.getAllIngredients);
        //     if(response){
        //         if(response.data) {
        //             if(response.data.data) {
        //                 if(response.data.data.getAllIngredients){
        //                     this.setState({
        //                         ingredients: response.data.data.getAllIngredients.ingredients,
        //                         totalPrice: response.data.data.getAllIngredients.totalPrice,
        //                     });
        //                 } else {
        //                     this.setState({error: true,});
        //                 } 
        //             } else {
        //                 this.setState({error: true,});
        //             }                 
        //         } else {
        //             this.setState({error: true,});
        //         } 
        //     } else {
        //         this.setState({error: true,});
        //     }        
        // })
        // .catch(err => {
        //     console.log(err);
        //     this.setState({error: true,});
        // });
    }

    updatePurchasableState = (ingredients) => {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        }).reduce((summ, el) => summ + el, 0);
        return sum > 0;
    }

    purchasaShowHandler = () => {
        this.setState({ purchasing: true});
    }

    purchasaCancelHandler = () => {
        this.setState({ purchasing: false});
    }

    purchasaContinueHandler = () => {        
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = {...this.props.ings};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] === 0;
        }

        let orderSummary = null;        
        let burger = this.state.error ? 
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
                    purchasable={this.updatePurchasableState(this.props.ings)}
                    price={this.props.totalPrice}
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
        if(this.state.isLoadingAddOrder) {
            orderSummary = <Spinner />;
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
        ings: state.ingredients,
        totalPrice: state.totalPrice
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));