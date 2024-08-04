import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import '../styles/contestpage.css';

const ContestPage = () => {
  const { contestId } = useParams();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [register, setRegister] = useState('Register');
  const [solvedProbs, setSolvedprobs] = useState([]);


  // Initial data fetch on component mount
  useEffect(() => {
    fetchContestDetails();
  }, []);

  // Check startTime and set a timer to refetch contest details if the contest hasn't started yet
  useEffect(() => {
    if (startTime) {
      const now = new Date();
      const start = new Date(startTime);
      const timeUntilStart = start - now;

      if (timeUntilStart > 0) {
        const timer = setTimeout(fetchContestDetails, timeUntilStart);
        return () => clearTimeout(timer);
      }
    }
  }, [startTime]);

  // Function to fetch contest details
  const fetchContestDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/contests/${contestId}`, { withCredentials: true });
      const data = response.data;
      setTitle(data.title);

      if (!data.problem_ids.length) {
        setError('The contest has not started yet.');
        setStartTime(data.start_time);
      } else {
        setQuestions(data.problem_ids);
        fetchQuestionDetails(data.problem_ids);
        fetchLeaderboard();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch contest details.');
    }
  };

  // Function to fetch details of each question using axios
  const fetchQuestionDetails = async (problemIds) => {
    try {
      const questionDetails = await Promise.all(
        problemIds.map(async (id) => {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problems/${id}`, { withCredentials: true });
          return response.data;
        })
      );
      setQuestions(questionDetails);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch question details.');
    }
  };

  // Function to fetch and update the leaderboard
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/contests/getleaderboard/${contestId}`, { withCredentials: true });
      const leaderboardData = response.data.topPerformers;
      console.log(response);
      setLeaderboard(leaderboardData);
      const info = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/contests/mycontests/${contestId}`, { withCredentials: true });
      setSolvedprobs(info.data.solvedProblems);
    } catch (err) {
      setSolvedprobs([]);
      console.error(err);
      setError('Failed to fetch leaderboard.');
    }
  };


  useEffect(() => {
    console.log(leaderboard);
  }, [leaderboard]);

  const handleRegister = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/contests/register/${contestId}`, { withCredentials: true });
      setRegister('Registered');
      console.log('Registration successful');
    } catch (error) {
      console.error(error);
      setError('Failed to register for contest.', error);
    }
  }

  // Set an interval to update the leaderboard every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(fetchLeaderboard, 300000); // Update every 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <h2 className='contest-title'>{title}</h2>
      <h4 className='contest-inst'>Contest Instructions</h4>
      <p>Please read the following instructions carefully before participating in the contest.</p>
      <ul className="instructions">
        <li>This contest accepts C++, Java, and Python codes.</li>
        <li>Don't share code publicly before the contest ends.</li>
        <li><strong>Note:</strong> Users need to be registered to attempt the contest.</li>
        <li>Make sure to test your code thoroughly before submission.</li>
        <li>Plagiarism is strictly prohibited and will result in disqualification.</li>
        <li>Time management is crucial. Plan your attempts accordingly.</li>
        <li>Read each problem statement carefully and understand the requirements before starting to code.</li>
        <li>If you face any issues, contact the support team immediately.</li>
      </ul>
      <div className="note">
        <strong>Note:</strong> Only registered users can attempt the test.
        <button className='register-btn' onClick={handleRegister}>{register}</button>
      </div>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="tables-container">
          <div className="table-wrapper">
            <h3>Questions</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => {
                  const isSolved = solvedProbs.includes(q._id);
                  return (
                    <tr key={index} className={isSolved ? 'solved' : ''}>
                      <td><Link to={`/contests/${contestId}/problem/${q._id}`}>{q.title}</Link></td>
                      <td>{q.difficulty}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="table-wrapper">
            <h3>Leaderboard</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard != undefined && leaderboard ? (
                  leaderboard.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.username}</td>
                      <td>{entry.totalPoints}</td>
                    </tr>
                  ))) : (
                  <tr>
                    <td colSpan="3">Leaderboard loading</td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestPage;
