import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Document, Page,pdfjs } from "react-pdf";
import { FacebookShareButton, RedditShareButton,RedditIcon,WhatsappShareButton, WhatsappIcon,FacebookIcon,TwitterShareButton ,TwitterIcon } from "react-share"

import { connect } from 'react-redux';
import { server, domain } from '../../Utils/utils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faStar } from '@fortawesome/free-solid-svg-icons';

import './BookReader.css';
import Review from '../../components/Review/Review';
import PaymentModal from '../../components/Modals/PaymentModal/PaymentModal';
import SpinnerModal from '../../components/Modals/SpinnerModal/SpinnerModal'; 

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

 function BookReader(props){
     const [reviews, setReviews] = useState([]);
     const [numPages, setNumPages] = useState(null);
     const [pageNumber, setPageNumber] = useState(1);
     const [bookDoc, setBook] = useState({});
     const [reviewText, setReviewText] = useState('');
     const [complete, setComplete] = useState(false);
     const [save, setSave] = useState(false);
     const [paid, setPaid] = useState(false);
     const [redirect, setRedirect]=useState(null);
     const [rating, setRating] = useState(5);
     const [spinner, setSpinner] = useState(false);

     const fetchBook = async () => {
      setSpinner(true);
      const book1 = await axios.post(
        server,
        {
            query:`
              query{
                  book(bookId:"${props.match.params.bookId}"){
                      _id
                      title
                      author
                      paidStatus
                      bookFileUrl
                      bookCoverUrl
                      userReviews{
                        _id
                        reviewText
                        rating
                        createdAt
                        user{
                          _id
                          userName
                         }
                      }
                  }
              }`
        }
    );
    setSpinner(false);
    setBook(book1.data.data.book);
    console.log(book1);
    setReviews(book1.data.data.book.userReviews);
    setComplete(true);

    if(book1.data.data.book.paidStatus && !props.paidMemberShip){
       setPaid(true);
    }else{
        setPaid(false);
    }
 }


 function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  function nextPage() {
      if(pageNumber < numPages){
         setPageNumber(pageNumber + 1);
      }
  }
  function prevPage() {
    if(pageNumber > 1){
        setPageNumber(pageNumber - 1);
    } 
 }
 const reviewTextHandler = (e) =>{
     setReviewText(e.target.value);
 }
 const addreviewHandler = async()=>{
      try {
          setSpinner(true);
          let reviewTxt = reviewText.replace(/(?:\r\n|\r|\n)/g, '');
          const createReview = await axios.post(
              server,
              {
                  query:`
                     mutation{
                        createReview(reviewInput:
                            {reviewText:"${reviewTxt}",
                              userId:"${props.userId}",
                              bookId:"${bookDoc._id}",
                              rating:${rating}}){
                                   _id
                                  reviewText
                                  createdAt
                                  rating
                            user{
                              _id
                              userName
                            }
                          }
                     }
                  `
              }
          );
          setReviewText('');
          console.log(createReview);
          setReviews(createReview.data.data.createReview);
          setSpinner(false);

      } catch (error) {
          throw error;
      }
 }
 const bookMarkHandler = async() =>{
     setSave(true);
     console.log("User id",props.userId);
     await axios.post(
         server,
         {
             query:`
                mutation{
                    saveBook(userId:"${props.userId}", bookId:"${bookDoc._id}"){
                        _id
                    }
                }
             `
         }
     )
 }
 const bookMarkRemoverHandler = async() => {
     setSave(false);
     await axios.post(
        server,
        {
            query:`
               mutation{
                   removeBook(userId:"${props.userId}", bookId:"${bookDoc._id}"){
                       _id
                   }
               }
            `
        }
    )
 };
 const paymentHandler = () => {
     if(localStorage.TOKEN){
        setRedirect(<Redirect to="/payment"/>);
     }else{
         setRedirect(<Redirect to="/user/signin"/>);
     }
 }
 const ratingHandler = (rat) =>{
     setRating(rat);
 }
    useEffect(() => {
        fetchBook()
        document.title ="Book";
        window.scrollTo(0,0);
    },[]);
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
    const all_ratings =  ratings.map(rat => {
       if(rat.id > rating){
           return<button className="not-active-rating" onClick={()=>ratingHandler(rat.id)} key={rat.id} ><FontAwesomeIcon  icon={faStar}/></button>
       }else{
        return<button className="active-rating" onClick={()=>ratingHandler(rat.id)} key={rat.id}><FontAwesomeIcon  icon={faStar}/></button>
       }
    });
   let  saveButton;
    if(localStorage.TOKEN){
       saveButton =  save ?  <button onClick={bookMarkRemoverHandler} className="save-book" ><span style={{margin:"0 5px"}}><FontAwesomeIcon icon={faBookmark}/></span>Save</button>:
        <button onClick={bookMarkHandler} className="save-book-2" ><span style={{margin:"0 5px"}}><FontAwesomeIcon icon={faBookmark}/></span>Save</button>
    }else{
        saveButton = <Link className="user-save-link" to="/user/signin"><span><FontAwesomeIcon icon={faBookmark}/></span>Save</Link>
    }
    let bookMain;
    if(complete && props.userSetUp){
        bookMain = <div>
            {redirect}
        
         <PaymentModal show={paid}>
              <div className="premium-membership">
                <h3>This book is available for premium members.</h3>
                <p>Get premium membership and read paid books</p>
                <button onClick={paymentHandler}>Get premium membership</button>
              </div>
        </PaymentModal>
        <div className="BookReaderContainer">
        <div>
          <div className="BookHeader">
               <div className="BookReaderCover">
                 <img src={bookDoc.bookCoverUrl ? bookDoc.bookCoverUrl :"https://shopcatalog.com/wp-content/uploads/2018/10/saltwater.jpg"} alt="book"/>
               </div>
                <div className="BookReaderIntro">
                    <h1>{bookDoc.title}</h1>
                    <p style={{fontStyle:"italic"}}>{bookDoc.author}</p>
                    <div style={{padding:"10px 0"}}>
                     <p style={{fontSize:"20px", color:"orangered", fontWeight:"bold"}}>Share on</p>
                    <FacebookShareButton
                     url={"https://library.com/book/"+props.match.params.bookId}
                     hashtag="#programing joke">
                     <FacebookIcon  size={32} round={true} />
                 </FacebookShareButton>
                 <TwitterShareButton
                     url={"https://library.com/book/"+props.match.params.bookId}
                     >
                     <TwitterIcon  size={32} round={true} />
                 </TwitterShareButton>
                 <RedditShareButton
                     url={"https://library.com/book/"+props.match.params.bookId}
                    >
                     <RedditIcon  size={32} round={true} />
                 </RedditShareButton>
                 <WhatsappShareButton
                     url={"https://library.com/book/"+props.match.params.bookId}
                     >
                     <WhatsappIcon  size={32} round={true} />
                 </WhatsappShareButton>
                 </div>
                { saveButton }
                </div>
            </div>
            <div className="BookPages">
            <Document
               file={bookDoc.bookFileUrl}
               onLoadSuccess={onDocumentLoadSuccess}
             >
         
           <Page  pageNumber={pageNumber}/>
         </Document>
             {/* Jump to page  <input value={jPage} onChange={jumpInputHandler}  type="number"/> <button onClick={jumpPage}>jump</button> */}
             <p>Page {pageNumber} of {numPages}</p>
             <button className="page-change" onClick={prevPage}>Prev</button>
             <button className="page-change" onClick={nextPage}>Next</button>
          </div>
        </div>
        </div>
        <div className="user-reviews">
           {
               localStorage.TOKEN ?  
                    <div>
                     <h3>Reviews and ratings</h3>
                     <div className="review-container">
                        <div style={{margin:"10px 0"}}>
                           {all_ratings}
                        </div>
                         <textarea value={reviewText} onChange={reviewTextHandler}  placeholder="Write a review"/>
                        { reviewText ?  <button className="review-button" onClick={addreviewHandler}>Review</button>: <button className="review-button"  disabled={true}>Review</button> }
                     </div>
                     {
                         reviews.map(review => <Review 
                                                 key={review._id}
                                                 text={review.reviewText}
                                                 rating={review.rating}
                                                 user={review.user}
                                                 date={review.createdAt}
                                                 userId={props.userId}
                                                />)
                     }
               </div>: 
               <div style={{width:"100%", border:"1px solid #eeee", padding:"80px 0", borderRadius:"10px", textAlign:"center"}}>
                   <Link className="sign-see-reviews" to="/user/signin"> Sign in to see reviews</Link>
               </div>
           }
        </div>
     </div>
    }else{
        bookMain = <div></div>
    }
    return<div>
         <SpinnerModal show={spinner}></SpinnerModal>
         {bookMain}
    </div>
};

const mapStateToProps = state =>{
    return{
       userSetUp:state.auth.userSetUp,
       auth: state.auth.auth,
       userId: state.auth.userId,
       paidMemberShip: state.auth.paidMemberShip
    }
 }
 

 
 export default connect(mapStateToProps)(BookReader);

