import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link ,useHistory} from 'react-router-dom'
import {UserContext} from './App'
import M from 'materialize-css'
const AdminNavbar = ()=>{
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
     const {state,dispatch} = useContext(UserContext)
     const history = useHistory()
     useEffect(()=>{
         M.Modal.init(searchModal.current)
     },[])
     const renderList = ()=>{
       if(state){
           return [
           
            <li key="2"><Link to="/Home">Home</Link></li>,
            <li key="4"><Link to="/DisplayBookings">Bookings</Link></li>,
            <li  key="5">
             <button className="btn #c62828 red darken-3"
            onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/signin')
            }}
            >
                Logout
            </button>
            </li>
         
            
           ]
       }
     }


     
    return(
        <nav>
        <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#3F51B5" }}>
  <img src="cbitlogo.png" alt="CBIT" style={{ width: "40px", marginRight: "10px" }} />
  CBIT
</Link>

          {/* <Link to={state?"/":"/signin"} className="brand-logo left"> style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#2196F3" }} <img src="cbitlogo.png" alt="CBIT"/></Link> */}
          <ul id="nav-mobile" className="right">
             {renderList()}
  
          </ul>
        </div>
        <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          
             <ul className="collection">
               {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
               
              </ul>
          </div>
         
        </div>
      </nav>
    )
}


export default AdminNavbar;