import React, { useState, useEffect } from 'react';
import '../styles/probList.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import Pagination from '../components/pagination';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [problemQuery, setProblemQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(5);

  const fetchSuggestions = async ({ value }) => {
    try {
      const response = await axios.get('http://localhost:8080/search/prob', { params: { query: value } });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion.title;

  const renderSuggestion = suggestion => (
    <div>{suggestion.title}</div>
  );

  const onSuggestionSelected = (event, { suggestion }) => {
    // Redirect to the selected problem page
    window.location.href = `/problems/${suggestion._id}`;
  };


  useEffect(() => {
    axios.get('http://localhost:8080/problems')
      .then(response => {
        setProblems(response.data);
      })
      .catch(error => {
        console.error('Error fetching problems:', error);
      });
  }, []);

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(indexOfFirstProblem, indexOfLastProblem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="problem-list-container">
      <div className="prob-list-topbar">
        <div className='prob-list-heading'>Problem List</div>
        <div className="problist-autosuggest-container">
          <div className="input-wrapper">
            <Autosuggest
              inputProps={{
                placeholder: "Search Problems",
                value: problemQuery,
                onChange: (e, { newValue }) => setProblemQuery(newValue),
              }}
              suggestions={suggestions}
              onSuggestionsFetchRequested={fetchSuggestions}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              onSuggestionSelected={onSuggestionSelected}
            />
            <i className="uil uil-search search-icon"></i>
          </div>
        </div>

      </div>
      <div className="table-container">
        <ul className="table">
          <li className="table-header">
            <div className="col col-1">S.No</div>
            <div className="col col-2">Title</div>
            <div className="col col-3">Difficulty</div>
            <div className="col col-4">Tags</div>
          </li>
          {currentProblems.map((problem, index) => (
            <li className="table-row" key={index}>
              <div className="col col-1">{(currentPage - 1) * problemsPerPage + index + 1}</div>
              <div className="col col-2"><Link to={`/problems/${problem._id}`}>{problem.title}</Link></div>
              <div className="col col-3">{problem.difficulty}</div>
              <div className="col col-4">{problem.tags.join(', ')}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="pagination">
        <div className="add-prob">
          <Link to={'/addprob'}><i className='bx bx-pencil bx-sm'></i>
            <span className='para'>Contribute a problem</span>
          </Link>

        </div>
        <Pagination
          currentPage={currentPage}
          totalCount={problems.length}
          pageSize={problemsPerPage}
          onPageChange={paginate}
        />
      </div>
    </div>

  );
};

export default ProblemList;
