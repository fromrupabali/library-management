import React from 'react';

import  './UpdateBookModal.css';

import Backdrop from '../BackDrop/BackDrop';

const updateBookModal = (props) => (
   <div>
     <Backdrop show={props.show} clicked={props.updateBookModalHandler} />
     <div
     className="UpdateBookModal"
     style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1': '0'
    }}
     >
        {props.children}
    </div>
   </div>
);

export default updateBookModal;