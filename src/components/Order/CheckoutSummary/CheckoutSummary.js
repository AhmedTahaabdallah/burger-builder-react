import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import cssClasses from './CheckoutSummary.css'

const checkoutSummary = props => {
    
    return (
        <div className={cssClasses.CheckoutSummary}>
            <h1 style={{ textAlign: 'center'}}>We hope it tastes well!!</h1>
            <div style={{ width: '100%', margin: 'auto'}}>
                <Burger ingredients={props.ingredients} />
            </div>
            {!props.isIngredientsCount ? null 
            : <Button 
            btnType='Danger'
            clicked={() => props.checkoutCancelled()} >CANCEL</Button>}
            {!props.isIngredientsCount ? null 
            : <Button 
            btnType='Success'
            clicked={() => props.checkoutContinued()}>CONTINUE</Button>}
        </div>
    );
};

export default checkoutSummary;