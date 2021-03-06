import React from 'react';
import cssClasses from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = props => (
    <ul className={cssClasses.NavigationItems}>
        <NavigationItem link='/' >Burger Builder</NavigationItem>
        {props.isAuth ? <NavigationItem link='/orders'>Orders</NavigationItem> : null}
        {props.isAuth ? <NavigationItem link='/checkout'>Checkout</NavigationItem> : null}
        {props.isAuth ? 
            <NavigationItem link='/logout'>Logout</NavigationItem>
            : <NavigationItem link='/auth'>Login</NavigationItem>        
        }
    </ul>
);

export default navigationItems;