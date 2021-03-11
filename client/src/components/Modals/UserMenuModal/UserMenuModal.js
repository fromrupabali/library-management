import React from 'react';

import  './UserMenuModal.css';
import Backdrop from '../BackDrop2/BackDrop2';

const userMenuModal = (props) => (
   <div>
     <Backdrop show={props.show} clicked={props.menuModalHandler} />
     <div
     className="UserMenuModal"
     style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1': '0'

    }}
     >
        {props.children}
    </div>
   </div>
);

export default userMenuModal;