import React from 'react';

import  './PaymentModal.css';

import Backdrop from '../BackDrop3/BackDrop3';

const paymentBookModal = (props) => (
   <div>
     <Backdrop show={props.show} clicked={props.paymentBookModalHandler} />
     <div
     className="PaymentBookModal"
     style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1': '0'
      }}
     >
        {props.children}
    </div>
   </div>
);

export default paymentBookModal;