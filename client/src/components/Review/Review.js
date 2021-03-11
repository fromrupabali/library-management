import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Review.css';

const review = (props) => {
  const ratings = [
    {
        id:1
    },
    {
        id:2
    },
    {
        id:3
    },
    {
        id:4
    },
    {
        id:5
    }

];
    return<div className="user-review">
              <h5>{props.user.userName}</h5>
              {ratings.map(rat=>{
                if(rat.id<=props.rating){
                  return<button className="active-rating" key={rat.id}><FontAwesomeIcon  icon={faStar}/></button>
                }else{
                  return null
                }
              })}
              <p>{props.text}</p>
              {props.userId === props.user._id ? <div className="review-buttons"><button><FontAwesomeIcon icon={faEdit}/></button><button><FontAwesomeIcon icon={faTrash}/></button></div>:null}
           </div>
};

export default review;