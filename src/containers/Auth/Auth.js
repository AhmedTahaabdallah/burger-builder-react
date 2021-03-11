import React, { useState, useEffect } from 'react';
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

const auth = props => {
    const [ authForm, setAuthForm ] = useState({
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
    });
    const [ formIsValid , setFormIsValid] = useState(false);
    const [ isSignup , setIsSignup] = useState(false);

    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;
    
    useEffect(() => {
        if(!buildingBurger && authRedirectPath[0] === '/') {
            onSetAuthRedirectPath();
        }
    }, [ buildingBurger, authRedirectPath, onSetAuthRedirectPath ]);

    const submitHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for(let formElementIdentifier in authForm) {
            if(formElementIdentifier === 'username' && !isSignup) {
                
            } else {
                formData[formElementIdentifier] = authForm[formElementIdentifier].value;
            }
        }
        props.onAuth(formData, isSignup);        
    }

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
        setFormIsValid(false);
        setAuthForm(prevState => {
            const updatedControls = {
                ...prevState,
                username: {
                    ...prevState.username,
                    value: '',
                    valid: false,
                    touched: false
                },
                email: {
                    ...prevState.email,
                    value: '',
                    valid: false,
                    touched: false
                },
                password: {
                    ...prevState.password,
                    value: '',
                    valid: false,
                    touched: false
                }
            };
            return updatedControls;
        });
    }

    const inputChangeHandler = (event, inputIdentifier) => {
        let newControls = {...authForm};
        const oldUserName = newControls.username;
        if(!isSignup) {
            delete newControls.username;
        }
        const inputChanges = inputChange(event.target.value, newControls, inputIdentifier);
        const newInputChangesControls = {...inputChanges.controls};
        setAuthForm({ username: oldUserName, ...newInputChangesControls});
        setFormIsValid(inputChanges.formIsValid );
    };

    const formElementArray = [];
    for(let key in authForm){
        if(key === 'username' && !isSignup) {
            
        } else {
            formElementArray.push({
                id: key,
                config: authForm[key]
            });
        }            
    }
    let form = (
        <form onSubmit={submitHandler}>
            {formElementArray.map(formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value={formElement.config.value} 
                    invalid={!formElement.config.valid} 
                    shouldValidate={formElement.config.validation} 
                    touched={formElement.config.touched} 
                    changed={event => inputChangeHandler(event, formElement.id)} 
                />
            ))}
            {props.error ? <p>{props.error}</p> : null}
            <Button btnType='Success' disabled={!formIsValid}>{!isSignup ? 'Login' : 'Signup'}</Button>
        </form>
    );
    if(props.loading){
        form = <Spinner />
    }
    let authRedirect = null;
    if(props.isAuth) {
        authRedirect = <Redirect to={props.authRedirectPath[1]}/>
    }
    return (
        <div className={cssClasses.Auth}>
            {authRedirect}
            <h4>Enter your {!isSignup ? 'Login' : 'Signup'} data</h4>
            {form}
            <Button btnType='Danger' clicked={switchAuthModeHandler}>Switch To {isSignup ? 'Login' : 'Signup'}</Button>
        </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(auth, axios));
