import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import { inputChange } from '../../shared/utility';
import Spinner from '../../components/UI/Spinner/Spinner';
import cssClasses from './Auth.css';


import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        controls: {
            username: {
                elementType: 'input',
                value: '',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Full Name'
                },
                validation: {
                    required: true,
                    minLength: 5
                },
                valid: false,
                touched: false
            }, 
            email: {
                elementType: 'input',
                value: '',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            }, 
            password: {
                elementType: 'input',
                value: '',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },  
        },
        formIsValid: false,
        isSignup: false,
    };

    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath[0] === '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    submitHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for(let formElementIdentifier in this.state.controls) {
            if(formElementIdentifier === 'username' && !this.state.isSignup) {
                
            } else {
                formData[formElementIdentifier] = this.state.controls[formElementIdentifier].value;
            }
        }
        this.props.onAuth(formData, this.state.isSignup);        
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            const updatedControls = {
                ...prevState.controls,
                username: {
                    ...prevState.controls.username,
                    value: '',
                    valid: false,
                    touched: false
                },
                email: {
                    ...prevState.controls.email,
                    value: '',
                    valid: false,
                    touched: false
                },
                password: {
                    ...prevState.controls.password,
                    value: '',
                    valid: false,
                    touched: false
                }
            };
            return { 
                ...prevState,
                controls: updatedControls,
                isSignup: !prevState.isSignup,
                formIsValid: false,

            };
        });
    }

    inputChangeHandler = (event, inputIdentifier) => {
        let newControls = {...this.state.controls};
        const oldUserName = newControls.username;
        if(!this.state.isSignup) {
            delete newControls.username;
        }
        const inputChanges = inputChange(event.target.value, newControls, inputIdentifier);
        const newInputChangesControls = {...inputChanges.controls};
        this.setState({ 
            controls: { username: oldUserName, ...newInputChangesControls}, 
            formIsValid: inputChanges.formIsValid 
        });
    };

    render() {
        const formElementArray = [];
        for(let key in this.state.controls){
            if(key === 'username' && !this.state.isSignup) {
                
            } else {
                formElementArray.push({
                    id: key,
                    config: this.state.controls[key]
                });
            }            
        }
        let form = (
            <form onSubmit={this.submitHandler}>
                {formElementArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType} 
                        elementConfig={formElement.config.elementConfig} 
                        value={formElement.config.value} 
                        invalid={!formElement.config.valid} 
                        shouldValidate={formElement.config.validation} 
                        touched={formElement.config.touched} 
                        changed={event => this.inputChangeHandler(event, formElement.id)} 
                    />
                ))}
                {this.props.error ? <p>{this.props.error}</p> : null}
                <Button btnType='Success' disabled={!this.state.formIsValid}>{!this.state.isSignup ? 'Login' : 'Signup'}</Button>
            </form>
        );
        if(this.props.loading){
            form = <Spinner />
        }
        let authRedirect = null;
        if(this.props.isAuth) {
            authRedirect = <Redirect to={this.props.authRedirectPath[1]}/>
        }
        return (
            <div className={cssClasses.Auth}>
                {authRedirect}
                <h4>Enter your {!this.state.isSignup ? 'Login' : 'Signup'} data</h4>
                {form}
                <Button btnType='Danger' clicked={this.switchAuthModeHandler}>Switch To {this.state.isSignup ? 'Login' : 'Signup'}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        loading: state.auth.loading,
        isAuth: state.auth.user !== null,
        buildingBurger: state.burgerBuilder.buildingBurger,
        authRedirectPath: state.auth.authRedirectPath,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (formData, isSignup) => dispatch(actions.auth(formData, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath(['/auth', '/']))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Auth, axios));
