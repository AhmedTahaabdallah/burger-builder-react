import React, { useState} from 'react';
import { connect } from 'react-redux';

import cssClasses from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const layout = props => {
    const [ sideDrawerIsVisible, setSideDrawerIsVisible ] = useState(false);

    const sideDrawerClosedHandler = () => {
        setSideDrawerIsVisible(false);
    };

    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    };
    
    return (
        <React.Fragment>
            <Toolbar 
            isAuth={props.isAuth}
            drawerToggleClicked={sideDrawerToggleHandler}/>
            <SideDrawer 
            isAuth={props.isAuth}
            open={sideDrawerIsVisible} 
            closed={sideDrawerClosedHandler}/>
            <main className={cssClasses.Content}>
                {props.children}
            </main>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.user !== null,
    };
};

export default connect(mapStateToProps)(layout);