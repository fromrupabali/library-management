import React, {useState} from 'react';

import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import * as actionTypes from '../../store/actions/actionTypes';
import Logo from '../../assets/logo.png';
import './NavBar.css';
import MenuModal from '../Modals/UserMenuModal/UserMenuModal';

function NavBar (props){
    const [menuModal, setMenuModal]= useState(false);
    const[redirect, setRedirect] = useState(null);
    const [searchText, setSearchText] = useState(null);

    const onChangeHandler = (e) => {
         setSearchText(e.target.value);
    }
    const menuModalHandler = () => {
        menuModal ? setMenuModal(false) : setMenuModal(true);
    }
    const LogoutHandler = () =>{
        props.logOut();
        setMenuModal(false);
    }
    const searchHandler = (e) =>{
       if(e.keyCode === 13){
         setRedirect(<Redirect to={"/search/"+ searchText} />)
       }
    }
    return(
        <div style={{width:"100%", height:"60px", background:"white",borderBottom:'1px solid rgb(226, 224, 224)', boxShadow:'1px 1px 5px 0px rgb(228, 227, 227)'}}>
        {redirect}
        <MenuModal show={menuModal} menuModalHandler={menuModalHandler}>
            <div className="menu-link">
              <Link to="/saved-books" onClick={()=>setMenuModal(false)} >Your saved books</Link>
            </div>
            <div className="menu-link">
              <Link to="/" onClick={LogoutHandler}>Log out</Link>
           </div>
           
        </MenuModal>
         <div className="Dekstop-nav">
         <div className="NavLeft">
             {/* <img style={{width:"40px"}} src={Logo} alt="logo"/> */}
             <Link to="/" style={{width:"30%",height:"100%", float:"left", textDecoration:"none"}}>
                <img style={{width:"40px", float:"left"}} src={Logo} alt="logo"/> 
                <h1 className="logo-text" style={{width:"70%", float:"right", margin:"5px 0 0 0", padding:"0", color:"orangered", fontSize:"20px"}}>LIBRARY</h1>
             </Link>
             <div style={{width:"70%",height:"100%", float:"right"}}>
                 <input value={searchText} onChange={onChangeHandler} autoComplete="off" onKeyUp={(e)=>searchHandler(e)} className="seacrhBox" type="text" placeholder="Search book"/>
             </div>
          </div>
        {
            props.auth ? <div className="NavRight"><button onClick={menuModalHandler} to="/user"><FontAwesomeIcon icon={faUser}/></button></div> :  <div className="NavRight">
            <Link className="signup-link"  to="/user/signup"> Sign up</Link>
            <Link className="signin-link" to="/user/signin"> Sign in</Link>
       </div>
        }
         </div>
         <div className="mobile-nav"></div>
        </div>
    );
};
const mapStateToProps = state =>{
    return{
       auth: state.auth.auth
    };
 };

 const mapDispatchToProps = dispatch => {
    return{
       logOut: () => {
          dispatch ({
             type: actionTypes.LOG_OUT
          });
       }
    };
 };
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);