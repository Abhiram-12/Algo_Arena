import React, { useState ,useContext} from 'react'
import '../styles/signup.css'
import user_icon from '../assets/user_icon.png'
import email_icon from '../assets/email_icon.png'
import password_icon from '../assets/password_icon.png'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import signup_img from '../assets/signupImg.png'
import { AuthContext } from "../contexts/AuthContext"

const signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { signup } = useContext(AuthContext);
  

  const handleError = (err) => toast.error(err, { position: "top-right" })
  const handleSuccess = (msg) => toast.success(msg, { position: "top-right" })

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/signup", { "name": name, "email": email, "password": password }, { withCredentials: true });
      console.log("singup response ", response);
      const { success, message,username } = response.data;
      if (success) {
        signup(username);
        setMsg(message);
        handleSuccess(message);
        setTimeout(() => navigate('/'), 5000);
      } else {
        setMsg(message);
        handleError(message);
      }
    } catch (error) {
      setMsg(message);
      console.log(error);
       handleError(data.message);
    }
    setEmail('');
    setName('');
    setPassword('');
  }

  return (
    <>
      <div className="signup-container">
        <div className="signup-img">
          <img src={signup_img} alt="signup_img" />
        </div>
        <div className="signup-form">
          <div className="signup-header">
            <div className="text"> Sign Up</div>
            <div className="underline"></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="inputs">
              {/* name */}
              <div className="input">
                <img src={user_icon} alt='' />
                <input
                  type='text'
                  name='name'
                  value={name}
                  placeholder='User name'
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* email */}
              <div className="input">
                <img src={email_icon} alt='' />
                <input
                  type='email'
                  name='email'
                  value={email}
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* password */}
              <div className="input">
                <img src={password_icon} alt='' />
                <input
                  type='password'
                  placeholder='password'
                  name='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="login">
                <span className="logintext">Already have an account ? </span>
                <Link className='toLogin' to='/login'>Login</Link>
              </div>
              <div className="btn">
                <button className='signup-submit' type='submit'>Sign Up</button>
              </div>
              {msg&&(<div className="">Message:{msg}</div>)}
            </div>
          </form>
        </div>
      </div>

    </>
  )
}

export default signup