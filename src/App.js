/* eslint-disable no-unused-vars */
// project import
import React from 'react';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

import './css/reset.css';
import './css/default.css';
import './css/login.css';
import './css/content.css';
import './css/main.css';
import './js/learning.js';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
    <ThemeCustomization>
        <ScrollTop>
            <Routes />
        </ScrollTop>
    </ThemeCustomization>
);

export default App;
