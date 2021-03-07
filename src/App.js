import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import * as actions from './store/actions/index';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

const asyncLogout = asyncComponent(() => {
  return import('./containers/Auth/Logout/Logout');
});

class App extends Component {
  componentDidMount() {
    this.props.onAuthCheckState();
    this.props.history.replace(this.props.location.pathname);
  }

  render() {
    return (
      <div>
        <Layout>
          {!this.props.isAuth ?
            <Switch>
                <Route path='/auth' component={asyncAuth}/>
                <Route path='/' exact component={BurgerBuilder}/>
                <Redirect to='/'/>
            </Switch>
            : <Switch>
                <Route path='/auth' component={asyncAuth}/>
                <Route path='/checkout' component={asyncCheckout}/>
                <Route path='/orders' component={asyncOrders}/>
                <Route path='/logout' component={asyncLogout}/>
                <Route path='/' exact component={BurgerBuilder}/>
                <Redirect to='/'/>
            </Switch>
          }
        </Layout>
      </div>
    );
  }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
