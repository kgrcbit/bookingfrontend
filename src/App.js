
import React, { useEffect, createContext, useReducer, useContext } from 'react';
import NavBar from './components/Navbar';
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/screens/Home';
import Signin from './components/screens/SignIn';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import { reducer, initialState } from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPosts from './components/screens/SubscribesUserPosts';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/Newpassword';
import BookingPage from './components/screens/BookingPage';
import AdminPage from './components/screens/AdminPage';
import DisplayBookings from './components/screens/DisplayBookings';
import Header from './components/screens/Header';
import Background from './components/screens/Background';
import BadmintonRules from './components/screens/BadmintonRules';


export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith('/reset')) {
        history.push('/signin');
      }
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/badmintonrules">
                <BadmintonRules />
              </Route>
      {state ? (
        <>
          {state.email === 'admin@cbit.ac.in' ? (
            <Route path="/admin">
              <DisplayBookings />
            </Route>
          ) : (
            <>
              <Route exact path="/profile">
                <Profile />
              </Route>
              <Route path="/BookingPage">
                <BookingPage />
              </Route>
              <Route path="/profile/:userid">
                <UserProfile />
              </Route>
              
              <Route path="/displaybookings">
                <DisplayBookings />
              </Route>
             

            </>
          )}
        </>
      ) : null}
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
  
      <Header/>
        <NavBar />
        
        <Routing />
       
      </BrowserRouter>
      
    </UserContext.Provider>
  );
}

export default App;