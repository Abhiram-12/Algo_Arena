import React, { useContext, useState } from 'react'
import '../styles/signup.css'
import email_icon from '../assets/email_icon.png'
import password_icon from '../assets/password_icon.png'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext"

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext)
  const navigate = useNavigate();
  const handleError = (err) => toast.error(err, { position: "top-right", autoClose: 3000})
  const handleSuccess = (msg) => toast.success(msg, { position: "top-right", autoClose: 3000 })

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:8080/login", { "email": email, "password": password }, { withCredentials: true });

      const { success, message,username } = data;
      if (success) {
        console.log("hello ",username)
        login(username);
        handleSuccess(message);
        setTimeout(() => navigate('/'), 3000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setEmail('');
    setPassword('');
  }

  return (
    <>
      <div className="signup-container">
        <div className="signup-header">
          <div className="text"> Login</div>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputs">

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
              <span className="logintext">New user? Create an account </span>
              <Link className='toLogin' to='/signup'>Signup</Link>
            </div>
            <div className="btn">
              <button className='signup-submit' type='submit'>Login</button>
            </div>

          </div>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

    </>
  )
}

export default login