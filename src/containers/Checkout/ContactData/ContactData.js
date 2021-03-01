import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import cssClasses from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

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
                    type: 'text',
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
        isLoadingAddOrder: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({isLoadingAddOrder: true});
        console.log(typeof(this.props.price));
        const formData = {
            price: parseFloat(this.props.price),
            ingredients: this.props.ingredients,
        };
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const data = {            
            query: `
                mutation createNewOrde ($price: Float!,$deliveryMethod: String!, $email: String!, $name: String!, $country: String!, $street: String!, $zipCode: String!, $ingredients: JSON!){
                    createNewOrde(price:$price, deliveryMethod:$deliveryMethod, email: $email, name: $name, country: $country, street: $street, zipCode: $zipCode, ingredients: $ingredients)
                    {
                    status, msg
                    
                    }
                }
            `,
            variables: formData,  
        };
        axios.post('/graphql', data)
        .then(response => {
            console.log(response);
            this.setState({
                isLoadingAddOrder: false
            });
            this.props.history.push('/');
        })
        .catch(err => {
            console.log(err);
            this.setState({isLoadingAddOrder: false,});
        });
    }

    checkValidity(value, rules) {
        let isValid = true;
        if(!rules) {
            return true;
        }
        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength) {
            isValid = value.trim().length >= rules.minLength && isValid;
        }
        if(rules.maxLength) {
            isValid = value.trim().length <= rules.maxLength && isValid;
        }
        if(rules.isEmail) {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
            isValid = re.test(value) && isValid;
        }
        return isValid;
    }

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedOrderForm = { ...this.state.orderForm };
        const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputtIdentifier in updatedOrderForm) {
            if(updatedOrderForm[inputtIdentifier].valid !== undefined) {
                formIsValid = updatedOrderForm[inputtIdentifier].valid && formIsValid;
            }            
        }

        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
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
                <Button btnType='Success' disabled={!this.state.formIsValid}>Order</Button>
            </form>
        );
        if(this.state.isLoadingAddOrder){
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

export default ContactData;
