import React, { useState, useEffect } from 'react';

import { Link} from 'react-router-dom';
import axios from 'axios';
import { server } from '../../Utils/utils';

import './BookSelf.css';
import Book from '../../components/Book/Book';

function BookSelf(props) {
       const [exploreCategory, setCategory] = useState({});
       const [isLoading, setLoading] = useState(false);

       const fetchExploreCategory = async() =>{
           try {
               console.log("catId",props.match.params.catId);
               const exCategory = await axios.post(
                   server,
                   {
                       query:`
                          query{
                              exploreCategory(catId:"${props.match.params.catId}"){
                                categories{
                                    _id
                                    name
                                  }
                                  books{
                                    _id
                                    title
                                    author
                                    bookCoverUrl
                                  }
                              }
                          }
                       `
                   }
               );
               setCategory(exCategory.data.data.exploreCategory);
               console.log("Category",exCategory);
               setLoading(true);

           } catch (error) {
               throw error;
           }
       }
       const switchCategory = async(catId)=> {
            try {
                console.log(catId);
                const exCategory = await axios.post(
                    server,
                    {
                        query:`
                           query{
                               exploreCategory(catId:"${catId}"){
                                 categories{
                                     _id
                                     name
                                   }
                                   books{
                                     _id
                                     title
                                     author
                                     bookCoverUrl
                                     categoryId
                                   }
                               }
                           }
                        `
                    }
                );
                setCategory(exCategory.data.data.exploreCategory);
                console.log("Category",exCategory);
                setLoading(true);
            } catch (error) {
                throw error;
            }
       } 
       useEffect(() => {
           fetchExploreCategory()
       }, [ ]);

       let books=[], categoryList=[];
       if(isLoading){
           books = exploreCategory.books.map(book =>  <Book 
                                                    key={book._id}
                                                    id={book._id}
                                                    title={book.title}
                                                    author={book.author}
                                                    coverUrl={book.bookCoverUrl}
                                             />);
           categoryList = exploreCategory.categories.map(category => {
               if(category._id === props.match.params.catId){
                 return <li style={{background:"rgb(190, 190, 190)"}}  onClick={()=> switchCategory(category._id)} key={category._id}><Link to={"/bookself/"+category._id}>{category.name}</Link></li>
               }else{
                 return <li  onClick={()=> switchCategory(category._id)} key={category._id}><Link to={"/bookself/"+category._id}>{category.name}</Link></li>
               }
           })
       }
 
        return(
            <div style={{paddingTop:"61px", paddingBottom:"30px"}}>
                <div className="mobile-catlist">
                    <ul className="categoryList">
                       {categoryList}
                    </ul>
                </div>
                <div style={{width:"100%", height:"auto"}}>
                    <div className="self-category">
                        <ul className="categoryList">
                           {categoryList}
                        </ul>
                    </div>
                    <div className="category-books">
                        {books}
                    </div>
                </div>
            </div>
        );
};

export default BookSelf;

