import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = name => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    };
};

export const removeIngredient = name => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
};

export const setIngredients = (ingredients, totalPrice) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients,
        totalPrice: totalPrice,
    };
};

export const fetchIngrediensStart = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_START,
    };
};

export const fetchIngrediensFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED,
    };
};

export const initIngredients = () => {
    return dispatch => {
        dispatch(fetchIngrediensStart());
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
            if(response){
                if(response.data) {
                    if(response.data.data) {
                        if(response.data.data.getAllIngredients){
                            dispatch(setIngredients(
                                response.data.data.getAllIngredients.ingredients,
                                response.data.data.getAllIngredients.totalPrice
                            ));
                        } else {
                            dispatch(fetchIngrediensFailed());
                        } 
                    } else {
                        dispatch(fetchIngrediensFailed());
                    }                 
                } else {
                    dispatch(fetchIngrediensFailed());
                } 
            } else {
                dispatch(fetchIngrediensFailed());
            }        
        })
        .catch(err => {
            dispatch(fetchIngrediensFailed());
        });
    };
};