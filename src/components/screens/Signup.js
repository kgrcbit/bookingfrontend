import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import M from 'materialize-css'

const SignIn  = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [rollno,setRollno] = useState("")
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [isValidRollno, setIsValidRollno] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [url,setUrl] = useState(undefined)
    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const validateRollno = (inputRollno) => {
        const isValidLength = inputRollno.length === 12;
        const startsWith1601 = inputRollno.startsWith("1601");
      
        setIsValidRollno(isValidLength && startsWith1601);
      };

    const uploadPic = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","new-insta")
        data.append("cloud_name","cnq")
        fetch("https://api.cloudinary.com/v1_1/cnq/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
           setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const uploadFields = ()=>{
        if (!isValidRollno) {
            toast.error("Invalid Roll.", { position: toast.POSITION.TOP_RIGHT });
            return;
          }
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            toast.error("Invalid Email.", { position: toast.POSITION.TOP_RIGHT });
            return
        }

        

        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                rollno,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               M.toast({html:data.message,classes:"#43a047 green darken-1"})
               history.push('/signin')
           }
        }).catch(err=>{
            console.log(err)
        })
    }
    const PostData = ()=>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
       
    }

   return (
<div className="mycard">
  <div className="card auth-card input-field">
    <h1 style={{ color: "#2196F3", marginBottom: "24px" }}>CBIT</h1>
    
    <input
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="input-field"
    />
    <input
      type="text"
      placeholder="Roll Number"
      value={rollno}
      onChange={(e) => {
        setRollno(e.target.value);
        validateRollno(e.target.value); // Validate roll number on input change
      }}
      className="input-field"
    />
    
    <input
      type="text"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="input-field"
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPasword(e.target.value)}
      className="input-field"
    />
    <div className="file-field input-field" style={{ margin: "20px 0" }}>
      <div className="btn #2196F3 blue darken-1">
        <span>Upload Pic</span>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
    <button
      className="btn waves-effect waves-light #2196F3 blue darken-1"
      onClick={() => PostData()}
    >
      Sign Up
    </button>
    <h5 style={{ marginTop: "16px", color: "#555" }}>
      <Link to="/signin" style={{ color: "#2196F3" }}>Already have an account?</Link>
    </h5>
    <ToastContainer />
  </div>
</div>

   )
}


export default SignIn