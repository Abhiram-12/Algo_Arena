import React, { useState, useContext,useEffect } from 'react'
import '../styles/navbar.css'
import { NavLink } from 'react-router-dom'
import axios from "axios"
import { AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


const Navbar = () => {
  const [showAbout, setshowAbout] = useState(false);
  const { isAuthenticated, isAdmin,username, logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userStats,setUserstats]=useState();


  useEffect(() => {
    axios.get('http://localhost:8080/getUserstats',{withCredentials:true})
      .then(response => {
        console.log(response.data[0]);
        setUserstats(response.data[0]);
      })
      .catch(error => {
        console.error('Error fetching problems:', error);
      });
  }, []);


  const handleError = (err) => toast.error(err, { position: "top-right" })
  const handleSuccess = (msg) => toast.success(msg, { position: "top-right" })

  console.log(isAuthenticated);
  console.log(isAdmin);
  console.log(logout);

  const handleShowAbout = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:8080/logout', {
        withCredentials: true,
      });
      console.log("response received" + response);
      if (response.status === 200) {
        handleSuccess("Succesfully logged out");
        logout();
        setIsModalOpen(false);
      }
      else {
        handleError("Error in logging out");
      }
    } catch (error) {
      console.error('Logout error:', error);
      handleError("Error in logging out");
    }
  };



  return (
    <>
      <header className='header'>
        <div className=" nav ">
          <div className="nav__logo">
            <NavLink className='logo' to="/">Algo Arena</NavLink>
          </div>
          <div className="nav__menu">
            <ul className='nav__list '>
              <li className="nav__item">
                <NavLink className="nav__link" to="/">Home</NavLink>
              </li>
              <li className="nav__item">
                <NavLink className="nav__link" to="/topics">Topics</NavLink>
              </li>
              <li className="nav__item">
                <NavLink className="nav__link" to="/problems">Problem List</NavLink>
              </li>
              <li className="nav__item">
                <NavLink className="nav__link" to="/contests">Contests</NavLink>
              </li>
              <li className="nav__item">
                <NavLink className="nav__link" to="/playground">Play Ground</NavLink>
              </li>
              {
                isAuthenticated ? (
                  <li className="nav__item">
                    <i  className='bx bxs-user-circle user__icon ' onClick={handleShowAbout}></i>
                  </li>
                ) : (                  
                  <li className="nav__item">
                    <NavLink className="nav__link" to="/login">Login</NavLink>
                  </li>
                )
              }

            </ul>
          </div>
        </div>
      </header>

{isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h3>Hi {username}</h3>
      <div>Problems Solved: {userStats.problems_id_solved.length}</div>
      <div>Contests participated: {userStats.contest_stats.length}</div>
      <button className="logout-btn" onClick={handleLogout}>Log out</button>
    </div>
  </div>
)}

    </>
  )
}

export default Navbar