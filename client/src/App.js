import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import { ContextConsumer } from './context';

import HomePage from './pages/home/home';
import AddItems from './pages/add_items/add_items';
import UpdateItems from './pages/update_items/update_items';
import CashRegister from './pages/cash_register/cash_register';

function App() {

  // const context = useContext(ContextConsumer);
  // const {randomFunction} = context;

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/add_items" component={AddItems} />
        <Route path="/update_items" component={UpdateItems} />
        <Route path="/cash_register" component={CashRegister} />
      </Switch>
    </Router>
  );
}

export default App;
