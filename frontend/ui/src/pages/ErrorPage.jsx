import React from 'react'
import error_img from "../assets/errorPage.svg"
import "../styles/errorPage.css"

const ErrorPage = () => {
  return (
    <div className='error-wrapper'>
      <div className="error-img">
        <img src={error_img} alt="" className="error-img" />
      </div>
        
        <div className="to-home"> go to home</div>
    </div>
  )
}

export default ErrorPage