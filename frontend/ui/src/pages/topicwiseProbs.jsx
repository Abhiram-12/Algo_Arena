import React, { useState, useEffect } from 'react';
import '../styles/probList.css'; 
import axios from 'axios';
import { Link,useParams} from 'react-router-dom';

const Topicwise = () => {
  const [problems, setProblems] = useState([]);
  const { topic } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8080/topics/${topic}`)
      .then(response => {
        setProblems(response.data);
      })
      .catch(error => {
        console.error('Error fetching problems:', error);
      });
  }, []);  

  return (
    <div className="problem-list-container">
      <div className='heading'>{`${topic.charAt(0).toUpperCase()}${topic.slice(1)} Problem List`}</div>      
      <div className="table-container">
        <ul className="table">
          <li className="table-header">
            <div className="col col-1">S.No</div>
            <div className="col col-2">Title</div>
            <div className="col col-3">Difficulty</div>
            <div className="col col-4">Tags</div>
          </li>
          {problems.map((problem,index) => (
            <li className="table-row" key={index}>
              <div className="col col-1">{index+1}</div>
              <div className="col col-2"><Link to={`/problems/${problem._id}`}>{problem.title}</Link></div>
              <div className="col col-3">{problem.difficulty}</div>
              <div className="col col-4">{problem.tags.join(', ')}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default Topicwise;
