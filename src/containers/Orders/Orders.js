import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    state ={
        allOrders: [],
        isLoadingAllOrders: true,
        error: false
    }
    componentDidMount() {
        const data = {            
            query: `
                {
                    getAllOrders {
                        id
                        price
                        deliveryMethod
                        ingredients
                        customer {
                            name
                            email
                            address {
                                street
                                country
                                zipCode
                            }
                        }
                    }
                }
            `, 
        };
        axios.post('/graphql', data)
        .then(response => {
            console.log(response);
            this.setState({
                isLoadingAllOrders: false
            });
            if(response){
                if(response.data) {
                    if(response.data.data) {
                        if(response.data.data.getAllOrders){
                            this.setState({
                                allOrders: [...response.data.data.getAllOrders],
                                isLoadingAllOrders: false
                            });
                        } else {
                            this.setState({error: true,});
                        } 
                    } else {
                        this.setState({error: true,});
                    }                 
                } else {
                    this.setState({error: true,});
                } 
            } else {
                this.setState({error: true,});
            } 
        })
        .catch(err => {
            console.log(err);
            this.setState({isLoadingAllOrders: false,});
        });
    }

    render() {
        let orders = null;
        if(this.state.isLoadingAllOrders) {
            orders = <div style={{ marginTop: '300px'}}><Spinner /></div>; 
        } else if(this.state.error) {
            orders = <p style={{ textAlign: 'center', marginTop: '300px'}}>Orders can't be loaded!</p> ;
        } else {
            if(this.state.allOrders.length > 0) {
                orders = this.state.allOrders.map(order => {
                    return <Order
                        key={order.id}
                        price={order.price}
                        ingredients={order.ingredients}
                    />;
                });
            } else {
                orders = <p style={{ textAlign: 'center', marginTop: '300px'}}>There is no Orders...</p> ;
            }            
        }
        return (<div>
            {orders}
        </div>);
    }
}

export default withErrorHandler(Orders, axios);
