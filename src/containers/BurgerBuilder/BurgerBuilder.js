import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3,
}

class BurgerBuilder extends Component{
    state = {
        ingredients: null,
        totalPrice: 0,
        purchasable: false,
        purchasing: false,
        isLoadingAddOrder: false, 
        error: false
    };

    componentDidMount() {
        const data = {            
            query: `
                {
                    getAllIngredients {
                        totalPrice
                        ingredients
                    }
                }
            `,
        };
        axios.post('/graphql', data)
        .then(response => {
            //console.log(response.data.data.getAllIngredients);
            if(response){
                if(response.data) {
                    if(response.data.data) {
                        if(response.data.data.getAllIngredients){
                            this.setState({
                                ingredients: response.data.data.getAllIngredients.ingredients,
                                totalPrice: response.data.data.getAllIngredients.totalPrice,
                            });
                        } else {
                            this.setState({error: true,});
                        } 
                    } else {
                        this.setState({error: true,});
                    }                 
                } else {
                    this.setState({error: true,});
                } 
            } else {
                this.setState({error: true,});
            }        
        })
        .catch(err => {
            console.log(err);
            this.setState({error: true,});
        });
    }

    updatePurchasableState = (ingredients) => {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        }).reduce((summ, el) => summ + el, 0);
        this.setState(prevState => {
            return {
                purchasable: sum > 0
            };
        });
    }

    addIngredientHandler = type => {
        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount + 1;
        const updateIngredients = {...this.state.ingredients};
        updateIngredients[type] = updateCount;
        const priceAdditiol = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAdditiol;
        this.setState((prevState) => {
            return {
                totalPrice: newPrice,
                ingredients: updateIngredients
            }
        });
        this.updatePurchasableState(updateIngredients);
    };

    removeIngredientHandler = type => {
        const oldCount = this.state.ingredients[type];
        if(oldCount === 0){
            return;
        }
        const updateCount = oldCount - 1;
        const updateIngredients = {...this.state.ingredients};
        updateIngredients[type] = updateCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState((prevState) => {
            return {
                totalPrice: newPrice,
                ingredients: updateIngredients
            }
        });
        this.updatePurchasableState(updateIngredients);
    };

    purchasaShowHandler = () => {
        this.setState({ purchasing: true});
    }

    purchasaCancelHandler = () => {
        this.setState({ purchasing: false});
    }

    purchasaContinueHandler = () => {        
        const queryParams = [];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice.toFixed(2).replace(",", "."));
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {
        const disabledInfo = {...this.state.ingredients};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] === 0;
        }

        let orderSummary = null;        
        let burger = this.state.error ? 
        <p style={{ textAlign: 'center', marginTop: '300px'}}>Ingredients can't be loaded!</p> 
        : <div style={{ marginTop: '300px'}}><Spinner /></div>;
        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    ordered={this.purchasaShowHandler}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    price={this.state.totalPrice}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients} 
            price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);