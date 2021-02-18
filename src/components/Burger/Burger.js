import React from 'react';
import cssClasses from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {
    const transformIngredients = Object.keys(props.ingredients)
    .map(igKey => {
        return [...Array(props.ingredients[igKey])].map((_, i) => {
            return <BurgerIngredient key={igKey + i} type={igKey} />;
        });
    }).reduce((arr, el) => {
        return arr.concat(el);
    }, []);
    return (
        <div className={cssClasses.Burger}>
            <BurgerIngredient type='bread-top'/>
            {transformIngredients.length === 0 ?
            <p>Please Start adding Ingredients!</p>
            : transformIngredients}
            <BurgerIngredient type='bread-bottom'/>
        </div>
    );
};

export default burger;