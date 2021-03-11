import React from 'react';

import { Link } from 'react-router-dom';

import './BooksCollection.css';
import Book from '../Book/Book';

const bookCollection = (props) => {
    const books = props.books.map(book => {
        return<Book
                  key={book._id}
                  id={book._id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.bookCoverUrl}
                />
    });
    return<div className="BooksCollection">
            <div style={{width:"100%", height:"60px"}}>
                <h2 style={{float:"left", margin:"0", padding:"0"}}>{props.name}</h2>
                <Link to={"/bookself/"+props.id} className="collection-see-more-button">See More</Link>
            </div>
            <div className="BooksContainer">
                {books}
            </div>
          </div>
};

export default bookCollection;