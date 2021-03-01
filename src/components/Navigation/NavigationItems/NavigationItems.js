import React from 'react';
import cssClasses from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = props => (
    <ul className={cssClasses.NavigationItems}>
        <NavigationItem link='/' >Burger Builder</NavigationItem>
        <NavigationItem link='/orders'>Orders</NavigationItem>
        <NavigationItem link='/checkout'>Checkout</NavigationItem>
    </ul>
);

export default navigationItems;