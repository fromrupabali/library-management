import React from 'react';

import { Link } from 'react-router-dom';

import './AdminBook.css';

const adminBook = (props) => {
    return(
        <div className="AdminBook">
         <Link to={"/book/"+props.bookId}>
            <img src={props.coverUrl ? props.coverUrl : "https://shopcatalog.com/wp-content/uploads/2018/10/saltwater.jpg"} alt="book"/>
        </Link>
           <h4 style={{margin:"0 5px", padding:"0"}}>{props.title.substring(0,20)}</h4>
           <p>{props.author}</p>
           {props.paidStatus ? <p>Paid</p>: <p>Free</p>}
           <button onClick={()=> props.deleteHandler(props.bookId, props.id)}>Delete</button>
           <button onClick={()=>props.updateBookModalHandler(props.bookId, props.id)}>Update</button>
        </div>
    );
};

export default adminBook;