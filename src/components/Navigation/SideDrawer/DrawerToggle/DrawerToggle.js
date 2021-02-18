import React from 'react';
import cssClasses from './DrawerToggle.css'

const drawerToggle = props => (
    <div onClick={props.clicked} className={cssClasses.DrawerToggle}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default drawerToggle;