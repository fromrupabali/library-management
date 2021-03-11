import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';

import { connect } from 'react-redux';
import axios from 'axios';

import * as actionTypes from '../../store/actions/actionTypes';

import './Payment.css';

function Payment(props){
    const [redirect, setRedirect] = useState(null);
    const makePayment = async(token) => {
        let headers = {
            'Content-Type': 'application/json'
        };
         await axios.post(
            'http://localhost:4000/graphql',
            {
                query:`
                   mutation{
                       payment(token:"${token}", userId:"${props.userId}"){
                          success
                       }
                   }
                `
            },
            { "headers": headers}
        );
        setRedirect(<Redirect to="/"/>);
        props.paidSetup();
    }
    return(
        <div className="Payment">
            {redirect}
            <h2>Payment</h2>
            <p>Pay 10$ and get ultimate access to <span>Library</span></p>
            <StripeCheckout
               stripeKey="pk_test_51I5VEyKIeRwnUDgWxbRUOAEmSLj8CcQ8MDV7jqlgm5gw80tRqJSV8AtMi597e0OgMVsFKoF5HgRKnh0cj22Nys7W00YbQLc2Cw"
               token={makePayment}
               amount = {1000}
               name="Premium membership"
             >
                <button className="payment-button">Pay 10$</button>
            </StripeCheckout>
        </div>
    );
};

const mapStateToProps = state => {
    return{
        userId: state.auth.userId
    }
}
const mapDispatchToProps = dispatch => {
    return{
       paidSetup: () =>{
           dispatch({
               type: actionTypes.PAID_MEMEBERSHIP
           })
       }
    };
 };

export default connect( mapStateToProps, mapDispatchToProps)(Payment);