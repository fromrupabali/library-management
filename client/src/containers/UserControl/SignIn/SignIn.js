import React, { useState, useEffect } from 'react';

import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux';

import * as actionTypes from '../../../store/actions/actionTypes';

import './SignIn.css';
import SpinnerModal from '../../../components/Modals/SpinnerModal/SpinnerModal';


function SignIn(props){
    const [redirectUrl, setRedirectUrl] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [spinner, setSpinner] = useState(false);

    const signInHandler =async()=>{
        try {
         if(email && password){
          setSpinner(true);
         const user = await axios.post(
            'http://localhost:4000/graphql',
            {
              query:`
                  query{
                     signIn(email:"${email}", password:"${password}"){
                        error_message
                        success
                        token
                        paidMembership
                        userId 
                     }
                  }
              ` 
            }
         );
         setSpinner(false)
         if(user.data.data.signIn.success){
            localStorage.setItem('TOKEN', user.data.data.signIn.token);
            props.signIn(user.data.data.signIn.userId,user.data.data.signIn.paidMembership);
            setRedirectUrl(<Redirect to="/"/>);
         }else{
            setErrorMessage(user.data.data.signIn.error_message);
         }
         }
       
        } catch (error) {
            throw error;
        }
    }
    function emailInputChgangeHandler (e){
        setEmail(e.target.value);
    }
    function passwordInputChgangeHandler (e){
       setPassword(e.target.value);
    }
    const onSuccess = async(user) => { 
       setSpinner(true);
       const user_signin = await axios.post(
          'http://localhost:4000/graphql',
          {
            query:`
                mutation{
                  googleSignIn(email:"${user.profileObj.email}", userName:"${user.profileObj.name}"){
                      error_message
                      success
                      token
                      paidMembership
                      userId 
                   }
                }
            ` 
          }
       );
       setSpinner(false);
       localStorage.setItem('TOKEN', user_signin.data.data.googleSignIn.token);
       props.signIn(user_signin.data.data.googleSignIn.userId, user_signin.data.data.googleSignIn.paidMembership);
       setRedirectUrl(<Redirect to="/"/>);
    }
    useEffect(() => {
       document.title ='Library - Sign in';
       if(localStorage.TOKEN){
         setRedirectUrl(<Redirect to="/"/>);
       }
       console.log("Authentication",props.auth);
    }, [props.auth]);
    return(<div style={{width:"100%", height:"80vh", paddingTop:"100px"}}>
                     {redirectUrl}
                     <SpinnerModal show={spinner}>
                          
                     </SpinnerModal>
                      <div className="SignInContainer">
                          <h3>Sign in to  <span style={{fontSize:"50px", color:"orangered", margin:"0 20px"}}>Library</span></h3>
                          <div>
                             <input value={email} onChange={emailInputChgangeHandler} type="email" placeholder="Email" />
                          </div>
                          <div>
                             <input value={password} onChange={passwordInputChgangeHandler} type="password" placeholder="Password" />
                          </div>
                          <p style={{color: 'red'}}>{errorMessage}</p>
                          <button onClick={signInHandler}  className="signin-button">Sign in</button>
                          <p>Or</p>
                          {/* <button  className="signin-button-google">Sign in with google</button> */}
                          <GoogleLogin 
                           clientId="43347942474-b65ts1ab58is4bmhkeqduiot2l3u82fl.apps.googleusercontent.com"
                           onSuccess={onSuccess}
                           buttonText="Continue with google"
                        />
                          <p>Don't have an Account ? <Link style={{margin:"0 10px"}} to="/user/signup">Sign up</Link></p>
                      </div>
                </div>
       );
};

const mapStateToProps = state =>{
   return{
      auth: state.auth.auth
   }
}

const mapDispatchToProps = dispatch => {
   return{
      signIn: (userId, paidMemberShip) => {
         dispatch ({
            type: actionTypes.AUTH_USER,
            userId,
            paidMemberShip
         });
      }
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
