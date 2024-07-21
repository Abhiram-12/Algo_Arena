import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import '../styles/playground.css'

const Playground = () => {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function handleEditorChange(value, event) {
    setCode(value);
  }

  function handleInput(event) {
    setInput(event.target.value);
  }

  function handleLangChange(event) {
    setLang(event.target.value);
  }

  const handleRun = async (e) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/run",
        { lang: lang, code: code ,input:input},
        { withCredentials: true }
      );
      console.log(response);
      let data = response.data.output;
      console.log(data);
      setOutput(data);

    } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          setOutput(error.response.data.message); 
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            setOutput("No response received from the server.");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            setOutput("An error occurred while setting up the request.");
        }
    }
  };

  return (
    <>
      <div className="playground">
        <h1 className="playground-title">Play ground</h1>
        <PanelGroup direction="horizontal">
          <Panel className="left-section" defaultSize={60}>
            <div>
              <div className="top-bar">
                <select value={lang} onChange={handleLangChange}>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="py">Python</option>
                </select>
              </div>
              <Editor
                height="80vh"
                theme="vs-dark"
                defaultLanguage={lang}
                defaultValue={code}
                onChange={handleEditorChange}
                options={{ fontSize: 18 }}
              />
            </div>
          </Panel>
          <PanelResizeHandle />
          <Panel className="right-section" defaultSize={40}>
            <PanelGroup direction="vertical">
              <Panel className="right-top" defaultSize={40}>
                <div className="playground-input">
                  <h3 className="playground-heading">Input</h3>
                  <textarea
                    id="input"
                    onChange={handleInput}
                    className="playground-textarea"
                    style={{ width: '100%', height: '350%',fontSize: '18px'  }}
                    value={input}
                  />
                </div>
              </Panel>
              <PanelResizeHandle />
              <Panel className="right-bottom" defaultSize={60}>
                <div className="playground-output">
                  <h3 className="playground-heading">Output</h3>                  
                  <div className={output ? "show-output" : "output"}>{output}</div>
                </div>
              </Panel>
            </PanelGroup>
            <button className="playground-btn" onClick={handleRun}>
              Run code
            </button>
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
};

export default Playground;
