import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App'
import {BrowserRouter } from 'react-router-dom';

const render = ()=>{
    ReactDOM.render(
        (<BrowserRouter>
            <App/>
        </BrowserRouter>), document.getElementById("app"))
};

render();

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./js/App', render);
}