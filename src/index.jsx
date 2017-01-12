/* global view */

import React from 'react';
import ReactDOM from 'react-dom';
import JuxtaposeApplication from './JuxtaposeApplication.jsx';


if (document.getElementById('jux-container')) {
    ReactDOM.render(
        <JuxtaposeApplication
            submitted={(view && view.submitted) || false}
            primaryInstructions={view && view.primaryInstructions || ''}
            secondaryInstructions={view && view.secondaryInstructions || ''}
        />,
        document.getElementById('jux-container')
    );
}
