import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';

import './css/style.css';
import App from './components/App'
import StorePicker from './components/StorePicker'
import NotFound from './components/NotFound'

// GitHug Pages - Include a basename in the BrowserRouter
// e.g. basename="/fish-market-app/"
// or use this repo below <BrowserRouter basename={repo}>
// const repo = `${window.location.pathname}`;
const Root = () => {
  return (
    <BrowserRouter>
      <div>
        <Match exactly pattern="/" component={StorePicker} />
        <Match exactly pattern="/store/:storeId" component={App} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>
  )
}

// tells what component to render, then second arg is where it goes
render(<Root/>, document.querySelector('#main'));
