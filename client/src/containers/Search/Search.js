import React, {useState, useEffect, useRef} from 'react';

import axios from 'axios';
import { server } from '../../Utils/utils';

import './Search.css';
import Book from '../../components/Book/Book';

function Search(props) {
    const[books, setBooks] = useState([]);
    const[complete, setComplete] = useState(false);

    const search = async() =>{
        const searchResult = await axios.post(
            server,
            {
                query:`
                   query{
                       search(searchText:"${props.match.params.searchText}"){
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
        setBooks(searchResult.data.data.search);
        setComplete(true);
    }
    const mounted = useRef();
    useEffect(() =>{
        if(!mounted.current){
            search();
            mounted.current = true;
        }else{
           search();
        }
    });

    return<div className="library-search">
        <p>Result shows for <span style={{color:"orangered", fontStyle:"italic"}}>{props.match.params.searchText}</span></p>
        <div className="all-search-books">
            {complete ? books.map(book => <Book 
                                            key={book._id}
                                            id={book._id}
                                            title={book.title}
                                            author={book.author}
                                            coverUrl={book.bookCoverUrl}/>):null}
        </div>
    </div>
};
export default Search;