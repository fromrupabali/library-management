import React from 'react';

import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import  './SpinnerModal.css';

import Backdrop from '../BackDrop/BackDrop';

const spinnerModal = (props) => (
   <div>
     <Backdrop show={props.show} clicked={props.addBookModalHandler} />
     <div
     className="SpinnerModal"
     style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1': '0'

    }}
     >
         <Loader
         type="Puff"
         color="#00BFFF"
         height={100}
         width={100}
      />
    </div>
   </div>
);

export default spinnerModal;