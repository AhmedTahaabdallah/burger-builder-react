import React from 'react';
import cssClasses from './Order.css'
const order = props => {
    const ingredients = [];
    for(let ingredientName in props.ingredients) {
        ingredients.push({
            name: ingredientName,
            amount: props.ingredients[ingredientName]
        });
    }
    const ingredientOutput = ingredients.map(ig => {
        return <span key={ig.name}
        style={{
            textTransform: 'capitalize',
            display: 'inline-block',
            margin: '0 10px',
            border: '1px solid #ccc',
            padding: '8px'
        }}>{ig.name} ({ig.amount})</span>;
    });
    return (
        <div className={cssClasses.Order}>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>{props.price} $</strong></p>
        </div>
    );
};

export default order;