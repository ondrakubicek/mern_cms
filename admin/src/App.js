import React, {useState, useCallback, useEffect} from 'react';
import './App.css';
import Nav from './Nav';
import TopPanel from './TopPanel';

import Home from './page/Home';
import Auth from './page/Auth';

import UserList from './page/UserList';
import UserItem from './page/UserItem';
import UserItemNew from './page/UserItemNew';

import PostList from './page/PostList';
import PostItem from './page/PostItem';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context';


function App() {

  const existingToken = localStorage.getItem("token");
  const [authToken, setAuthToken] = useState(existingToken);
  
  const setToken = useCallback((token) => {
    localStorage.setItem("auth-token", token);
    setAuthToken(token);
  }); 

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth-token");
    setIsLoggedIn(false);
  }, []);


  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("auth-token") !== null);


  let routes;
  if (isLoggedIn) {
    routes = (
      <div>
        <TopPanel />
        <div className="App">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/users/" exact component={UserList} />
            <Route path="/users/new" exact component={UserItemNew} />
            <Route path="/users/:id" exact component={UserItem} />

            <Route path="/posts/" exact component={PostList} />
            <Route path="/posts/:id" exact component={PostItem} />

          </Switch>
        </div>
      </div>
    );
  } else {
    routes = (
    <div className="App">
      <Auth />
    </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout, authToken, setToken: setToken  }}
    >
      <Router>
        {routes}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
