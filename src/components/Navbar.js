import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';
import logo from './logo.png';


const NavBar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem('user'));

  let isAdmin = false;

  if (user) {
    console.log("hey " + user.email);
    isAdmin = user.email === "sportsadmin@cbit.ac.in" || user.email == "kgangadhar_it@cbit.ac.in";
  }

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = () => {
    if (state) {
      return (
        <div className="navbar">
         

           {isAdmin ? (
        <li key="4"><Link to="/displaybookings">Display Bookings</Link></li>
      ) : (
        <li key="3"><Link to="/BookingPage">BookingPage</Link></li>
        
        
      )}
          <li key="2"><Link to="/profile">Profile</Link></li>

         
          <li key="5">
            <button className="btn #c62828 red darken-3" style={{ color: 'white' }}
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push('/signin');
              }}
            >
              Logout
            </button>
          </li>
        </div>
      );
    } else {
      return (
        <div>
          <li key="6"><Link to="/signin">Signin</Link></li>
          <li key="7"><Link to="/signup">Signup</Link></li>
          <li key="8"><Link to="/badmintonrules">Badminton Rules</Link></li>
        </div>
      );
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch('/search-users', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json())
      .then(results => {
        setUserDetails(results.user);
      });
  };

  return (
    <nav style={{ backgroundImage: `url("./b2.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="nav-wrapper light-blue">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
        
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
            {userDetails.map(item => {
              return (
                <Link to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                  M.Modal.getInstance(searchModal.current).close();
                  setSearch('');
                }}>
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;