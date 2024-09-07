import React from 'react';
import '../styles/home.css';
import { NavLink } from 'react-router-dom'
import Footer from '../components/Footer';
import topics2 from '../assets/topics3.png';
import contestImg from '../assets/contestImg1.jpeg'
import compilerImg from '../assets/compiler.png'
import algo1 from '../assets/algo1.jpg'
import practice1 from '../assets/practice1.png'



const HomePage = () => {
  // console.log(import.meta.env.VITE_BACKEND_URL);

  return (
    <div className="home-page">
      <section className="home-section ">
        <div className="section-content">
          <div className="section-img">
            <img className=" spl-case" src={algo1} alt="Coding Importance" />
          </div>
          <div className="section-info">
            <h2>Welcome to Algo arena</h2>
            <p>Welcome to the ultimate destination for coders of all levels!
              Algo arena is designed to help you elevate your coding skills, compete with peers, and tackle challenges that sharpen your problem-solving abilities. Whether you're a beginner looking to learn the basics or an experienced programmer aiming to test your limits, we have something for everyone.</p>
            <NavLink className="section-btn" to="/login" >Sign up and practice</NavLink>
          </div>
        </div>
      </section>


      <section className="home-section ">
        <div className="section-content">
          <div className="section-info">
            <h2>Topic-Wise Practice Problems</h2>
            <p>Master different coding topics with our curated set of problems, essential for cracking technical interviews.Prepare effectively for coding interviews by practicing with problems categorized by topic, ensuring you build a strong foundation across all areas. Dive into a variety of topics, including arrays, linked lists, trees, graphs, dynamic programming, and more. Each problem comes with detailed explanations and solutions to help you learn and improve.</p>
            <NavLink className="section-btn" to="/topics">Explore Topics</NavLink>
          </div>
          <div className="section-img">
            <img src={topics2} alt="Topic-Wise Practice" />
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-content">
          <div className="section-img">
            <img src={practice1} alt="Problem Collection" />
          </div>
          <div className="section-info spl-case">
            <h2>Extensive Problem Collection</h2>
            <p>Tackle a wide range of problems across various difficulties to enhance your problem-solving skills. Our problem sets are meticulously curated to provide comprehensive coverage of key topics.Engage with problems designed to simulate real-world scenarios and technical interviews.Stay ahead in your coding journey with regularly updated problem sets that cover the latest trends and technologies.  </p>
            <NavLink className="section-btn" to="/problems">Start Practice</NavLink>
          </div>
        </div>
      </section>

      <section className="home-section ">
        <div className="section-content">
          <div className="section-info">
            <h2>Compete in Contests</h2>
            <p>Participate in coding contests to test your skills against peers and prepare for real-world interviews. Engage in regularly scheduled contests that challenge your problem-solving abilities and speed.Each contest is designed to simulate the pressure and environment of technical interviews, helping you build confidence and resilience. Track your progress on the leaderboard, analyze your performance, and strive to improve with each competition.Join us and push your limits in a dynamic and competitive setting.</p>
            <NavLink className="section-btn" to="/contests">Give a Contest</NavLink>
          </div>
          <div className="section-img">
            <img src={contestImg} alt="Contests" />
          </div>
        </div>
      </section>

      <section className="home-section spl-section">
        <div className="section-content">
          <div className="section-img">
            <img src={compilerImg} alt="Online Compiler" />
          </div>
          <div className="section-info">
            <h2> Playground </h2>
            <p>Experiment and hone your coding skills with our interactive online compiler. Write, run, and test your code in real-time, directly from your browser, without the need for any setup or installation. Our playground supports multiple programming languages, including C++, Java, and Python. Debug your code effortlessly with instant feedback and error messages.  Whether you're practicing algorithms, testing snippets, or learning new languages, our playground offers a seamless and efficient coding experience. </p>
            <NavLink className="section-btn" to="/playground">Play ground</NavLink>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-content-1">
          <div className="footer-links">
            <a className="footer-link">About Us</a>
            <a className="footer-link">Contact</a>
            <a className="footer-link">Privacy Policy</a>
            <a className="footer-link">Terms of Service</a>
          </div>
          <div className="footer-content-2">
            <p className="footer-credit">Made with <span className="heart">❤️</span> By Abhiram &copy; 2024 AlgoArena.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
