import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    buildingBurger: false
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3,
}

const addIngredients = (state, action) => {
    const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
    const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        buildingBurger: true
    };
    return updateObject(state, updatedState);
}

const removeIngredients = (state, action) => {
    const updatedIngt = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
    const updatedIngs = updateObject(state.ingredients, updatedIngt);
    const updatedSt = {
        ingredients: updatedIngs,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        buildingBurger: true
    };
    return updateObject(state, updatedSt);
}

const setIngredients = (state, action) => {
    return updateObject(state, {
        ingredients: {
            salad: action.ingredients.salad,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat,
        },
        totalPrice: action.totalPrice,
        error: false,
        buildingBurger: false
    });
}

const fetchIngredientsFailed = (state) => {
    return updateObject(state, {
        error: true
    });
}

const fetchIngredientsStart = (state) => {
    return updateObject(state, {
        ingredients: null,
    });
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_INGREDIENT: return addIngredients(state, action);
        case actionTypes.REMOVE_INGREDIENT: return removeIngredients(state, action);
        case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);            
        case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state);               
        case actionTypes.FETCH_INGREDIENTS_START: return fetchIngredientsStart(state);   
        default: return state;
    }
    
};

export default reducer;