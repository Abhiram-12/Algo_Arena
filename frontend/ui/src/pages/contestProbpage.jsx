import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from "react-resizable-panels";
import '../styles/probPage.css';

const ContestProbpage = () => {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState('cpp');
  const [problem, setProblem] = useState(null);
  const [activeSection, setActiveSection] = useState('output');
  const { contestId, problemId } = useParams();
  const [timeLeft, setTimeLeft] = useState(null);
  const [Endtime, setEndtime] = useState(null);
  const [runResp, setRunresp] = useState(null);
  const [submitResp, setSubmitresp] = useState([]);


  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problems/${problemId}`);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    fetchProblemDetails();
  }, [contestId, problemId]);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/contests/${contestId}`);
        const data = response.data;
        setEndtime(data.end_time);
      } catch (err) {
        console.error(err);
      }
    };

    fetchContestDetails();
  }, [contestId]);

  useEffect(() => {
    if (Endtime) {
      const endTimeDate = new Date(Endtime);
      let timerInterval;

      const updateTimer = () => {
        const now = new Date();
        const timeRemaining = endTimeDate - now;
        if (timeRemaining > 0) {
          const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
          const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(null);
          clearInterval(timerInterval);
        }
      };
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [Endtime]);

  if (!problem) {
    return <loading />;
  }

  function handleEditorChange(value, event) {
    setCode(value);
  }

  function handleLangChange(event) {
    setLang(event.target.value);
  }

  const handleRun = async (e) => {
    try {
      handleSectionToggle("output");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/run`,
        { lang: lang, code: code, input: problem.sampleTestcases[0].input },
        { withCredentials: true }
      );
      let data = response.data.output;
      setRunresp(data);
      console.log(response.data.output);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setRunresp(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        setRunresp("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        setRunresp("An error occurred while settin up request.");

      }
    }
  };

  const handleSectionToggle = (section) => {
    setActiveSection(section);
  };

  const handleError = (err) => toast.error(err, { position: "top-right" })
  const handleSuccess = (msg) => toast.success(msg, { position: "top-right" })

  const handleSubmit = async (e) => {
    try {
      handleSectionToggle("verdict")
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/problems/${problemId}/submit`,
        { lang: lang, code: code },
        { withCredentials: true }
      );
      console.log(response);
      let data = response.data.results;

      setSubmitresp(data);
      // console.log(data);
      const allPassed = data.every((testcase) => testcase.passed);
      if (allPassed) {
        handleSuccess(response.data.submission.status);
      } else {
        handleError(response.data.submission.status);
      }
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  return (
    <div className="wrapper">
      <PanelGroup direction="horizontal">
        <Panel className="left-section" defaultSize={50}>
          <div className="left">
            <div className="left-top-bar">
              <span className=" set-description" >Description</span>
            </div>
            <div className="description">
              <h3 className="prob-heading">{problem.title}</h3>
              <div className="problem-description">
                <p>
                  {problem.description.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line.startsWith("**") && line.endsWith("**") ? (
                        <strong>{line.replace(/\*\*/g, "")}</strong>
                      ) : (
                        line
                      )}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </div>
              <h4>Input Format:</h4>
              <p>{problem.inputFormat}</p>
              <h4>Output Format:</h4>
              <p>{problem.outputFormat}</p>
              <h4>Sample Testcases:</h4>
              {problem.sampleTestcases.map((testcase, index) => (
                <div key={index} className="test">
                  <p>Input:</p>
                  <pre className="test-inp">
                    {testcase.input.split("\n").map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </pre>
                  <p>Output:</p>
                  <pre className="test-inp" >{testcase.output}</pre>
                </div>
              ))}
              <h4>Tags:</h4>
              <p>
                {problem.tags
                  .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1))
                  .join(", ")}
              </p>
              <h4>Difficulty:</h4>
              <p>
                {problem.difficulty.charAt(0).toUpperCase() +
                  problem.difficulty.slice(1)}
              </p>
            </div>
          </div>
        </Panel>
        <PanelResizeHandle />
        <Panel className="right-section" defaultSize={50}>
          <PanelGroup direction="vertical">
            <Panel className="right-top" defaultSize={65}>
              <div className="top-bar">
                <div className="lang-select">
                  <select value={lang} onChange={handleLangChange}>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="py">Python</option>
                  </select>
                </div>
                {(timeLeft!==null) &&
                  <div className="timer">
                    <span>Contest end in: {timeLeft}</span>
                  </div>
                }
              </div>
              <div className="editor-container">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  defaultLanguage={lang}
                  defaultValue={code}
                  onChange={handleEditorChange}
                  options={{ fontSize: 18 }}
                />
              </div>
            </Panel>
            <PanelResizeHandle />
            <Panel className="right-bottom" defaultSize={35}>
              <div className="right-bottom-wrapper">
                <div className="result-section">
                  <div className="result-buttons">
                    <div
                      // className={activeSection === "output" ? "active" : ""}
                      onClick={() => handleSectionToggle("output")}
                    >
                      Output
                    </div>
                    <div
                      // className={activeSection === "verdict" ? "active" : ""}
                      onClick={() => handleSectionToggle("verdict")}
                    >
                      Verdict
                    </div>
                  </div>
                  <div className="result-content">
                    {activeSection === "output" ? (
                      <div className="output">
                        {runResp
                          ? runResp
                            .split("\n")
                            .map((line, index) => <div key={index}>{line}</div>)
                          : "No output"}
                      </div>
                    ) : (
                      <div className="verdict">
                        {submitResp.length > 0 ? (
                          submitResp.map((testcase, index) => (
                            <div
                              key={index}
                              className={`testcase ${testcase.passed ? "passed" : "failed"}`}
                            >
                              <p>{`Testcase ${index + 1}: ${testcase.passed ? "Passed" : "Failed"}`}</p>
                              {/* <p>Output: {testcase.output}</p> */}
                            </div>
                          ))
                        ) : (
                          <div>No verdict</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="run-btns">
                  <button className=" run-btn btn-1" onClick={handleRun}>Run code</button>
                  <button className=" run-btn btn-2" onClick={handleSubmit}> Submit code</button>
                </div>
              </div>
            </Panel>
            <ToastContainer />
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default ContestProbpage;
