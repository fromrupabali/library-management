import React from 'react';

import './BackDrop3.css';

const backdrop = (props) => (
    props.show ? <div className="Backdrop3" onClick={props.clicked}>
    </div> : null
);

export default backdrop;