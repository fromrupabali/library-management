import React from 'react';

import  './DeleteBookModal.css';

import Backdrop from '../BackDrop/BackDrop';

const deleteBookModal = (props) => (
   <div>
     <Backdrop show={props.show} clicked={props.cancelBookModalHandler} />
     <div
     className="DeleteBookModal"
     style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1': '0'
    }}
     >
        {props.children}
    </div>
   </div>
);

export default deleteBookModal;