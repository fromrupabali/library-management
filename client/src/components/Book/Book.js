import React from 'react';
import { Link } from 'react-router-dom';

import './Book.css';

const Book = (props) => {
    return(
        <Link to={"/book/"+props.id} className="Book">
            <div className="book-cover">
                <img src={props.coverUrl ? props.coverUrl : "https://shopcatalog.com/wp-content/uploads/2018/10/saltwater.jpg"} alt="book"/>
            </div>
            <h4>{props.title}</h4>
            <p>{props.author}</p>
        </Link>
    );
};

export default Book;