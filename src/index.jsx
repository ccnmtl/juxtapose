/* global view */

import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import JuxtaposeApplication from './JuxtaposeApplication.jsx';


if (document.getElementById('jux-container')) {
    const container = document.getElementById('jux-container');
    const root = ReactDOMClient.createRoot(container);
    root.render(
        <JuxtaposeApplication
            readOnly={(view && view.readOnly) || false}
            primaryInstructions={view && view.primaryInstructions || ''}
            secondaryInstructions={view && view.secondaryInstructions || ''}
        />
    );
}
