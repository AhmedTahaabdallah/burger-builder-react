import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3,
}

class BurgerBuilder extends Component{
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0,
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
    };

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
        const data = {
            query: `
                mutation createNewOrde ($price: Float!,$deliveryMethod: String!, $email: String!, $name: String!, $country: String!, $street: String!, $zipCode: String!, $bacon: Int!, $cheese: Int!, $meat: Int!, $salad: Int!){
                    createNewOrde(price:$price, deliveryMethod:$deliveryMethod, email: $email, name: $name, country: $country, street: $street, zipCode: $zipCode, bacon: $bacon, cheese: $cheese, meat: $meat, salad: $salad)
                    {
                    status, msg
                    
                    }
                }
            `,
            variables: {
                price: parseFloat(this.state.totalPrice.toFixed(2).replace(",", ".")),
                deliveryMethod: 'fastest',
                email: 'test5@test.com',
                name: 'Ahmed Taha 5',
                country: 'Egypt',
                street: 'Test 5 Street',
                zipCode: '54687',
                bacon: this.state.ingredients.bacon,
                cheese: this.state.ingredients.cheese,
                meat: this.state.ingredients.meat,
                salad: this.state.ingredients.salad,
            },  
        };
        axios.post('/graphql', data)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const disabledInfo = {...this.state.ingredients};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] === 0;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchasaCancelHandler}>
                    <OrderSummary 
                    ingredients={this.state.ingredients} 
                    price={this.state.totalPrice}
                    purchaseCancelled={this.purchasaCancelHandler}
                    purchaseContinued={this.purchasaContinueHandler}
                    />
                </Modal>
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
    }
}

export default BurgerBuilder;