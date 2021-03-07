import React from 'react';
import cssClasses from './Logo.css';
import burgerLogo from '../../assets/images/burger-logo.png';
import { NavLink } from 'react-router-dom';

const logo = props => (
    
        <div className={cssClasses.Logo} style={{
            width: props.isSideDrawer ? '50%' : '50px'
        }}>
            <NavLink to='/'>
                <img className={cssClasses.img} src={burgerLogo} alt='My Burger' />
            </NavLink>
        </div>

    
);

export default logo;