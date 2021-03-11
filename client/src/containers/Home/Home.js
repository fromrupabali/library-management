import React, { useEffect } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import { server } from '../../Utils/utils';

import Collection from '../../components/BooksCollection/BooksCollection';
import './Home.css';
import Footer from '../../components/Footer/Footer';

function Home(props){
    const fetchFeed = async() =>{
        try {
            const response = await axios.post(
                server,
                {
                  query:`
                   query{
                    userFeed{
                      _id
                      name
                      books{
                        _id
                        bookCoverUrl
                        bookFileUrl
                        title
                        author
                      }
                    }
                  }
                   `  
             }
         );
         console.log(response);
         props.homeSet(response.data.data.userFeed);
        } catch (error) {
            throw error;
        }
    }
    let booksCollection;
    if(props.homeSetUp){
        booksCollection = props.data.map(collection => {
            return<Collection
                        key={collection._id}
                        id={collection._id}
                        name={collection.name}
                        books={collection.books}
                      />
        })
    }
    useEffect(()=>{
        if(!props.homeSetUp){
            fetchFeed()
        }
    }, []);
     return(
            <div style={{paddingTop:"70px"}}>
                <div className="header">
                    <div className="header-text">
                       <h1 style={{textAlign:"center", margin:"0", color:"white", width:"100%", textTransform:"uppercase", padding:"60px 0 0 0"}}>Read millions of Books</h1>
                       <p style={{textAlign:"center", margin:"0", color:"white", width:"100%", fontSize:"20px", fontStyle:"italic"}}>"There is no friend as loyal as a book"</p>
                    </div>
                </div>
                <div className="CollectionsContainer">
                   {booksCollection}
                </div>
                <Footer />
            </div>
        );

};

const mapStateToProps = state => {
    return{
        homeSetUp: state.data.homeSetup,
        data: state.data.data
    }
}
const mapDispatchToProps = dispatch => {
    return{
      homeSet: (data) => {
          dispatch ({
             type: actionTypes.HOME_SETUP,
             data
          });
       }
    };
 };

export default connect( mapStateToProps, mapDispatchToProps)(Home);

