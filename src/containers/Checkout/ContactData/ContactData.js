import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from '../../../components/UI/Button/Button';
import cssClasses from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { inputChange, isIngredientsCount } from '../../../shared/utility';

const contactData = React.memo(props => {
    const [ orderForm, setOrderForm] = useState({            
        name: {
            elementType: 'input',
            value: '',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
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
        country: {
            elementType: 'input',
            value: '',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
            validation: {
                required: true,
                minLength: 3,
            },
            valid: false,
            touched: false
        },
        street: {
            elementType: 'input',
            value: '',
            elementConfig: {
                type: 'text',
                placeholder: 'Street'
            },
            validation: {
                required: true,
                minLength: 5,
            },
            valid: false,
            touched: false
        },
        zipCode: {
            elementType: 'input',
            value: '',
            elementConfig: {
                type: 'number',
                placeholder: 'ZIP Code'
            },
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5,
            },
            valid: false,
            touched: false
        },
        deliveryMethod: {
            elementType: 'select',
            value: 'fastest',
            elementConfig: {
                options: [
                    {value: 'fastest', displayValue: 'Fastest'},
                    {value: 'cheapest', displayValue: 'Cheapest'},
                ]
            },
        },
    });
    const [formIsValid, setFormIsValid] = useState(false);
    const { user } = props;

    useEffect(() => {
        if(user) {
            let inputChanges = inputChange(user.username, orderForm, 'name');
            inputChanges = inputChange(user.email, inputChanges.controls, 'email');
            setOrderForm(inputChanges.controls);
            setFormIsValid(inputChanges.formIsValid);
        }
    }, [ user ]);

    const orderHandler = (event) => {
        event.preventDefault();
        if(props.user && props.user.tokken) {
            const formData = {
                price: parseFloat(props.totalPrice),
                ingredients: props.ings,
            };
            for(let formElementIdentifier in orderForm) {
                formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
            }
            props.onOrderBurger(formData, props.user.tokken); 
        } else {
            props.onPurchaseBurgerFail('Not Auth....');
        }            
    }

    const inputChangeHandler = (event, inputIdentifier) => {
        const inputChanges = inputChange(event.target.value, orderForm, inputIdentifier);
        setOrderForm(inputChanges.controls);
        setFormIsValid(inputChanges.formIsValid);
    };

    const formElementArray = [];
    for(let key in orderForm){
        formElementArray.push({
            id: key,
            config: orderForm[key]
        });
    }
    let form = (
        <form onSubmit={orderHandler}>
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
            <Button btnType='Success' 
            disabled={!formIsValid || !isIngredientsCount(props.ings)}>Order</Button>
        </form>
    );
    if(props.loading){
        form = <Spinner />
    }
    let redirectCheckout = null;
    if(!isIngredientsCount(props.ings)) {
        redirectCheckout = <Redirect to='/checkout'/>;
    }
    return (
        <div className={cssClasses.ContactData}>
            {redirectCheckout}
            <h4>Enter your contact data</h4>
            {form}
        </div>
    );
},
(prevProps, nextProps) => {        
    if(nextProps.status === 401){
        prevProps.onSetAuthRedirectPath(['/checkout', '/checkout/contact-data']);
        prevProps.onChangeOrderStatus(200);
        prevProps.onAuthLogout();
        prevProps.history.push('/auth');
        return true;
    }
    return prevProps === nextProps ;
});

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice.toFixed(2).replace(",", "."),
        loading: state.order.loading,
        status: state.order.status,
        error: state.order.error,
        user: state.auth.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token)),
        onPurchaseBurgerFail: (error) => dispatch(actions.purchaseBurgerFail(error)),
        onAuthLogout: () => dispatch(actions.logout()),
        onChangeOrderStatus: (status) => dispatch(actions.changeOrderStatus(status)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(contactData, axios));
