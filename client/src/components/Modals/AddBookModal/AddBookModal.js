import React from 'react';

import  './AddBookModal.css';

import Backdrop from '../BackDrop/BackDrop';

const addBookModal = (props) => (
   <div>
     <Backdrop show={props.show} clicked={props.addBookModalHandler} />
     <div
     className="AddBookModal"
     style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1': '0'

    }}
     >
        {props.children}
    </div>
   </div>
);

export default addBookModal;