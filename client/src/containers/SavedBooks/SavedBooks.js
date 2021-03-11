import React, {useState, useEffect } from 'react';

import { Link, Redirect } from 'react-router-dom';

import axios from 'axios';

import './SavedBooks.css';
import Book from '../../components/Book/Book';

function SavedBooks(){
    const[savedBooks, setBooks] = useState([]);
    const [complete, setComplete] = useState(false);
    const[redirect, setRedirect] = useState(null)
    
    const fecthBooks = async() =>{
        try {
            const books = await axios.post(
                'http://localhost:4000/graphql',
                {
                    query:`
                      query{
                          savedBooks(token:"${localStorage.TOKEN}"){
                            _id
                            bookCoverUrl
                            bookFileUrl
                            title
                            author
                          }
                      }
                    `
                }
            );
            setBooks(books.data.data.savedBooks);
            setComplete(true);
        } catch (error) {
             throw error;
        }
    }
    useEffect(()=>{ 
       if(localStorage.TOKEN){
          fecthBooks()
       }else{
         setRedirect(<Redirect to="/" />);
       }
      }, []);
    let all_books;
    if(complete){
    all_books = savedBooks.length > 0 ? 
    <div>
      <h3>Your saved Books</h3>
      <div className="all-saved-books">
         {savedBooks.map(book => <Book    
                                    key={book._id}
                                    id={book._id}
                                    title={book.title}
                                    author={book.author}
                                    coverUrl={book.bookCoverUrl}/>)}
      </div>
    </div>:<div className="no-save-books">
              <h3>You have no save books</h3>
              <Link to="/">Explore</Link>
           </div>;
    }
    return(
        <div className="saved-books">
            {redirect}
            <div>
               {all_books}
            </div>
        </div>
    );
}
export default SavedBooks;