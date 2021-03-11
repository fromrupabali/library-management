import React, {useState, useEffect} from 'react';

import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux';

import * as actionTypes from '../../../store/actions/actionTypes';

import SpinnerModal from '../../../components/Modals/SpinnerModal/SpinnerModal';
import './Signup.css';

function SignUp (props) {
   const [redirectUrl, setRedirectUrl] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [spinner, setSpinner] = useState(false);

    const signUpHandler =async()=>{
        try {
        if(email && password && userName){
         setSpinner(true);
         const user = await axios.post(
            'http://localhost:4000/graphql',
            {
              query:`
                  mutation{
                     signUp(email:"${email}", password:"${password}", userName:"${userName}"){
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
         if(user.data.data.signUp.success){
            setRedirectUrl(<Redirect to="/"/>);
            props.signUp(user.data.data.signUp.userId,user.data.data.signUp.paidMemberShip);
            localStorage.setItem('TOKEN', user.data.data.signUp.token);
         }else{
            setErrorMessage(user.data.data.signUp.error_message)
         }
       
        }
        } catch (error) {
            throw error;
        }
    }
    function emailInputChgangeHandler (e){
        setEmail(e.target.value)
    }
    function passwordInputChgangeHandler (e){
       setPassword(e.target.value)
    }
    function userNameChangeHandler(e){
       setUserName(e.target.value);
    }
    const onSuccess = async(user) => {
       console.log(user.profileObj);
      //  console.log("Google user email", user.profileObj.email); 
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
       props.signUp(user_signin.data.data.googleSignIn.userId, user_signin.data.data.googleSignIn.paidMemberShip);
       localStorage.setItem('TOKEN', user_signin.data.data.googleSignIn.token);
       setSpinner(false);
       setRedirectUrl(<Redirect to="/"/>);
    }
    useEffect(() => {
      document.title = 'Library - Sign up';
      if(localStorage.TOKEN){
        setRedirectUrl(<Redirect to="/"/>);
      }
   }, []);
    return<div style={{width:"100%", height:"80vh", paddingTop:"100px"}}>
                 {redirectUrl}
                 <SpinnerModal show={spinner}>
                          
                  </SpinnerModal>
                 <div className="SignInContainer">
                     <h3>Sign up to  <span style={{fontSize:"50px", color:"orangered", margin:"0 20px"}}>Library</span></h3>
                     
                     <div>
                        <input value={userName} onChange={userNameChangeHandler} type="text" placeholder="User name" />
                     </div>

                     <div>
                        <input value={email} onChange={emailInputChgangeHandler} type="text" placeholder="Email" />
                     </div>
                     <div>
                        <input value={password} onChange={passwordInputChgangeHandler} type="password" placeholder="Password" />
                     </div>
                     <p style={{color: 'red'}}>{errorMessage}</p>
                     <button onClick={signUpHandler}  className="signin-button">Sign up</button>
                     <p>Or</p>
                     <GoogleLogin 
                           clientId="43347942474-b65ts1ab58is4bmhkeqduiot2l3u82fl.apps.googleusercontent.com"
                           onSuccess={onSuccess}
                           buttonText="Continue with google"
                        />
                     <p>Already have an Account ? <Link style={{margin:"0 10px"}} to="/user/signin">Sign in</Link></p>
                 </div>
          </div>
};

const mapStateToProps = state =>{
   return{
      auth: state.auth.auth
   }
}

const mapDispatchToProps = dispatch => {
   return{
      signUp: (userId, paidMemberShip) => {
         dispatch ({
            type: actionTypes.AUTH_USER,
            userId,
            paidMemberShip
         });
      }
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);