import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMutation, gql} from '@apollo/client';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import { server } from '../../Utils/utils';

import './AdminControl.css';
import Book from '../../components/AdminBook/AdminBook';
import AddBookModal from '../../components/Modals/AddBookModal/AddBookModal';
import UpdateBookModal from '../../components/Modals/UpdateBookModal/UpdateBooModal';
import SpinnerModal from '../../components/Modals/SpinnerModal/SpinnerModal';
import AdminLoginModal from '../../components/Modals/AdminLoginModal/AdminLoginModal';
import DeleteBookModal from '../../components/Modals/DeleteBookModal/DeleteBookModal';

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!){
    uploadFile(file: $file){
      url
    }
  }
`;
const UPLOAD_BOOK_COVER = gql`
  mutation uploadBookCover($file: Upload!){
    uploadBookCover(file: $file){
      url
    }
  }
`;
function AdminControl(props){
     const [adminAuth, setAdminAuth]= useState(true);
     const [userName, setUserName] = useState('');
    const [error_message, setErrorMessage] = useState('');
     const [password, setPassword] = useState('');
     const [addBookModal, setBookModal] = useState(false);
     const [updateBookModal, setUpdateModal] = useState(false);
     const [updateBookId, setUpdateBookId] = useState(null);
     const [update, setUpdate]= useState(false);
     const [bookTitle, setBookTitle]= useState('');
     const [bookAuthor, setBookAuthor] = useState('');
     const [bookCategory, setBookCategory] = useState('');
     const [bookUrl, setBookUrl] = useState('');
     const [bookCoverUrl, setCoverUrl] = useState('');
     const [paidStatus, setPaidStatus] = useState(false);
     const [complete, setComplete] = useState(false);
     const [allCategories, setAllCategories] = useState([]);
     const [allBooks, setAllBooks] = useState([]);
     const [spinner, setSpinner] = useState(false);
     const [deleteBookModal, setDeleteBookModal] = useState(false);
     const [delId, setDelId]= useState(null);
     const [delBookId, setDelBookId] = useState(null);

  function userNameInputChgangeHandler (e){
      setUserName(e.target.value);
  }
  function passwordInputChgangeHandler (e){
     setPassword(e.target.value);
  }

     const addBookModalHandler = () => {
        setBookTitle('');
        setBookAuthor('');
        setBookCategory(allCategories[0]._id);
        setBookUrl('');
        setCoverUrl('');
        setPaidStatus(false);
        addBookModal ? setBookModal(false) : setBookModal(true);
     }
     const updateBookModalHandler = (bookId, id) => {
         setUpdateBookId(bookId);
         setBookTitle(allBooks[id].title);
         setBookAuthor(allBooks[id].author);
         setBookCategory(allBooks[id].categoryId);
         setBookUrl(allBooks[id].bookFileUrl);
         setCoverUrl(allBooks[id].bookCoverUrl);
         setPaidStatus(allBooks[id].paidStatus);
         setUpdate(true);
         updateBookModal ? setUpdateModal(false): setUpdateModal(true);
     }
     const updateBookModalHandler2 = () =>{
       setUpdateModal(false);
     }
   const [uploadFile] = useMutation(UPLOAD_FILE, {
      onCompleted: data => setBookUrl(data.uploadFile.url)
  });
  const [uploadBookCover] = useMutation(UPLOAD_BOOK_COVER, {
    onCompleted: data => setCoverUrl(data.uploadBookCover.url)
});
  const handleFileChange = e => {
      const file = e.target.files[0];
      uploadFile({ variables: { file}})
  }
  const handleCoverFileChange = e =>{
    const file = e.target.files[0];
    console.log(file);
    uploadBookCover({variables: { file }})
  }
  const bookTitleHandleChange = e =>{
    setBookTitle(e.target.value);
  }
  const bookAuthorHandleChange = e =>{
    setBookAuthor(e.target.value);
  }
  const bookCategoryChangeHandler = e =>{
      setBookCategory(e.target.value)
  }
  const paidStatusHandler = e => {
      setPaidStatus(e.target.value)
  }

  const adminLoginHandler = async() =>{
    try {
      if(userName && password){
        setSpinner(true);
        setAdminAuth(false);
        const admin = await axios.post(
          server,
          {
            query:`
                query{
                  adminLogin(userName:"${userName}", password:"${password}"){
                    success
                    token
                    error_message
                  }
                }
            `
          }
        );
        console.log(admin);
        if(admin.data.data.adminLogin.success){
            localStorage.setItem('adminToken',admin.data.data.adminLogin.token);
            setSpinner(false);
            props.adminSetup();
        }else{
           setErrorMessage(admin.data.data.adminLogin.error_message);
           setAdminAuth(true);
        }
        console.log(admin);
      }
    } catch (error) {
      throw error;
    }
  }

  const addBookHandler = async() =>{
    if(bookTitle, bookAuthor, bookCategory, paidStatus, bookUrl){
     setSpinner(true);
     setBookModal(false);
    const addNewBook = await axios.post(
      server,
      {
        query:`
           mutation{
             addBook(bookInput:{
               title:"${bookTitle}", author:"${bookAuthor}", bookFileUrl:"${bookUrl}", bookCoverUrl:"${bookCoverUrl}" categoryId:"${bookCategory}", paidStatus:${paidStatus}}){
                _id
                title
                author
                bookFileUrl
                bookCoverUrl
                categoryId
                paidStatus
             }
           }
        `
      }
    );
    console.log(addNewBook);
    await setAllBooks(addNewBook.data.data.addBook);
    setSpinner(false);
    setBookTitle('');
    setBookAuthor('');
    setBookCategory(allCategories[0]._id);
    setBookUrl('');
    setCoverUrl('');
    }
  };
  const updateBookHandler = async() =>{
    setSpinner(true);
    setUpdateModal(false);
    const updateBook = await axios.post(
      server,
      {
        query:`
           mutation{
             updateBook(
               bookId:"${updateBookId}",title:"${bookTitle}", author:"${bookAuthor}", bookFileUrl:"${bookUrl}", categoryId:"${bookCategory}", paidStatus:${paidStatus}, bookCoverUrl:"${bookCoverUrl}"){
               _id
               title
               bookFileUrl
               bookCoverUrl
               categoryId
               author
               paidStatus
             }
           }
        `
      }
    );
    await setAllBooks(updateBook.data.data.updateBook);
    setSpinner(false);
  };
  const deleteBookModalHandler = (delBookId, delId) =>{
        setDelId(delId);
        setDelBookId(delBookId);
        setDeleteBookModal(true);
  }
  const deleteBookModalCancelHandler = () =>{
    setDelId(null);
    setDelBookId(null);
    setDeleteBookModal(false);
}
  const deleteBookHandler = async() =>{
    try {
      const books = allBooks.filter((book, id) => {
          return delId !== id
      });
      setAllBooks(books);
      setDeleteBookModal(false);
       await axios.post(
        server,
        {
          query:`
              mutation{
                deleteBook(bookId:"${delBookId}"){
                    _id
                  }
              }
           `
        }
      );
   
    } catch (error) {
      throw error;
    }
  }
  const dashboard = async() => {
    try {
      setSpinner(true);
        const response = await axios.post(
          server,
          {
            query:`
                query{
                  dashboard{
                    categories{
                      _id
                      name
                    }
                    books{
                      _id
                      title
                      author
                      bookFileUrl
                      bookCoverUrl
                      categoryId
                      paidStatus
                  }
                  }
                }
            `
          }
       );
       console.log(response);
       await setAllCategories(response.data.data.dashboard.categories);
       await setAllBooks(response.data.data.dashboard.books);
       setComplete(true);
       setSpinner(false);
    } catch (error) {
      throw error;
    }
  };
  
  useEffect(()=>{ dashboard()}, []);

  let bookCategories, booksAll;
  if(complete && props.adminAuth){
    bookCategories = allCategories.map(category => {
      return<option  key={category._id} value={category._id}>{category.name}</option>
    });
    if(allBooks.length > 0){
        booksAll = allBooks.map((book, id) => <Book
                  key={book._id}
                  id={id} 
                  bookId={book._id} 
                  deleteHandler={deleteBookModalHandler} 
                  updateBookModalHandler={updateBookModalHandler}
                  title={book.title}
                  author={book.author}
                  paidStatus={book.paidStatus}
                  coverUrl={book.bookCoverUrl}
                 />
    );
    }
   
  }
        return(
            <div className="Admin">
               <SpinnerModal show={spinner}></SpinnerModal>
               <AdminLoginModal show={adminAuth}>
                       <h3 style={{paddingTop:"20%"}}>Log in to admin panel</h3>
                      <div>
                        <input value={userName} onChange={userNameInputChgangeHandler} className="input-filed" type="text" placeholder="Username"/>
                     </div>
                     <div>
                        <input value={password} onChange={passwordInputChgangeHandler} className="input-filed" type="password" placeholder="password"/>
                     </div>
                     <p style={{color:"red"}}>{error_message}</p>
                      <button className="admin-login-button" onClick={adminLoginHandler}>Login</button>
               </AdminLoginModal>
                <AddBookModal show={addBookModal} addBookModalHandler={addBookModalHandler}>
                    <h3>Add new book</h3>
                    <div>
                      <input onChange={bookTitleHandleChange} value={bookTitle} className="input-filed" type="text" placeholder="Title"/>
                    </div>
                    <div>
                      <input onChange={bookAuthorHandleChange} value={bookAuthor} className="input-filed" type="text" placeholder="Author name"/> 
                    </div>
                    <div>
                   </div>
                   <h5>Book category</h5>
                   <select name="categories" className="Select-categories" onChange={bookCategoryChangeHandler}>
                      {
                         bookCategories
                      }
                    </select>
                                        
                    <h5>Book status</h5>
                    <input type="radio"  value={false} onChange={paidStatusHandler} name="paidstatus" />Free
                    <input type="radio"  value={true} onChange={paidStatusHandler} name="paidstatus"/>Paid
                    <div>
                       <h5>Attach book cover</h5>
                       <input type="file" accept=".png,.jpg" onChange={handleCoverFileChange}/>
                    </div>  
                    <div>
                       <h5>Attach book pdf</h5>
                       <input type="file" accept=".pdf,.docx" onChange={handleFileChange}/>
                    </div>
                    <button className="Book-submit-button" onClick={addBookHandler}>Add Book</button>
                    
                </AddBookModal>
                <UpdateBookModal show={updateBookModal} updateBookModalHandler={updateBookModalHandler2}>
                  {
                    update ? <div>
                      <h3>Update book</h3>
                    <div>
                      <input onChange={bookTitleHandleChange} value={bookTitle} className="input-filed" type="text" placeholder="Title"/>
                    </div>
                    <div>
                      <input onChange={bookAuthorHandleChange} value={bookAuthor} className="input-filed" type="text" placeholder="Author name"/> 
                    </div>
                    <div>
                   </div>
                   <h5>Book category</h5>
                   <select name="categories" className="Select-categories" onChange={bookCategoryChangeHandler}>
                      {
                         bookCategories
                      }
                    </select>
                                        
                    <h5>Book status</h5>
                    <input type="radio"  value={false} onChange={paidStatusHandler} name="paidstatus" />Free
                    <input type="radio"  value={true} onChange={paidStatusHandler} name="paidstatus"/>Paid  
                    <div>
                       <h5>Attach book cover</h5>
                       <input type="file" accept=".png,.jpg" onChange={handleCoverFileChange}/>
                    </div> 
                    <div>
                       <h5>Update book pdf</h5>
                       <input type="file" accept=".pdf,.docx" onChange={handleFileChange}/>
                    </div>
                    <button className="Book-submit-button" onClick={updateBookHandler}>Update Book</button>
                    </div>: <div></div>
                  }
               </UpdateBookModal>
               <DeleteBookModal show={deleteBookModal} cancelBookModalHandler={deleteBookModalCancelHandler}>
                     <p style={{paddingTop:"30px"}}>Are you sure delete this book permanently ? </p>
                     <button onClick={deleteBookModalCancelHandler} className="book-del-cancel-button">Cancel</button>
                     <button onClick={deleteBookHandler}  className="book-del-button">Delete</button>
               </DeleteBookModal>
               <div style={{width:"100%", height:"56px", background:"white"}}></div>
               <div style={{width:"85.8%", height:"40px", margin:"0 0 0 8%"}}>
                  <h2 style={{float:"left"}}>All Books</h2>
                 <div style={{float:"right", margin:"20px 0"}}>
                    <button onClick={addBookModalHandler} className="add-new-book-button">Add new book</button>
                    <Link to="/" onClick={props.logOut} className="admin-logout-button">Log out</Link>
                 </div>
               </div>
               <div className="AdminView">
                     {booksAll}
               </div>
            </div>
        );
};

const mapStateToProps = state =>{
  return{
     userSetUp:state.auth.userSetUp,
     auth: state.auth.auth,
     userId: state.auth.userId,
     paidMemberShip: state.auth.paidMemberShip,
     adminAuth: state.auth.adminAuth
  }
}

const mapDispatchToProps = dispatch => {
  return{
     adminSetup: () => {
        dispatch ({
           type: actionTypes.ADMIN_SETUP
        });
     },
     logOut: () =>{
       dispatch({
         type: actionTypes.ADMIN_LOGOUT
       });
     }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminControl);

