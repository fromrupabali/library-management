import React from 'react';

import  './AdminLoginModal.css';

import Backdrop from '../BackDrop3/BackDrop3';

const adminLoginModal = (props) => (
   <div>
     <Backdrop show={props.show} />
     <div
     className="AdminLoginModal"
     style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1': '0'
      }}
     >
        {props.children}
    </div>
   </div>
);

export default adminLoginModal;