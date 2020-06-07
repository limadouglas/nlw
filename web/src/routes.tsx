import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './pages/home';
import CreatePoint from './pages/CreatePoint'

const Routes = ()=>(
  <BrowserRouter>
    <Route path="/" component={Home} exact />
    <Route path="/create-point" component={CreatePoint} />
  </BrowserRouter>
)

export default Routes;
