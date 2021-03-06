import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import cssClasses from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { inputChange, isIngredientsCount } from '../../../helper-functions/helper-functions';

class ContactData extends Component {
    state = {
        orderForm: {            
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
        },
        formIsValid: false,
    }

    componentDidMount() {
        if(this.props.user) {
            console.log('user : ', this.props.user);
            console.log('state : ', this.state.orderForm);
            let inputChanges = inputChange(this.props.user.username, this.state.orderForm, 'name');
            inputChanges = inputChange(this.props.user.email, inputChanges.controls, 'email');
            this.setState({ orderForm: inputChanges.controls, formIsValid: inputChanges.formIsValid });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {        
        if(nextProps.status === 401){
            console.log('sdsd');
            this.props.onSetAuthRedirectPath(['/checkout', '/checkout/contact-data']);
            this.props.onChangeOrderStatus(200);
            this.props.onAuthLogout();
            this.props.history.push('/auth');
            return false;
        }
        return this.props !== nextProps || this.state !== nextState;
    }

    orderHandler = (event) => {
        event.preventDefault();
        if(this.props.user && this.props.user.tokken) {
            const formData = {
                price: parseFloat(this.props.totalPrice),
                ingredients: this.props.ings,
            };
            for(let formElementIdentifier in this.state.orderForm) {
                formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
            }
            console.log(formData);
            this.props.onOrderBurger(formData, this.props.user.tokken); 
        } else {
            this.props.onPurchaseBurgerFail('Not Auth....');
        }            
    }

    inputChangeHandler = (event, inputIdentifier) => {
        const inputChanges = inputChange(event.target.value, this.state.orderForm, inputIdentifier);
        this.setState({ orderForm: inputChanges.controls, formIsValid: inputChanges.formIsValid });
    };

    render() {
        const formElementArray = [];
        for(let key in this.state.orderForm){
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
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
                <Button btnType='Success' 
                disabled={!this.state.formIsValid || !isIngredientsCount(this.props.ings)}>Order</Button>
            </form>
        );
        if(this.props.loading){
            form = <Spinner />
        }
        return (
            <div className={cssClasses.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
