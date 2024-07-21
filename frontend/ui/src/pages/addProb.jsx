import React, { useState } from 'react';
import axios from 'axios';
import '../styles/addprob.css';

function AddProblem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    tags: '',
    difficulty: ''
  });

  const [sampleTestcases, setSampleTestcases] = useState([{ input: '', output: '' }]);
  const [testcases, setTestcases] = useState([{ input: '', output: '' }]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTestcaseChange = (index, e, type) => {
    const updatedTestcases = type === 'sample' ? [...sampleTestcases] : [...testcases];
    updatedTestcases[index][e.target.name] = e.target.value;
    type === 'sample' ? setSampleTestcases(updatedTestcases) : setTestcases(updatedTestcases);
  };

  const addTestcase = (type) => {
    type === 'sample' ? setSampleTestcases([...sampleTestcases, { input: '', output: '' }]) : setTestcases([...testcases, { input: '', output: '' }]);
  };

  const removeTestcase = (index, type) => {
    const updatedTestcases = type === 'sample' ? [...sampleTestcases] : [...testcases];
    updatedTestcases.splice(index, 1);
    type === 'sample' ? setSampleTestcases(updatedTestcases) : setTestcases(updatedTestcases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedFormData = {
      ...formData,
      sampleTestcases,
      testcases,
      tags: formData.tags.split(',').map(tag => tag.trim())
    };

    try {
      const response = await axios.post('http://localhost:8080/addprob', parsedFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="title">Add a Problem</div>
      <div className="add-prob-container">
        <form onSubmit={handleSubmit}>
          <h2 className='heading'>Contribute a Problem</h2>
          <label>
            Title:<input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>

          <label>
            Description:
            <textarea type="text" name="description" value={formData.description} onChange={handleChange} />
          </label>

          <label>
            Input format:
            <textarea type="text" name="inputFormat" value={formData.inputFormat} onChange={handleChange} />
          </label>

          <label>
            Output format:
            <textarea type="text" name="outputFormat" value={formData.outputFormat} onChange={handleChange} />
          </label>

          <label>
            Tags (comma-separated):
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
          </label>

          <label>
            Difficulty:
            <input type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} />
          </label>

          <label>Sample Testcases:</label>
          {sampleTestcases.map((testcase, index) => (
            <div className="testcase" key={index}>
              <label>
                Input:
                <textarea
                  type="text"
                  name="input"
                  value={testcase.input}
                  onChange={(e) => handleTestcaseChange(index, e, 'sample')}
                />
              </label>
              <label>
                Output:
                <textarea
                  type="text"
                  name="output"
                  value={testcase.output}
                  onChange={(e) => handleTestcaseChange(index, e, 'sample')}
                />
              </label>
              <button type="button" className="remove-btn" onClick={() => removeTestcase(index, 'sample')}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addTestcase('sample')}>
            Add Sample Testcase
          </button>

          <label>Testcases:</label>
          {testcases.map((testcase, index) => (
            <div className="testcase" key={index}>
              <label>
                Input:
                <textarea
                  type="text"
                  name="input"
                  value={testcase.input}
                  onChange={(e) => handleTestcaseChange(index, e, 'test')}
                />
              </label>
              <label>
                Output:
                <textarea
                  type="text"
                  name="output"
                  value={testcase.output}
                  onChange={(e) => handleTestcaseChange(index, e, 'test')}
                />
              </label>
              <button type="button" className="remove-btn" onClick={() => removeTestcase(index, 'test')}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addTestcase('test')}>
            Add Testcase
          </button>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </>
  );
}

export default AddProblem;
