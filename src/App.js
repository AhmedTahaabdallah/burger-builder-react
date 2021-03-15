import React, { Suspense, useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import * as actions from './store/actions/index';
import ShowSnackbar from './components/UI/ShowSnackbar/ShowSnackbar';

const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

const Logout = React.lazy(() => {
  return import('./containers/Auth/Logout/Logout');
});

const app = props => {
  const { onAuthCheckState } = props;
  useEffect(() => {
    onAuthCheckState(); 
  }, [ onAuthCheckState ]);

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading....</p>}>
          <ShowSnackbar />
          {<Switch>
                <Route path='/auth' render={(props) => <Auth {...props}/>}/>
                <Route path='/checkout' render={(props) => <Checkout {...props}/>}/>
                <Route path='/orders' render={(props) => <Orders {...props}/>}/>
                <Route path='/logout' render={(props) => <Logout {...props}/>}/>
                <Route path='/' exact component={BurgerBuilder}/>
                <Redirect to='/'/>
            </Switch>}
          </Suspense>
      </Layout>
    </div>
  );
}

const mapStateToProps = state => {
  return {
      isAuth: state.auth.user !== null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
      onAuthCheckState: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
