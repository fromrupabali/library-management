import React from 'react';

import './BackDrop2.css';

const backdrop = (props) => (
    props.show ? <div className="Backdrop2" onClick={props.clicked}>
    </div> : null
);

export default backdrop;