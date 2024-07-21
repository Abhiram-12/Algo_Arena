import React, { useState } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../styles/addContest.css'


const AddContestForm = () => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setstartTime] = useState('');
    const [endTime, setendTime] = useState('');
    const [author, setAuthor] = useState('');
    const [problemQuery, setProblemQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Create Date objects for start and end times using the respective date part from the inputs
    const startTimeObj = new Date(startDateObj);
    const [startHours, startMinutes] = startTime.split(':');
    startTimeObj.setHours(startHours, startMinutes);

    const endTimeObj = new Date(endDateObj);
    const [endHours, endMinutes] = endTime.split(':');
    endTimeObj.setHours(endHours, endMinutes);

    const fetchSuggestions = async ({ value }) => {
        try {
            const response = await axios.get('http://localhost:8080/search/prob', { params: { query: value } });
            // console.log('suggestion resp',response.data);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event, { suggestion }) => {
        setSelectedProblems([...selectedProblems, suggestion]);
        setProblemQuery('');
    };

    const getSuggestionValue = suggestion => suggestion.title;

    const renderSuggestion = suggestion => (
        <div>
            {suggestion.title}
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const contestData = {
            title,
            date: startDateObj,
            start_time: startTimeObj,
            end_date: endDateObj,
            end_time: endTimeObj,
            problem_ids: selectedProblems.map(p => p._id),
            author
        };
        try {
            await axios.post('http://localhost:8080/contests/addcontest', contestData, { withCredentials: true });
            // Handle success (e.g., show a success message, clear form)
        } catch (error) {
            console.error('Error creating contest:', error);
        }
    };

    const removeProblem = (problemId) => {
        setSelectedProblems(selectedProblems.filter(problem => problem._id !== problemId));
    };

    return (
        <div className="contest-form-container">
            <h2>Create New Contest</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
                </label>
                <label>
                    Contest Start Date:
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                </label>
                <label>
                    Start time:
                    <input type="time" value={startTime} onChange={e => setstartTime(e.target.value)} required />
                </label>
                <label>
                    Contest End Date:
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                </label>
                <label>
                    End time:
                    <input type="time" value={endTime} onChange={e => setendTime(e.target.value)} required />
                </label>
                <label>
                    Author:
                    <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author Name" required />
                </label>


                <div className="contest-autosuggest-container">
                    <div className="">Add problem</div>
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
                </div>

                <ul className="contest-selected-problems">
                    {selectedProblems.map(problem => (
                        <li key={problem._id}>
                            {problem.title}
                            <i className="uil uil-times" onClick={() => removeProblem(problem._id)}></i>
                        </li>
                    ))}
                </ul>

                <button type="submit">Create Contest</button>
            </form>
        </div>
    );
};

export default AddContestForm;
