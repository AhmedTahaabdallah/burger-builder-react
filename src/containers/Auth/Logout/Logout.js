import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../../store/actions/index';

const logout = props => {
    const { onSetAuthRedirectPath, onLogout } = props;

    useEffect(() => {
        onSetAuthRedirectPath();
        onLogout();
    }, [ onSetAuthRedirectPath, onLogout ]);
    
    return <Redirect to='/'/>;
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout()),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath(['/logout', '/']))
    };
};

export default connect(null, mapDispatchToProps)(logout);