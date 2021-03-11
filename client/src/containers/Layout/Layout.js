import React, { useEffect } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import { server } from '../../Utils/utils';

import NavBar from '../../components/NavBar/NavBar';
import './Layout.css';

function Layout(props){
    const fetchUser= async() =>{
        if(localStorage.TOKEN){
            
            let headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.TOKEN
            };
            const user = await axios.post(
                server,
                {
                    query:`
                       query{
                           user(token:"${localStorage.TOKEN}"){
                               _id
                               paidMembership
                           }
                       }
                    `                        
                },
                {"headers": headers}
            );
            console.log(user);
            props.userSetUp(user.data.data.user._id, user.data.data.user.paidMembership);
        }else{
            props.userSetUp2();
        }
    }
    useEffect(() => {
            fetchUser();
    }, []);

        return(
            <div>
               <div className="nav-layout">
                  <NavBar />
               </div>
                <div className="LayoutContent">
                    {props.children}
                </div>
        
            </div>
        );
};

const mapStateToProps = state => {
    return{
        auth: state.auth.auth
    }
}
const mapDispatchToProps = dispatch => {
    return{
       userSetUp: (userId, paidMemberShip) => {
          dispatch ({
             type: actionTypes.AUTH_USER,
             userId,
             paidMemberShip
          });
       },
       userSetUp2: () =>{
           dispatch({
               type: actionTypes.USER_SETUP
           })
       }
    };
 };

export default connect( mapStateToProps, mapDispatchToProps)(Layout);