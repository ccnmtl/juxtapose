import React from 'react';
import ReactDOM from 'react-dom';
import JuxtaposeApplication from './JuxtaposeApplication.jsx';


ReactDOM.render(
    <JuxtaposeApplication readOnly={(view && view.submitted) || false} />,
    document.getElementById('jux-container')
);
