import React, { useState } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../styles/addContest.css'


const AddContestForm = () => {
    
    const [userQuery, setUserquery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState('');

    
    const fetchSuggestions = async ({ value }) => {
        try {
            const response = await axios.get('http://localhost:8080/search/user', { params: { query: value } });
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event, { suggestion }) => {
        setSelectedUsers([...selectedUsers, suggestion]);
        setUserquery('');
    };

    const getSuggestionValue = suggestion => suggestion.name;

    const renderSuggestion = suggestion => (
        <div>
            {suggestion.name}
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const adminData = {
            user_ids: selectedUsers.map(p => p._id),
        };
        try {
            const response =await axios.post('http://localhost:8080/admin/addadmin', adminData, { withCredentials: true });
            console.log(response);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data)
            console.error('Error in adding admin:', error);
        }
    };

    const removeProblem = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
    };

    return (
        <div className="contest-form-container">
            <h2>Add admin</h2>
            <form onSubmit={handleSubmit}>
                <div className="contest-autosuggest-container">
                    <Autosuggest
                        inputProps={{
                            placeholder: "Search users",
                            value: userQuery,
                            onChange: (e, { newValue }) => setUserquery(newValue),
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
                    {selectedUsers.map(user => (
                        <li key={user._id}>
                            {user.name}
                            <i className="uil uil-times" onClick={() => removeProblem(problem._id)}></i>
                        </li>
                    ))}
                </ul>

                <button type="submit" onClick={()=>setMessage('')}>Add admin</button>
                {message &&(
        <div className="error">{message}</div>
      )}
            </form>
        </div>
    );
};

export default AddContestForm;
